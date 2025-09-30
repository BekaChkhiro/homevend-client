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
  const [isPopup, setIsPopup] = useState(false);

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
    // Check if this was opened in a popup/new window
    const checkIfPopup = () => {
      // Check if window was opened by another window
      const isNewWindow = window.opener !== null;
      // Check if this is the only tab (popup scenario)
      const isSingleTab = window.history.length <= 2;

      setIsPopup(isNewWindow || isSingleTab);

      console.log('🔍 Window detection:', {
        hasOpener: window.opener !== null,
        historyLength: window.history.length,
        isPopup: isNewWindow || isSingleTab
      });
    };

    checkIfPopup();

    // Clear URL parameters immediately to clean up the URL
    if (window.location.search.includes('payment=')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // If this is a popup window, close it
          if (isPopup) {
            console.log('🚪 Closing popup window after payment success');
            // Try to notify parent window if exists
            if (window.opener && !window.opener.closed) {
              try {
                // Send message to parent window
                window.opener.postMessage({ type: 'payment-success', status: 'completed' }, '*');
                // Focus parent window
                window.opener.focus();
              } catch (e) {
                console.error('Could not communicate with parent window:', e);
              }
            }
            // Close the popup window
            window.close();
            // Fallback: if window.close() doesn't work, redirect
            setTimeout(() => {
              window.location.href = dashboardUrl;
            }, 100);
          } else {
            // Normal redirect for non-popup windows
            window.location.href = dashboardUrl;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dashboardUrl, isPopup]);

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
            {isPopup
              ? t('payment.closingWindowIn', { seconds: countdown }) || `Closing window in ${countdown} seconds...`
              : t('payment.redirectingToDashboardIn', { seconds: countdown })
            }
          </p>
        </div>

        {/* Manual buttons */}
        <div className="space-y-3">
          {isPopup ? (
            <Button
              onClick={() => {
                // Try to notify parent window
                if (window.opener && !window.opener.closed) {
                  try {
                    window.opener.postMessage({ type: 'payment-success', status: 'completed' }, '*');
                    window.opener.focus();
                  } catch (e) {
                    console.error('Could not communicate with parent window:', e);
                  }
                }
                // Close the window
                window.close();
                // Fallback redirect if close doesn't work
                setTimeout(() => {
                  window.location.href = dashboardUrl;
                }, 100);
              }}
              className="w-full"
              size="lg"
            >
              ✅ {t('payment.closeWindow') || 'Close Window'}
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500 mt-4">
          {isPopup
            ? t('payment.windowWillCloseAutomatically') || 'This window will close automatically'
            : t('payment.clickButtonsToNavigate')
          }
        </p>
      </div>
    </div>
  );
};