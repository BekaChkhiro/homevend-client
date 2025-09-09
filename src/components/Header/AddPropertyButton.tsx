import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

export const AddPropertyButton = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('common');

  return (
    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:text-primary text-xs sm:text-sm px-2 sm:px-3 hidden md:flex" asChild>
      <Link to={user?.role === 'developer' ? getLanguageUrl("dashboard/add-project", i18n.language) : getLanguageUrl("dashboard/add-property", i18n.language)} className="flex items-center gap-1 sm:gap-1.5">
        <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden lg:inline">{user?.role === 'developer' ? t('navigation.addProject') : t('navigation.addProperty')}</span>
        <span className="lg:hidden">{t('common.add')}</span>
      </Link>
    </Button>
  );
};
