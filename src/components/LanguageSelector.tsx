import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { URL_LANGUAGE_CODES } from './LanguageRoute';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const languages = [
    { code: 'ka', name: 'ქართული', flag: '🇬🇪', urlCode: 'ge' },
    { code: 'en', name: 'English', flag: '🇺🇸', urlCode: 'en' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', urlCode: 'ru' },
  ];

  const changeLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (!language) return;

    // Get current path without language prefix
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    // Create new URL with selected language prefix
    const newPath = `/${language.urlCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    
    // Reload the page with the new language URL
    window.location.href = newPath;
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1]; // Default to English

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span>{currentLanguage.flag} {currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;