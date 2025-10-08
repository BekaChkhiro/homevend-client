import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './resources';
import './types';

// Function to detect language from URL
const getLanguageFromUrl = (): string => {
  const path = window.location.pathname;
  // Match language codes at the start of the path (including root path like /en)
  const matches = path.match(/^\/([a-z]{2})(?:\/|$)/);
  if (matches) {
    const urlLang = matches[1];
    // Map URL language codes to i18n language codes
    const langMap: Record<string, string> = {
      'en': 'en',
      'ge': 'ka', // Georgian: ge in URL, ka in i18n
      'ru': 'ru'
    };
    return langMap[urlLang] || 'ka';
  }
  return 'ka'; // fallback to Georgian
};

// Initialize with language from URL
const initialLanguage = getLanguageFromUrl();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'ka',
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;