import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Currency Context
 * Manages user's preferred display currency and exchange rates
 * All prices are stored in USD in the database, but can be displayed in GEL or USD
 */

export type Currency = 'GEL' | 'USD';

export interface ExchangeRateData {
  usdToGel: number;
  gelToUsd: number;
  lastUpdated: string;
}

export interface CurrencyContextType {
  // User preference
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;

  // Exchange rate data
  exchangeRate: ExchangeRateData | null;
  isLoadingRate: boolean;
  rateError: string | null;

  // Conversion functions
  convertToDisplay: (usdPrice: number) => number;
  convertToUsd: (price: number, fromCurrency: Currency) => number;

  // Formatting functions
  formatPrice: (usdPrice: number, options?: FormatOptions) => string;
  getCurrencySymbol: (currency?: Currency) => string;

  // Utilities
  refreshRate: () => Promise<void>;
}

export interface FormatOptions {
  showCurrency?: boolean; // Show currency code (default: false)
  showBothCurrencies?: boolean; // Show both currencies (default: false)
  decimals?: number; // Number of decimal places (default: 0)
  compact?: boolean; // Compact format for large numbers (default: false)
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Default/fallback exchange rate (1 USD = 2.72 GEL as of Oct 2025)
const FALLBACK_RATE = 2.72;
const RATE_CACHE_KEY = 'exchange_rate_cache';
const CURRENCY_PREFERENCE_KEY = 'preferred_currency';
const RATE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  // Load preferred currency from localStorage
  const [displayCurrency, setDisplayCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(CURRENCY_PREFERENCE_KEY);
    return (stored as Currency) || 'GEL'; // Default to GEL
  });

  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  // Set display currency and persist to localStorage
  const setDisplayCurrency = useCallback((currency: Currency) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem(CURRENCY_PREFERENCE_KEY, currency);
  }, []);

  // Load cached exchange rate from localStorage
  const loadCachedRate = useCallback((): ExchangeRateData | null => {
    try {
      const cached = localStorage.getItem(RATE_CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.fetchedAt).getTime();

      // Check if cache is still valid (less than 24 hours old)
      if (cacheAge < RATE_CACHE_TTL) {
        return {
          usdToGel: data.usdToGel,
          gelToUsd: data.gelToUsd,
          lastUpdated: data.lastUpdated
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to load cached exchange rate:', error);
      return null;
    }
  }, []);

  // Save exchange rate to localStorage
  const saveCachedRate = useCallback((rate: ExchangeRateData) => {
    try {
      const cacheData = {
        ...rate,
        fetchedAt: new Date().toISOString()
      };
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save exchange rate cache:', error);
    }
  }, []);

  // Fetch exchange rate directly from NBG (National Bank of Georgia) API
  const fetchExchangeRate = useCallback(async (): Promise<ExchangeRateData> => {
    try {
      setIsLoadingRate(true);
      setRateError(null);

      // Fetch directly from NBG API
      const response = await fetch('https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json/');

      if (!response.ok) {
        throw new Error('Failed to fetch from NBG API');
      }

      const data = await response.json();

      // NBG API returns: [{ date, currencies: [...] }]
      // Find USD in the currencies array
      const currencies = data[0]?.currencies;
      const usdRate = currencies?.find((curr: any) => curr.code === 'USD');

      if (usdRate && usdRate.rate) {
        const usdToGel = parseFloat(usdRate.rate);

        console.log('✅ Fetched live exchange rate from NBG:', usdToGel, 'GEL per USD');

        const rateData: ExchangeRateData = {
          usdToGel: usdToGel,
          gelToUsd: 1 / usdToGel,
          lastUpdated: usdRate.date || new Date().toISOString()
        };

        // Cache the rate
        saveCachedRate(rateData);
        setExchangeRate(rateData);

        return rateData;
      }

      throw new Error('USD rate not found in NBG response');
    } catch (error: any) {
      console.warn('❌ Failed to fetch from NBG API, using fallback rate:', error);
      setRateError(error.message || 'Failed to fetch exchange rate');

      // Use fallback rate
      const fallbackData: ExchangeRateData = {
        usdToGel: FALLBACK_RATE,
        gelToUsd: 1 / FALLBACK_RATE,
        lastUpdated: new Date().toISOString()
      };
      setExchangeRate(fallbackData);
      return fallbackData;
    } finally {
      setIsLoadingRate(false);
    }
  }, [saveCachedRate]);

  // Initialize exchange rate on mount
  useEffect(() => {
    // Try to load from cache first
    const cached = loadCachedRate();
    if (cached) {
      setExchangeRate(cached);
    } else {
      // Fetch from API if no valid cache
      fetchExchangeRate();
    }
  }, [loadCachedRate, fetchExchangeRate]);

  // Convert USD price to display currency
  const convertToDisplay = useCallback((usdPrice: number): number => {
    if (!exchangeRate) return usdPrice;

    if (displayCurrency === 'USD') {
      return usdPrice;
    } else {
      return usdPrice * exchangeRate.usdToGel;
    }
  }, [displayCurrency, exchangeRate]);

  // Convert any currency to USD
  const convertToUsd = useCallback((price: number, fromCurrency: Currency): number => {
    if (!exchangeRate) return price;

    if (fromCurrency === 'USD') {
      return price;
    } else {
      return price * exchangeRate.gelToUsd;
    }
  }, [exchangeRate]);

  // Get currency symbol
  const getCurrencySymbol = useCallback((currency?: Currency): string => {
    const curr = currency || displayCurrency;
    return curr === 'USD' ? '$' : '₾';
  }, [displayCurrency]);

  // Format price with currency
  const formatPrice = useCallback((
    usdPrice: number,
    options: FormatOptions = {}
  ): string => {
    const {
      showCurrency = false,
      showBothCurrencies = false,
      decimals = 0,
      compact = false
    } = options;

    // Convert to display currency
    const displayPrice = convertToDisplay(usdPrice);

    // Get locale based on current language
    let locale = 'ka-GE';
    switch (i18n.language) {
      case 'ka':
        locale = 'ka-GE';
        break;
      case 'en':
        locale = 'en-US';
        break;
      case 'ru':
        locale = 'ru-RU';
        break;
    }

    // Format number
    const formatted = new Intl.NumberFormat(locale, {
      style: showCurrency ? 'currency' : 'decimal',
      currency: displayCurrency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compact ? 'compact' : 'standard',
    }).format(displayPrice);

    // Add both currencies if requested
    if (showBothCurrencies && displayCurrency === 'GEL') {
      const usdFormatted = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(usdPrice);

      return `${formatted} ($${usdFormatted})`;
    } else if (showBothCurrencies && displayCurrency === 'USD') {
      const gelPrice = usdPrice * (exchangeRate?.usdToGel || FALLBACK_RATE);
      const gelFormatted = new Intl.NumberFormat('ka-GE', {
        style: 'decimal',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(gelPrice);

      return `${formatted} (${gelFormatted} ₾)`;
    }

    // Just add symbol if not showing currency
    if (!showCurrency) {
      return `${getCurrencySymbol()}${formatted}`;
    }

    return formatted;
  }, [convertToDisplay, displayCurrency, exchangeRate, getCurrencySymbol, i18n.language]);

  // Force refresh exchange rate
  const refreshRate = useCallback(async () => {
    await fetchExchangeRate();
  }, [fetchExchangeRate]);

  const value: CurrencyContextType = {
    displayCurrency,
    setDisplayCurrency,
    exchangeRate,
    isLoadingRate,
    rateError,
    convertToDisplay,
    convertToUsd,
    formatPrice,
    getCurrencySymbol,
    refreshRate
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook to use currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
