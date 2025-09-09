import { Home as HomeIcon, Info, Building, Building2, Settings, TrendingUp, LayoutGrid, Contact } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectsDropdown } from "./ProjectsDropdown";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const Navigation = ({ isMobile = false, onItemClick }: NavigationProps) => {
  const { t, i18n } = useTranslation('common');
  if (isMobile) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <nav className="flex flex-col space-y-1">
          <Link 
            to={getLanguageUrl("", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <HomeIcon className="h-4 w-4" />
            <span>{t('navigation.home')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("about", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Info className="h-4 w-4" />
            <span>{t('navigation.aboutUs')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("properties", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building className="h-4 w-4" />
            <span>{t('navigation.properties')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("agencies", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building2 className="h-4 w-4" />
            <span>{t('navigation.agencies')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("agencies?role=developer", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building className="h-4 w-4" />
            <span>{t('navigation.developers')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("services", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Settings className="h-4 w-4" />
            <span>{t('navigation.services')}</span>
          </Link>
          
          <Link 
            to={getLanguageUrl("price-statistics", i18n.language)} 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{t('navigation.priceStatistics')}</span>
          </Link>
          
          <div className="border-t border-gray-100 pt-2 mt-2">
            <Link 
              to={getLanguageUrl("advertise", i18n.language)} 
              onClick={onItemClick}
              className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{t('navigation.advertising')}</span>
            </Link>
            
            <Link 
              to={getLanguageUrl("contact", i18n.language)} 
              onClick={onItemClick}
              className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
            >
              <Contact className="h-4 w-4" />
              <span>{t('navigation.contact')}</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4">
      <div className="flex items-center justify-between h-12 lg:h-14 overflow-hidden">
        <nav className="hidden lg:flex items-center justify-between w-full text-sm gap-2">
          <Link to={getLanguageUrl("", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.home')}</span>
          </Link>
          
          <Link to={getLanguageUrl("about", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.aboutUs')}</span>
          </Link>
          
          <Link to={getLanguageUrl("properties", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Building className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.properties')}</span>
          </Link>
          
          <Link to={getLanguageUrl("agencies", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.agencies')}</span>
          </Link>
          
          <ProjectsDropdown />
          
          <Link to={getLanguageUrl("services", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.services')}</span>
          </Link>
          
          <Link to={getLanguageUrl("price-statistics", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.priceStatistics')}</span>
          </Link>
          
          <Link to={getLanguageUrl("advertise", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <LayoutGrid className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.advertising')}</span>
          </Link>
          
          <Link to={getLanguageUrl("contact", i18n.language)} className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Contact className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('navigation.contact')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};
