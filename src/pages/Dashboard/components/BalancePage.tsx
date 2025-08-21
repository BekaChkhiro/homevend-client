import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, History, Loader2 } from "lucide-react";
import { balanceApi } from '@/lib/api';

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
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  const fetchBalance = async () => {
    try {
      const data = await balanceApi.getBalance();
      setBalanceData(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0 || amount > 10000) {
      alert('გთხოვთ შეიყვანოთ სწორი თანხა (0.01-10,000₾)');
      return;
    }

    setTopUpLoading(true);
    try {
      const result = await balanceApi.topUp(amount, 'test');
      alert(`შევსება წარმატებით შესრულდა! ახალი ბალანსი: ${result.newBalance}₾`);
      setTopUpAmount('');
      fetchBalance(); // Refresh balance data
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
  }, []);

  if (loading) {
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
              <Wallet className="h-5 w-5 text-gray-400" />
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
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">თანხა (₾)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="100" 
                min="0.01"
                max="10000"
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">მინ. 10₾ - მაქს. 10,000₾</p>
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
              disabled={topUpLoading || !topUpAmount}
            >
              {topUpLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {topUpLoading ? 'შევსება...' : 'შევსება (ტესტისთვის)'}
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
    </div>
  );
};