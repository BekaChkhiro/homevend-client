import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

interface PaymentSuccessPageProps {
  onComplete?: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onComplete }) => {
  const { t } = useTranslation('userDashboard');
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  // Extract language from URL path if not available in params
  const getCurrentLanguage = () => {
    if (lang) return lang;

    // Extract from current URL path
    const pathParts = location.pathname.split('/');
    const possibleLang = pathParts[1];
    if (['en', 'ge', 'ru'].includes(possibleLang)) {
      return possibleLang;
    }

    return 'en'; // default fallback
  };

  const currentLang = getCurrentLanguage();
  const dashboardUrl = `/${currentLang}/dashboard`;
  const balanceUrl = `/${currentLang}/dashboard/balance`;

  // Debug logging
  console.log('🎉 PaymentSuccessPage rendered with:', {
    lang,
    currentLang,
    dashboardUrl,
    balanceUrl,
    countdown,
    pathname: location.pathname,
    search: location.search
  });

  useEffect(() => {
    // Clear URL parameters immediately to clean up the URL
    if (window.location.search.includes('payment=')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Use window.location.href for reliable navigation
          window.location.href = dashboardUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dashboardUrl]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[500px] p-6 bg-gray-50">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8 border">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 {t('payment.paymentSuccessful')}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-4">
          {t('payment.balanceUpdatedThankYou')}
        </p>

        {/* Countdown */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-500" />
            <span className="text-sm text-gray-600">{t('payment.paymentVerifying')}</span>
          </div>
          <p className="text-sm font-medium text-blue-700">
            {t('payment.redirectingToDashboardIn', { seconds: countdown })}
          </p>
        </div>

        {/* Manual buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = dashboardUrl}
            className="w-full"
            size="lg"
          >
            ✅ {t('payment.goToDashboardNow')}
          </Button>

          <Button
            onClick={() => window.location.href = balanceUrl}
            variant="outline"
            className="w-full"
            size="lg"
          >
            💰 {t('payment.viewBalancePage')}
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500 mt-4">
          {t('payment.clickButtonsToNavigate')}
        </p>
      </div>
    </div>
  );
};