import { useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Language code mapping
export const LANGUAGE_CODES = {
  'en': 'en', // English
  'ge': 'ka', // Georgian (ge in URL, ka in i18n)
  'ru': 'ru', // Russian
} as const;

// Reverse mapping for URL generation
export const URL_LANGUAGE_CODES = {
  'en': 'en',
  'ka': 'ge', // Georgian (ka in i18n, ge in URL)
  'ru': 'ru',
} as const;

type UrlLanguageCode = keyof typeof LANGUAGE_CODES;
type I18nLanguageCode = typeof LANGUAGE_CODES[UrlLanguageCode];

export const LanguageRoute = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const urlLang = lang as UrlLanguageCode;

    // If no language in URL or invalid language, redirect to default (Georgian)
    if (!urlLang || !LANGUAGE_CODES[urlLang]) {
      const defaultLang = 'ge'; // Default to Georgian
      const currentPath = window.location.pathname;
      const newPath = currentPath.startsWith('/en/') || currentPath.startsWith('/ge/') || currentPath.startsWith('/ru/')
        ? currentPath.replace(/^\/[a-z]{2}/, `/${defaultLang}`)
        : `/${defaultLang}${currentPath}`;

      navigate(newPath, { replace: true });
      return;
    }

    // Convert URL language code to i18n language code and change language
    const i18nLang = LANGUAGE_CODES[urlLang];
    if (i18n.language !== i18nLang) {
      i18n.changeLanguage(i18nLang);
    }
  }, [lang, navigate, i18n]);

  // Always render the outlet - i18n initialization handles the language
  return <Outlet />;
};

// Helper function to generate language-aware URLs
export const getLanguageUrl = (path: string, language?: string): string => {
  const currentLang = language || 'ka'; // Default to Georgian
  const urlLang = URL_LANGUAGE_CODES[currentLang as I18nLanguageCode] || 'ge';

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Return the language-prefixed URL
  return `/${urlLang}/${cleanPath}`;
};

// Hook to get current language-aware navigation
export const useLanguageNavigate = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const navigateWithLanguage = (path: string, options?: any) => {
    const languageUrl = getLanguageUrl(path, i18n.language);
    navigate(languageUrl, options);
  };

  return navigateWithLanguage;
};