import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home as HomeIcon, Info, Building, Building2, Settings, TrendingUp, LayoutGrid, Contact, Heart, User, Plus, DollarSign, Users, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Badge } from "@/components/ui/badge";

interface TabbedMobileMenuProps {
  onItemClick?: () => void;
}

export const TabbedMobileMenu = ({ onItemClick }: TabbedMobileMenuProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  
  // Default to dashboard tab if user is logged in and in dashboard, otherwise main tab
  const getDefaultTab = () => {
    if (isAuthenticated && location.pathname.startsWith('/dashboard')) {
      return 'dashboard';
    }
    return 'main';
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());

  // Main menu items
  const mainMenuItems = [
    { path: "/", icon: HomeIcon, label: "მთავარი" },
    { path: "/about", icon: Info, label: "ჩვენ შესახებ" },
    { path: "/properties", icon: Building, label: "უძრავი ქონება" },
    { path: "/agencies", icon: Building2, label: "სააგენტოები" },
    { path: "/projects", icon: Building, label: "პროექტები" },
    { path: "/services", icon: Settings, label: "სერვისები" },
    { path: "/price-statistics", icon: TrendingUp, label: "ფასების სტატისტიკა" },
    { path: "/advertise", icon: LayoutGrid, label: "რეკლამა" },
    { path: "/contact", icon: Contact, label: "კონტაქტი" }
  ];

  // Dashboard menu items based on user role
  const getDashboardMenuItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { path: "/login", icon: User, label: "შესვლა" },
      ];
    }

    const baseItems = [
      { path: "/dashboard/my-properties", icon: HomeIcon, label: "ჩემი განცხადებები" },
      { path: "/dashboard/add-property", icon: Plus, label: "განცხადების დამატება" },
      { 
        path: "/dashboard/favorites", 
        icon: Heart, 
        label: "ფავორიტები",
        badge: favorites.size > 0 ? favorites.size : null
      },
      { path: "/dashboard/profile", icon: User, label: "პროფილი" },
      { path: "/dashboard/balance", icon: DollarSign, label: "ბალანსი" }
    ];

    // Add developer-specific items
    if (user.role === 'developer') {
      return [
        { path: "/dashboard/my-projects", icon: FolderOpen, label: "ჩემი პროექტები" },
        { path: "/dashboard/add-project", icon: Plus, label: "პროექტის დამატება" },
        ...baseItems
      ];
    }

    // Add agency-specific items
    if (user.role === 'agency') {
      return [
        ...baseItems.slice(0, 3), // Properties, Add, Favorites
        { path: "/dashboard/users", icon: Users, label: "აგენტები" },
        ...baseItems.slice(3) // Profile, Balance
      ];
    }

    return baseItems;
  };

  const dashboardItems = getDashboardMenuItems();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: any, isDashboard = false) => (
    <Link
      key={item.path}
      to={item.path}
      onClick={onItemClick}
      className={`flex items-center justify-between space-x-2 px-4 py-3 text-sm rounded-md transition-all ${
        isActive(item.path)
          ? 'bg-primary/10 text-primary font-medium'
          : 'hover:bg-gray-50 text-foreground hover:text-primary'
      }`}
    >
      <div className="flex items-center space-x-2">
        <item.icon className={`h-4 w-4 ${isActive(item.path) ? 'text-primary' : ''}`} />
        <span>{item.label}</span>
      </div>
      {item.badge && (
        <Badge variant="secondary" className="h-5 px-2 text-xs">
          {item.badge > 9 ? '9+' : item.badge}
        </Badge>
      )}
    </Link>
  );

  return (
    <div className="bg-white border-t border-gray-100 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main" className="text-sm">
              მთავარი მენიუ
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-sm">
              {isAuthenticated ? "კაბინეტი" : "ავტორიზაცია"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="mt-4">
            <nav className="flex flex-col space-y-1 max-h-80 overflow-y-auto">
              {mainMenuItems.map(item => renderMenuItem(item))}
            </nav>
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-4">
            <nav className="flex flex-col space-y-1 max-h-80 overflow-y-auto">
              {!isAuthenticated && (
                <div className="px-4 py-3 text-sm text-gray-600 text-center">
                  შესვლის შემდეგ გექნებათ წვდომა კაბინეტის მენიუზე
                </div>
              )}
              {dashboardItems.map(item => renderMenuItem(item, true))}
            </nav>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};