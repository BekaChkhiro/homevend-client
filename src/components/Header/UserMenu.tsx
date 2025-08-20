import { User, Shield, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout({ redirectToLogin: false });
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:text-primary text-xs sm:text-sm px-2 py-1 min-w-0 flex-shrink-0" asChild>
        <Link to="/login" className="flex items-center gap-1">
          <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>შესვლა</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary text-xs sm:text-sm px-2 py-1 min-w-0 flex-shrink-0 max-w-[120px]">
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden md:inline truncate">{user.fullName}</span>
          <span className="md:hidden truncate">{user.fullName.split(' ')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {user.role === 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-4 w-4" />
                <span>ადმინ პანელი</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>ჩემი კაბინეტი</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>გამოსვლა</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};