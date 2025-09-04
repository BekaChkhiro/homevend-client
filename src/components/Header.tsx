
import { Logo, UserMenu, FavoritesButton, AddPropertyButton, Navigation } from "./Header/index";
import { TabbedMobileMenu } from "./Header/TabbedMobileMenu";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50 overflow-hidden">
      {/* Top row: Logo and controls */}
      <div className="container mx-auto px-3 sm:px-4 border-b border-gray-100 lg:border-b">
        <div className="flex items-center justify-between h-14 sm:h-16 min-w-0">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <LanguageSelector />
            <FavoritesButton />
            <AddPropertyButton />
            <UserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`px-3 py-2 min-w-0 flex items-center gap-2 border-2 rounded-lg transition-all duration-200 ${
                isMobileMenuOpen 
                  ? 'border-primary bg-primary text-white shadow-md' 
                  : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="text-xs font-medium">{t('common.close')}</span>
                </>
              ) : (
                <>
                  <Menu className="h-4 w-4" />
                  <span className="text-xs font-medium">{t('common.menu')}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <TabbedMobileMenu onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
