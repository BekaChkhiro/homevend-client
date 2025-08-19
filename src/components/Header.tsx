
import { Home, Phone, Mail, LogIn, LogOut, User, Shield, ChevronDown, Building, Home as HomeIcon, Building2, Construction, Info, Contact, LayoutGrid, PlusCircle, Heart, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout({ redirectToLogin: false });
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Top row: Logo and contact info */}
      <div className="container mx-auto px-4 border-b border-gray-100">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary text-white p-2 rounded-md group-hover:bg-primary/90 transition-colors">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-primary group-hover:text-primary/90 transition-colors">HOMEVEND.ge</span>
          </Link>
          
          {/* Empty space where buttons were previously */}
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary relative" asChild>
              <Link to={isAuthenticated ? "/dashboard/favorites" : "/login"} className="flex items-center gap-1.5">
                <Heart className="h-5 w-5" />
                <span className="sr-only">ვიშლისთი</span>
                {isAuthenticated && favorites.size > 0 && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.size}
                  </div>
                )}
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
              <Link to={user?.role === 'developer' ? "/dashboard/add-project" : "/dashboard/add-property"} className="flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span>{user?.role === 'developer' ? 'პროექტის დამატება' : 'განცხადების დამატება'}</span>
              </Link>
            </Button>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <User className="h-4 w-4" />
                    <span>{user.fullName}</span>
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
            ) : (
              <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
                <Link to="/login" className="flex items-center gap-1.5">
                  <LogIn className="h-4 w-4" />
                  <span>შესვლა</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom row: Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <nav className="hidden lg:flex items-center space-x-5 text-sm">
            <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <HomeIcon className="h-4 w-4" />
              <span>მთავარი</span>
            </Link>
            
            <Link to="/about" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <Info className="h-4 w-4" />
              <span>ჩვენ შესახებ</span>
            </Link>
            
            <Link to="/properties" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <Building className="h-4 w-4" />
              <span>უძრავი ქონება</span>
            </Link>
            
            <Link to="/agencies" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <Building2 className="h-4 w-4" />
              <span>სააგენტოები</span>
            </Link>
            
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
            
            <Link to="/services" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <Settings className="h-4 w-4" />
              <span>სერვისები</span>
            </Link>
            
            <Link to="/price-statistics" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <TrendingUp className="h-4 w-4" />
              <span>ფასების სტატისტიკა</span>
            </Link>
            
            {/* რეკლამა and კონტაქტი moved to the right side */}
          </nav>
          
          <div className="ml-auto flex items-center space-x-5 text-sm">
            <Link to="/advertise" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <LayoutGrid className="h-4 w-4" />
              <span>რეკლამა</span>
            </Link>
            
            <Link to="/contact" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 text-foreground hover:text-primary transition-all">
              <Contact className="h-4 w-4" />
              <span>კონტაქტი</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
