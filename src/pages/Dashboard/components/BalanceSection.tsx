import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { balanceApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

interface Balance {
  balance: number;
}

export interface BalanceSectionRef {
  refreshBalance: () => void;
}

export const BalanceSection = forwardRef<BalanceSectionRef>((props, ref) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFetchTimeRef = useRef<number>(0);
  const { t } = useTranslation('userDashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBalance = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    console.log('💰 fetchBalance called', { now, timeSinceLastFetch });
    
    // Rate limiting: don't allow fetching more than once every 2 seconds
    if (timeSinceLastFetch < 2000) {
      console.log('⏱️ Rate limiting: balance fetch skipped');
      return;
    }
    
    try {
      console.log('📡 Fetching balance from API...');
      setIsLoading(true);
      setError(null);
      lastFetchTimeRef.current = now;
      const balanceData: Balance = await balanceApi.getBalance();
      console.log('✅ Balance data received:', balanceData);
      setBalance(balanceData.balance || 0);
    } catch (error: any) {
      console.error('❌ Error fetching balance:', error);
      
      // Handle rate limit errors specifically
      if (error.response?.status === 429) {
        setError(t('balance.tooManyRequests'));
        // Don't update lastFetchTime on 429 so it can retry sooner
        lastFetchTimeRef.current = 0;
      } else {
        setError(t('balance.loadError'));
      }
      
      // Don't reset balance on error to avoid flickering
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced refresh function
  const debouncedRefresh = useCallback(() => {
    console.log('🔄 Balance refresh requested');
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      console.log('🔄 Executing debounced balance refresh');
      fetchBalance();
    }, 500); // 500ms debounce
  }, [fetchBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useImperativeHandle(ref, () => ({
    refreshBalance: debouncedRefresh
  }));

  const formatBalance = (amount: number): string => {
    return amount.toFixed(2);
  };

  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex justify-center">
        <div>
          <div className="text-xs text-gray-500 mb-1">{t('balance.title')}</div>
          <div className="font-bold flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : error ? (
              <span className="text-red-500 text-xs">{t('balance.error')}</span>
            ) : (
              `${formatBalance(balance)} ₾`
            )}
          </div>
        </div>
      </div>
      <Button variant="default" size="sm" className="w-full mt-2" onClick={() => {
        // Get the current language from the path
        const pathParts = location.pathname.split('/');
        const lang = pathParts[1] || 'en'; // Default to 'en' if no language found
        navigate(`/${lang}/dashboard/balance`);
      }}>
        {t('balance.topUp')}
      </Button>
    </div>
  );
});
