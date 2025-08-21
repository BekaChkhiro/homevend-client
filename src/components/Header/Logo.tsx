import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group min-w-0 flex-shrink-0">
      <div className="bg-primary text-white p-1.5 sm:p-2 rounded-md group-hover:bg-primary/90 transition-colors flex-shrink-0">
        <Home className="h-4 w-4 sm:h-6 sm:w-6" />
      </div>
      <span className="text-sm sm:text-base lg:text-xl font-bold text-primary group-hover:text-primary/90 transition-colors truncate">
        <span className="hidden sm:inline">HOMEVEND.ge</span>
        <span className="sm:hidden">HOMEVEND</span>
      </span>
    </Link>
  );
};