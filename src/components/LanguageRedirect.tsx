import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Component to redirect root path to default language
export const LanguageRedirect = () => {
  useEffect(() => {
    // If user accesses root without language, redirect to default language
    const defaultLang = 'en';
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      window.location.replace(`/${defaultLang}`);
    }
  }, []);

  // Navigate to English by default
  return <Navigate to="/en" replace />;
};