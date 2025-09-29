import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Wallet, History, Loader2, ExternalLink, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { balanceApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import DebugInfo from '@/components/DebugInfo';

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
  const { t } = useTranslation('userDashboard');
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
      console.log('🔄 Fetching balance data...');
      const data = await balanceApi.getBalance();
      console.log('✅ Balance data received:', data);
      setBalanceData(data);
    } catch (error) {
      console.error('❌ Error fetching balance:', error);
      // Set a default balance structure to prevent white screen
      setBalanceData({
        balance: 0,
        recentTransactions: [],
        lastTopUp: null
      });
    } finally {
      setLoading(false);
      if (showRefreshing) setBalanceRefreshing(false);
    }
  };

  const fetchPaymentProviders = async () => {
    try {
      console.log('🔄 Fetching payment providers...');
      const providers = await balanceApi.getPaymentProviders();
      console.log('✅ Payment providers received:', providers);
      setPaymentProviders(providers);
      if (providers.length > 0) {
        setSelectedProvider(providers[0].id);
      }
    } catch (error) {
      console.error('❌ Error fetching payment providers:', error);
      // Set default providers to prevent issues
      setPaymentProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    const provider = paymentProviders.find(p => p.id === selectedProvider);
    
    if (!provider) {
      alert(t('payment.selectPaymentMethod'));
      return;
    }

    if (!amount || amount < provider.minAmount || amount > provider.maxAmount) {
      alert(`${t('payment.invalidAmountAlert')} (${provider.minAmount}-${provider.maxAmount}₾)`);
      return;
    }

    setTopUpLoading(true);
    try {
      const result = await balanceApi.initiateTopUp(amount, selectedProvider);
      
      if (result.provider === 'test') {
        // Test payment completed immediately
        alert(`${t('payment.topUpSuccessAlert')}: ${result.data.newBalance}₾`);
        setTopUpAmount('');
        fetchBalance();
      } else if (result.provider === 'flitt') {
        // Redirect to Flitt payment page
        if (result.data.checkoutUrl) {
          window.open(result.data.checkoutUrl, '_blank');
          alert(t('payment.paymentPageOpened'));
        } else {
          alert(t('payment.paymentLinkError'));
        }
      } else if (result.provider === 'bog') {
        // Redirect to BOG payment page
        if (result.data.checkoutUrl) {
          // Show processing dialog
          setPaymentStatusDialog({
            show: true,
            type: 'processing',
            title: t('payment.redirectToBOG'),
            message: t('payment.redirectMessage'),
            amount: amount
          });
          
          // Redirect after a short delay to let user see the message
          setTimeout(() => {
            window.location.href = result.data.checkoutUrl;
          }, 2000);
        } else {
          alert(t('payment.paymentLinkError'));
        }
      }
    } catch (error: any) {
      console.error('Error during top-up:', error);
      const errorMessage = error.response?.data?.message || t('payment.errorDuringTopUp');
      alert(`${t('payment.errorAlert')}: ${errorMessage}`);
    } finally {
      setTopUpLoading(false);
    }
  };

  const setQuickAmount = (amount: number) => {
    setTopUpAmount(amount.toString());
  };

  const getServiceLabel = (serviceType: string) => {
    const normalizedType = serviceType.replace(/_/g, '');
    const key = `serviceLabels.${normalizedType}`;
    const translated = t(key);
    if (translated === key) {
      // Fallback for service-specific labels
      const paymentKey = `payment.serviceLabels.${serviceType}`;
      const paymentTranslated = t(paymentKey);
      return paymentTranslated !== paymentKey ? paymentTranslated : serviceType;
    }
    return translated;
  };
  
  const getTransactionTypeLabel = (type: string) => {
    const key = `payment.transactionTypes.${type}`;
    const translated = t(key);
    return translated !== key ? translated : type;
  };

  const getTransactionDescription = (transaction: any) => {
    // If we have metadata, create a better description
    if (transaction.metadata?.purchaseType && transaction.metadata?.propertyTitle) {
      const services = [];
      
      // Add VIP service
      if (transaction.metadata.vipService) {
        const vipService = transaction.metadata.vipService;
        const vipLabel = getServiceLabel(vipService.serviceType);
        const daysLabel = vipService.days === 1 ? t('payment.day') : t('payment.days');
        services.push(`${vipLabel} (${vipService.days} ${daysLabel})`);
      }
      
      // Add additional services
      if (transaction.metadata.additionalServices) {
        transaction.metadata.additionalServices.forEach((service: any) => {
          const serviceLabel = getServiceLabel(service.serviceType);
          const daysLabel = service.days === 1 ? t('payment.day') : t('payment.days');
          services.push(`${serviceLabel} (${service.days} ${daysLabel})`);
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

    // Add window event listener to detect when user returns from payment
    const handlePopState = () => {
      console.log('🔄 Navigation detected - checking for payment status');
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      if (paymentStatus) {
        console.log('🚀 Payment status detected after navigation:', paymentStatus);
        // Force re-check by updating a state that triggers useEffect
        window.dispatchEvent(new Event('payment-return'));
      }
    };

    const handlePaymentReturn = () => {
      console.log('🎯 Payment return event triggered');
      // This will force the payment useEffect to run again
      setBalanceRefreshing(prev => !prev);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('payment-return', handlePaymentReturn);

    return () => {
      clearInterval(balanceRefreshInterval);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('payment-return', handlePaymentReturn);
    };
  }, []);

  // Check URL for payment success/failure and refresh balance
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    console.log('🔍 Payment status from URL:', paymentStatus);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 useEffect triggered due to URL change');

    if (paymentStatus === 'success') {
      console.log('🚀 Payment success detected! Starting immediate verification...');

      // Immediately show processing dialog to prevent white screen
      setPaymentStatusDialog({
        show: true,
        type: 'processing',
        title: t('payment.paymentStarted'),
        message: t('payment.paymentVerifying')
      });

      // Ensure balanceData is set so component renders properly
      if (!balanceData) {
        setBalanceData({
          balance: 0,
          recentTransactions: [],
          lastTopUp: null
        });
      }

      // Trigger immediate verification for recent payments (especially for Flitt)
      const triggerVerification = async () => {
        try {
          console.log('🔄 Triggering immediate Flitt payment verification...');

          // First get current user to get their ID for Flitt immediate verification with retry
          let userId = null;
          let retryCount = 0;
          const maxRetries = 3;

          const getUserId = () => {
            try {
              // Try multiple localStorage keys
              const storedUser = localStorage.getItem('user') ||
                               localStorage.getItem('currentUser') ||
                               localStorage.getItem('authUser');

              if (storedUser) {
                const currentUser = JSON.parse(storedUser);
                return currentUser.id || currentUser.userId;
              }

              // Also try token-based lookup if available
              const token = localStorage.getItem('token');
              if (token) {
                console.log('🔍 User data not found, but token exists - will proceed with general verification');
                return 'token-based'; // Special marker to indicate we should try general verification
              }

              return null;
            } catch (err) {
              console.error('Error parsing user from localStorage:', err);
              return null;
            }
          };

          // Retry logic for user ID detection
          while (!userId && retryCount < maxRetries) {
            userId = getUserId();
            if (!userId) {
              retryCount++;
              console.log(`🔄 User ID not found, retry ${retryCount}/${maxRetries}`);
              await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
            }
          }

          console.log(`🎯 User ID detection result: ${userId} (after ${retryCount} retries)`);

          if (userId && userId !== 'token-based') {
            // Call immediate Flitt verification endpoint with actual user ID
            console.log(`🎯 Calling immediate Flitt verification for user ${userId}...`);
            const immediateResult = await balanceApi.verifyFlittImmediate(userId);
            console.log('✅ Immediate Flitt verification result:', immediateResult);

            // Check verification results
            const completedCount = immediateResult.results?.filter(r => r.status === 'completed').length || 0;
            const failedCount = immediateResult.results?.filter(r => r.status === 'failed').length || 0;

            if (completedCount > 0) {
              console.log(`🎉 ${completedCount} Flitt payments completed! Refreshing balance...`);
              await fetchBalance();

              // Show success message and redirect to dashboard
              setPaymentStatusDialog({
                show: true,
                type: 'success',
                title: t('payment.balanceSuccessfullyToppedUp'),
                message: t('payment.paymentCompletedMessage') + ' ' + t('common.redirectingToDashboard', 'Redirecting to dashboard...')
              });

              // Clear URL params BEFORE redirect to clean up URL
              window.history.replaceState({}, '', window.location.pathname);

              // Redirect to dashboard after 4 seconds
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 4000);

              return; // Skip general check if Flitt verification succeeded
            }

            if (failedCount > 0) {
              console.log(`❌ ${failedCount} Flitt payments failed!`);

              // Show failure message and redirect to dashboard
              setPaymentStatusDialog({
                show: true,
                type: 'failed',
                title: t('payment.paymentFailed'),
                message: t('payment.paymentFailedMessage') + ' ' + t('common.redirectingToDashboard', 'Redirecting to dashboard...')
              });

              // Clear URL params BEFORE redirect to clean up URL
              window.history.replaceState({}, '', window.location.pathname);

              // Redirect to dashboard after 4 seconds
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 4000);

              return; // Skip general check since we handled the failure
            }
          }

          // Fallback to general recent payments check
          console.log('🔄 Running general payment verification...');
          const result = await balanceApi.checkRecentPayments();
          console.log('✅ General payment verification result:', result);

          // If any payments were completed, refresh balance immediately
          if (result.balanceUpdated) {
            console.log('🎉 Balance was updated! Refreshing...');
            await fetchBalance();
          }
        } catch (error) {
          console.error('❌ Error triggering verification:', error);

          // Enhanced error logging
          if (error.response) {
            console.error('❌ API Response Error:', error.response.status, error.response.data);
          } else if (error.request) {
            console.error('❌ Network Error:', error.message);
          } else {
            console.error('❌ Verification Error:', error.message);
          }

          // Even if verification fails, show a processing dialog to prevent white screen
          setPaymentStatusDialog({
            show: true,
            type: 'processing',
            title: t('payment.paymentStarted'),
            message: t('payment.paymentVerifying') + ' (Retrying...)'
          });

          // Fallback: redirect to dashboard after 6 seconds if verification fails
          setTimeout(() => {
            console.log('⏰ Error fallback timeout - redirecting to dashboard');
            window.location.href = '/dashboard';
          }, 6000);

          // DO NOT clear URL params here - let the redirect handle it
        }
      };

      // Trigger verification immediately
      triggerVerification();

      // Safety fallback: If nothing happens after 15 seconds, redirect anyway
      setTimeout(() => {
        console.log('⏰ Safety timeout reached - redirecting to dashboard');
        window.location.href = '/dashboard';
      }, 15000);

      // Start polling for balance updates
      let pollCount = 0;
      const maxPolls = 15; // Poll for longer - 75 seconds (5 seconds * 15)
      let originalBalance = 0;

      const pollBalance = async () => {
        pollCount++;
        console.log(`🔄 Poll attempt ${pollCount}/${maxPolls} - checking balance...`);
        try {
          const data = await balanceApi.getBalance();

          // Set original balance on first poll if not set
          if (pollCount === 1) {
            originalBalance = data.balance;
            console.log(`💰 Setting original balance: ${originalBalance}`);
          }

          console.log(`💰 Current balance: ${data.balance}, Original: ${originalBalance}`);

          // Check if balance has been updated
          if (data.balance > originalBalance) {
            const increase = data.balance - originalBalance;
            console.log(`🎉 Balance increased by ${increase}! Payment successful!`);
            setBalanceData(data);
            setPaymentStatusDialog({
              show: true,
              type: 'success',
              title: t('payment.balanceSuccessfullyToppedUp'),
              message: t('payment.paymentCompletedMessage') + ' ' + t('common.redirectingToDashboard', 'Redirecting to dashboard...'),
              amount: increase,
              newBalance: data.balance
            });

            // Redirect to dashboard after 4 seconds
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 4000);

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
              title: t('payment.paymentCompleted'),
              message: t('payment.paymentCompletedMessage'),
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
              title: t('payment.paymentCompleted'),
              message: t('payment.paymentCompletedCheckBalance'),
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
        title: t('payment.paymentFailed'),
        message: t('payment.paymentFailedMessage')
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [window.location.search]); // Add URL search params as dependency to trigger on URL changes

  if (loading || providersLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading balance information...</p>
        </div>
      </div>
    );
  }

  // Special handling for payment success page - ensure we always show content
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');

  if (paymentStatus === 'success' && !balanceData) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing payment verification...</p>
        </div>
      </div>
    );
  }

  // Error fallback if balanceData failed to load
  if (!balanceData) {
    return (
      <div className="w-full p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load balance information</h3>
          <p className="text-gray-600 mb-4">There was an issue connecting to the server.</p>
          <Button onClick={() => {
            setLoading(true);
            fetchBalance();
            fetchPaymentProviders();
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('payment.balancePageTitle')}</h2>

        {/* Debug info - only show if URL has debug=true */}
        <DebugInfo show={new URLSearchParams(window.location.search).get('debug') === 'true'} />
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Balance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('payment.currentBalance')}</h3>
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
              {t('payment.availableForAds')}
            </p>
          </Card>
          
          {/* Last Transaction */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('payment.lastTopUp')}</h3>
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
              <p className="text-sm text-gray-500">{t('payment.noTopUpsYet')}</p>
            )}
          </Card>
        </div>
        
        {/* Top-up Form */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-medium mb-4">{t('payment.topUpBalance')}</h3>
          
          <div className="space-y-6">
            {/* Payment Provider Selection */}
            <div>
              <Label className="text-base font-medium">{t('payment.paymentMethod')}</Label>
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
                        {t(`payment.paymentProviders.${provider.displayName}`, { defaultValue: provider.displayName })}
                      </Label>
                      {provider.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {t(`payment.paymentProviders.${provider.description}`, { defaultValue: provider.description })}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {t('payment.limit')}: {provider.minAmount}₾ - {provider.maxAmount}₾
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
              <Label htmlFor="amount">{t('payment.amount')} (₾)</Label>
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
                  {t('common.min')} {paymentProviders.find(p => p.id === selectedProvider)!.minAmount}₾ - 
                  {t('common.max')} {paymentProviders.find(p => p.id === selectedProvider)!.maxAmount}₾
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" type="button" onClick={() => setQuickAmount(50)}>{t('payment.quickAmounts.50')}</Button>
              <Button variant="outline" type="button" onClick={() => setQuickAmount(100)}>{t('payment.quickAmounts.100')}</Button>
              <Button variant="outline" type="button" onClick={() => setQuickAmount(200)}>{t('payment.quickAmounts.200')}</Button>
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
              {topUpLoading ? t('payment.topping') : 
               selectedProvider === 'flitt' ? t('payment.payWithCardFlitt') :
               selectedProvider === 'bog' ? t('payment.payWithCardBOG') : t('payment.topUpForTest')}
            </Button>
          </div>
        </Card>
        
        {/* Transaction History */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-medium mb-4">{t('payment.transactionHistory')}</h3>
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
                      {transaction.status === 'completed' ? t('payment.statuses.completed') : 
                       transaction.status === 'pending' ? t('payment.statuses.pending') : 
                       transaction.status === 'failed' ? t('payment.statuses.failed') : t('payment.statuses.cancelled')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>{t('payment.noTransactions')}</p>
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
                  {t('payment.refreshBalance')}
                </Button>
              )}
              <Button onClick={() => setPaymentStatusDialog({ ...paymentStatusDialog, show: false })}>
                {paymentStatusDialog.type === 'failed' ? t('payment.tryAgain') : t('payment.ok')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};