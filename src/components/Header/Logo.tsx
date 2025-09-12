import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

export const Logo = () => {
  const { i18n } = useTranslation();
  return (
    <Link to={getLanguageUrl("", i18n.language)} className="flex items-center space-x-2 group min-w-0 flex-shrink-0">
      <img 
        src="/homevend-logo.jpeg" 
        alt="HOMEVEND" 
        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-md flex-shrink-0 group-hover:opacity-90 transition-opacity"
      />
      <span className="text-sm sm:text-base lg:text-xl font-bold text-primary group-hover:text-primary/90 transition-colors truncate">
        <span className="hidden sm:inline">HOMEVEND.ge</span>
        <span className="sm:hidden">HOMEVEND</span>
      </span>
    </Link>
  );
};
