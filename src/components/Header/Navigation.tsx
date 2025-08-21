import { Home as HomeIcon, Info, Building, Building2, Settings, TrendingUp, LayoutGrid, Contact } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectsDropdown } from "./ProjectsDropdown";

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const Navigation = ({ isMobile = false, onItemClick }: NavigationProps) => {
  if (isMobile) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <nav className="flex flex-col space-y-1">
          <Link 
            to="/" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <HomeIcon className="h-4 w-4" />
            <span>მთავარი</span>
          </Link>
          
          <Link 
            to="/about" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Info className="h-4 w-4" />
            <span>ჩვენ შესახებ</span>
          </Link>
          
          <Link 
            to="/properties" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building className="h-4 w-4" />
            <span>უძრავი ქონება</span>
          </Link>
          
          <Link 
            to="/agencies" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building2 className="h-4 w-4" />
            <span>სააგენტოები</span>
          </Link>
          
          <Link 
            to="/agencies?role=developer" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Building className="h-4 w-4" />
            <span>დეველოპერები</span>
          </Link>
          
          <Link 
            to="/services" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <Settings className="h-4 w-4" />
            <span>სერვისები</span>
          </Link>
          
          <Link 
            to="/price-statistics" 
            onClick={onItemClick}
            className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span>ფასების სტატისტიკა</span>
          </Link>
          
          <div className="border-t border-gray-100 pt-2 mt-2">
            <Link 
              to="/advertise" 
              onClick={onItemClick}
              className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>რეკლამა</span>
            </Link>
            
            <Link 
              to="/contact" 
              onClick={onItemClick}
              className="flex items-center space-x-2 px-4 py-3 text-sm rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all"
            >
              <Contact className="h-4 w-4" />
              <span>კონტაქტი</span>
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
          <Link to="/" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">მთავარი</span>
          </Link>
          
          <Link to="/about" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">ჩვენ შესახებ</span>
          </Link>
          
          <Link to="/properties" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Building className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">უძრავი ქონება</span>
          </Link>
          
          <Link to="/agencies" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">სააგენტოები</span>
          </Link>
          
          <ProjectsDropdown />
          
          <Link to="/services" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">სერვისები</span>
          </Link>
          
          <Link to="/price-statistics" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">ფასების სტატისტიკა</span>
          </Link>
          
          <Link to="/advertise" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <LayoutGrid className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">რეკლამა</span>
          </Link>
          
          <Link to="/contact" className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all whitespace-nowrap">
            <Contact className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">კონტაქტი</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};