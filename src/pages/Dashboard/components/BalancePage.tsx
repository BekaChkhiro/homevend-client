import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Wallet, History, Loader2, ExternalLink, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { balanceApi } from '@/lib/api';

interface PaymentProvider {
  id: string;
  name: string;
  displayName: string;
  isEnabled: boolean;
  minAmount: number;
  maxAmount: number;
  currency: string;
  description?: string;
}

interface BalanceData {
  balance: number;
  recentTransactions: Array<{
    id: number;
    uuid: string;
    type: string;
    status: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    paymentMethod: string;
    createdAt: string;
    metadata?: any;
  }>;
  lastTopUp: {
    amount: number;
    createdAt: string;
    paymentMethod: string;
  } | null;
}

export const BalancePage = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('test');
  const [loading, setLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [paymentStatusDialog, setPaymentStatusDialog] = useState<{
    show: boolean;
    type: 'success' | 'failed' | 'processing';
    title: string;
    message: string;
    amount?: number;
    newBalance?: number;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);

  const fetchBalance = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setBalanceRefreshing(true);
      const data = await balanceApi.getBalance();
      setBalanceData(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setBalanceRefreshing(false);
    }
  };

  const fetchPaymentProviders = async () => {
    try {
      const providers = await balanceApi.getPaymentProviders();
      setPaymentProviders(providers);
      if (providers.length > 0) {
        setSelectedProvider(providers[0].id);
      }
    } catch (error) {
      console.error('Error fetching payment providers:', error);
    } finally {
      setProvidersLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    const provider = paymentProviders.find(p => p.id === selectedProvider);
    
    if (!provider) {
      alert('გთხოვთ აირჩიოთ გადახდის მეთოდი');
      return;
    }

    if (!amount || amount < provider.minAmount || amount > provider.maxAmount) {
      alert(`გთხოვთ შეიყვანოთ სწორი თანხა (${provider.minAmount}-${provider.maxAmount}₾)`);
      return;
    }

    setTopUpLoading(true);
    try {
      const result = await balanceApi.initiateTopUp(amount, selectedProvider);
      
      if (result.provider === 'test') {
        // Test payment completed immediately
        alert(`შევსება წარმატებით შესრულდა! ახალი ბალანსი: ${result.data.newBalance}₾`);
        setTopUpAmount('');
        fetchBalance();
      } else if (result.provider === 'flitt') {
        // Redirect to Flitt payment page
        if (result.data.checkoutUrl) {
          window.open(result.data.checkoutUrl, '_blank');
          alert('გადახდის გვერდი გაიხსნა ახალ ტაბში. გადახდის შემდეგ ბალანსი ავტომატურად განახლდება.');
        } else {
          alert('გადახდის ლინკის შექმნა ვერ მოხერხდა');
        }
      } else if (result.provider === 'bog') {
        // Redirect to BOG payment page
        if (result.data.checkoutUrl) {
          // Show processing dialog
          setPaymentStatusDialog({
            show: true,
            type: 'processing',
            title: 'გადამისამართება BOG-ზე',
            message: 'თქვენ გადამისამართდებით BOG-ის გადახდის გვერდზე. გადახდის შემდეგ ავტომატურად დაბრუნდებით ბალანსის გვერდზე.',
            amount: amount
          });
          
          // Redirect after a short delay to let user see the message
          setTimeout(() => {
            window.location.href = result.data.checkoutUrl;
          }, 2000);
        } else {
          alert('BOG გადახდის ლინკის შექმნა ვერ მოხერხდა');
        }
      }
    } catch (error: any) {
      console.error('Error during top-up:', error);
      const errorMessage = error.response?.data?.message || 'შეცდომა შევსების დროს';
      alert(`შეცდომა: ${errorMessage}`);
    } finally {
      setTopUpLoading(false);
    }
  };

  const setQuickAmount = (amount: number) => {
    setTopUpAmount(amount.toString());
  };

  const getServiceLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'vip': 'VIP',
      'vip_plus': 'VIP+',
      'super_vip': 'SUPER VIP',
      'auto_renew': 'ავტო განახლება',
      'color_separation': 'ფერადი გამოყოფა'
    };
    return labels[serviceType] || serviceType;
  };
  
  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'top_up': 'ბალანსის შევსება',
      'vip_purchase': 'VIP სერვისი',
      'service_purchase': 'დამატებითი სერვისი',
      'property_post': 'განცხადების განთავსება'
    };
    return labels[type] || type;
  };

  const getTransactionDescription = (transaction: any) => {
    // If we have metadata, create a better description
    if (transaction.metadata?.purchaseType && transaction.metadata?.propertyTitle) {
      const services = [];
      
      // Add VIP service
      if (transaction.metadata.vipService) {
        const vipService = transaction.metadata.vipService;
        const vipLabel = getServiceLabel(vipService.serviceType);
        services.push(`${vipLabel} (${vipService.days} დღე)`);
      }
      
      // Add additional services
      if (transaction.metadata.additionalServices) {
        transaction.metadata.additionalServices.forEach((service: any) => {
          const serviceLabel = getServiceLabel(service.serviceType);
          services.push(`${serviceLabel} (${service.days} დღე)`);
        });
      }
      
      if (services.length > 0) {
        return `${services.join(' + ')} - ${transaction.metadata.propertyTitle}`;
      }
    }
    
    // Fallback to original description
    return transaction.description;
  };

  useEffect(() => {
    fetchBalance();
    fetchPaymentProviders();
    
    // Set up periodic balance refresh to catch webhook-updated payments
    const balanceRefreshInterval = setInterval(() => {
      fetchBalance();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceRefreshInterval);
  }, []);

  // Check URL for payment success/failure and refresh balance
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      // Show success dialog and refresh balance
      setPaymentStatusDialog({
        show: true,
        type: 'processing',
        title: 'გადახდა დაიწყო',
        message: 'თქვენი გადახდა წარმატებით შესრულდა BOG-ის მხრიდან. ბალანსი ახლა ვერიფიცირდება და ავტომატურად განახლდება...'
      });
      
      // Start polling for balance updates
      let pollCount = 0;
      const maxPolls = 12; // Poll for 1 minute (5 seconds * 12)
      const originalBalance = balanceData?.balance || 0;
      
      const pollBalance = async () => {
        pollCount++;
        try {
          const data = await balanceApi.getBalance();
          
          // Check if balance has been updated
          if (data.balance > originalBalance) {
            const increase = data.balance - originalBalance;
            setBalanceData(data);
            setPaymentStatusDialog({
              show: true,
              type: 'success',
              title: 'ბალანსი წარმატებით შევსდა!',
              message: `თქვენი ბალანსი შევსდა ${increase.toFixed(2)}₾-ით. ახალი ბალანსი: ${data.balance.toFixed(2)}₾`,
              amount: increase,
              newBalance: data.balance
            });
            window.history.replaceState({}, '', window.location.pathname);
            return;
          }
          
          // Continue polling if balance hasn't updated yet and we haven't exceeded max polls
          if (pollCount < maxPolls) {
            setTimeout(pollBalance, 5000);
          } else {
            // Timeout reached, show manual refresh option
            setBalanceData(data);
            setPaymentStatusDialog({
              show: true,
              type: 'success',
              title: 'გადახდა განხორციელდა',
              message: 'თქვენი გადახდა წარმატებით დასრულდა. თუ ბალანსი ჯერ არ განახლდა, გთხოვთ რამდენიმე წუთში გაამტკიცოთ განახლების ღილაკზე.',
            });
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (error) {
          console.error('Error polling balance:', error);
          if (pollCount < maxPolls) {
            setTimeout(pollBalance, 5000);
          } else {
            setPaymentStatusDialog({
              show: true,
              type: 'success',
              title: 'გადახდა განხორციელდა',
              message: 'თქვენი გადახდა განხორციელდა. გთხოვთ რამდენიმე წუთში გაამტკიცოთ განახლების ღილაკზე ბალანსის შესამოწმებლად.',
            });
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      };
      
      // Start polling after a short delay
      setTimeout(pollBalance, 2000);
      
    } else if (paymentStatus === 'failed') {
      // Show failure dialog
      setPaymentStatusDialog({
        show: true,
        type: 'failed',
        title: 'გადახდა ვერ განხორციელდა',
        message: 'თქვენი გადახდა ვერ შესრულდა. გთხოვთ სცადოთ ხელახლა ან გამოიყენოთ სხვა გადახდის მეთოდი.'
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [balanceData?.balance]);

  if (loading || providersLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">ბალანსის შევსება</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* მიმდინარე ბალანსი */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">მიმდინარე ბალანსი</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchBalance(true)}
                  disabled={balanceRefreshing}
                  className="p-1 h-8 w-8"
                >
                  <RefreshCw className={`h-4 w-4 ${balanceRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Wallet className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">{balanceData?.balance?.toFixed(2) || '0.00'} ₾</div>
            <p className="text-sm text-gray-500 mt-2">
              ხელმისაწვდომი თანხა განცხადებების განთავსებისთვის
            </p>
          </Card>
          
          {/* ბოლო ტრანზაქცია */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">ბოლო შევსება</h3>
              <History className="h-5 w-5 text-gray-400" />
            </div>
            {balanceData?.lastTopUp ? (
              <div>
                <div className="text-lg font-medium">{balanceData.lastTopUp.amount.toFixed(2)} ₾</div>
                <p className="text-sm text-gray-500">
                  {new Date(balanceData.lastTopUp.createdAt).toLocaleDateString('ka-GE')} - {balanceData.lastTopUp.paymentMethod}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">ჯერ არ გაქვთ შევსებული</p>
            )}
          </Card>
        </div>
        
        {/* შევსების ფორმა */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-medium mb-4">ბალანსის შევსება</h3>
          
          <div className="space-y-6">
            {/* Payment Provider Selection */}
            <div>
              <Label className="text-base font-medium">გადახდის მეთოდი</Label>
              <RadioGroup 
                value={selectedProvider} 
                onValueChange={setSelectedProvider}
                className="mt-2"
              >
                {paymentProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={provider.id} id={provider.id} />
                    <div className="flex-1">
                      <Label htmlFor={provider.id} className="cursor-pointer font-medium">
                        {provider.displayName}
                      </Label>
                      {provider.description && (
                        <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        ლიმიტი: {provider.minAmount}₾ - {provider.maxAmount}₾
                      </p>
                    </div>
                    {(provider.id === 'flitt' || provider.id === 'bog') && (
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="amount">თანხა (₾)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="100" 
                min={paymentProviders.find(p => p.id === selectedProvider)?.minAmount || 1}
                max={paymentProviders.find(p => p.id === selectedProvider)?.maxAmount || 10000}
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              {paymentProviders.find(p => p.id === selectedProvider) && (
                <p className="text-xs text-gray-500 mt-1">
                  მინ. {paymentProviders.find(p => p.id === selectedProvider)!.minAmount}₾ - 
                  მაქს. {paymentProviders.find(p => p.id === selectedProvider)!.maxAmount}₾
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" type="button" onClick={() => setQuickAmount(50)}>50₾</Button>
              <Button variant="outline" type="button" onClick={() => setQuickAmount(100)}>100₾</Button>
              <Button variant="outline" type="button" onClick={() => setQuickAmount(200)}>200₾</Button>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleTopUp}
              disabled={topUpLoading || !topUpAmount || !selectedProvider}
            >
              {topUpLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {topUpLoading ? 'შევსება...' : 
               selectedProvider === 'flitt' ? 'ბანკის ბარათით გადახდა (Flitt)' :
               selectedProvider === 'bog' ? 'ბანკის ბარათით გადახდა (BOG)' : 'შევსება (ტესტისთვის)'}
            </Button>
          </div>
        </Card>
        
        {/* ტრანზაქციების ისტორია */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-medium mb-4">ტრანზაქციების ისტორია</h3>
          {balanceData?.recentTransactions && balanceData.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {balanceData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{getTransactionDescription(transaction)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('ka-GE')} - {getTransactionTypeLabel(transaction.type)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      transaction.type === 'top_up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'top_up' ? '+' : '-'}{transaction.amount.toFixed(2)} ₾
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.status === 'completed' ? 'დასრულებული' : 
                       transaction.status === 'pending' ? 'მიმდინარე' : 
                       transaction.status === 'failed' ? 'ვერ შესრულდა' : 'გაუქმებული'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>ჯერ არ გაქვთ ტრანზაქციები</p>
            </div>
          )}
        </Card>
      </div>

      {/* Payment Status Dialog */}
      <Dialog open={paymentStatusDialog.show} onOpenChange={(open) => setPaymentStatusDialog({ ...paymentStatusDialog, show: open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {paymentStatusDialog.type === 'success' && <CheckCircle className="h-8 w-8 text-green-500" />}
              {paymentStatusDialog.type === 'failed' && <AlertCircle className="h-8 w-8 text-red-500" />}
              {paymentStatusDialog.type === 'processing' && <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />}
              <div>
                <DialogTitle className="text-xl">{paymentStatusDialog.title}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="text-base leading-relaxed">
            {paymentStatusDialog.message}
          </DialogDescription>
          {paymentStatusDialog.type !== 'processing' && (
            <div className="flex justify-end gap-2 mt-4">
              {paymentStatusDialog.type === 'success' && paymentStatusDialog.newBalance && (
                <Button
                  variant="outline"
                  onClick={() => fetchBalance(true)}
                  disabled={balanceRefreshing}
                >
                  {balanceRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  ბალანსის განახლება
                </Button>
              )}
              <Button onClick={() => setPaymentStatusDialog({ ...paymentStatusDialog, show: false })}>
                {paymentStatusDialog.type === 'failed' ? 'ხელახლა ცდა' : 'კარგი'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};