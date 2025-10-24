import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

export const Logo = () => {
  const { i18n } = useTranslation();
  return (
    <Link to={getLanguageUrl("", i18n.language)} className="flex items-center space-x-2 group min-w-0 flex-shrink-0" aria-label="HOMEVEND - Home page">
      <picture>
        {/* Optimized sizes for different screen sizes */}
        <source media="(max-width: 640px)" srcSet="/homevend-logo.png" width="40" height="40" />
        <source media="(max-width: 1024px)" srcSet="/homevend-logo.png" width="48" height="48" />
        <img
          src="/homevend-logo.png"
          alt=""
          role="presentation"
          className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-md flex-shrink-0 group-hover:opacity-90 transition-opacity"
          width="40"
          height="40"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </picture>
      <span className="text-sm sm:text-base lg:text-xl font-bold text-primary group-hover:text-primary/90 transition-colors truncate" aria-hidden="false">
        <span className="hidden sm:inline">HOMEVEND.GE</span>
        <span className="sm:hidden">HOMEVEND</span>
      </span>
    </Link>
  );
};
