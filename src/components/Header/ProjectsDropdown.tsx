import { Construction, ChevronDown, LayoutGrid, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export const ProjectsDropdown = () => {
  const { t } = useTranslation('common');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
        <Construction className="h-4 w-4" />
        <span>{t('navigation.developers')}</span>
        <ChevronDown className="h-3 w-3 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuItem asChild>
          <Link to="/projects" className="flex items-center gap-2 cursor-pointer">
            <LayoutGrid className="h-4 w-4" />
            <span>{t('navigation.projects')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/developers" className="flex items-center gap-2 cursor-pointer">
            <Building2 className="h-4 w-4" />
            <span>{t('navigation.developers')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};