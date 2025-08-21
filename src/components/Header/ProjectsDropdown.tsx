import { Construction, ChevronDown, LayoutGrid, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProjectsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
        <Construction className="h-4 w-4" />
        <span>პროექტები</span>
        <ChevronDown className="h-3 w-3 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuItem asChild>
          <Link to="/projects" className="flex items-center gap-2 cursor-pointer">
            <LayoutGrid className="h-4 w-4" />
            <span>ყველა პროექტი</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/projects?projectType=apartment_building" className="flex items-center gap-2 cursor-pointer">
            <Building2 className="h-4 w-4" />
            <span>საცხოვრებელი კომპლექსები</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/projects?projectType=private_house" className="flex items-center gap-2 cursor-pointer">
            <Construction className="h-4 w-4" />
            <span>კერძო სახლები</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};