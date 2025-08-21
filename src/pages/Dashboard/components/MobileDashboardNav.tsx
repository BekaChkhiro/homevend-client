import { Home, Heart, User, Plus, DollarSign, Users, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export const MobileDashboardNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        id: "properties",
        path: "/dashboard/my-properties",
        icon: Home,
        label: "ქონება",
        show: true
      },
      {
        id: "add",
        path: "/dashboard/add-property",
        icon: Plus,
        label: "დამატება",
        show: true
      },
      {
        id: "favorites",
        path: "/dashboard/favorites",
        icon: Heart,
        label: "ფავორიტი",
        show: true,
        badge: favorites.size > 0 ? favorites.size : null
      },
      {
        id: "profile",
        path: "/dashboard/profile",
        icon: User,
        label: "პროფილი",
        show: true
      }
    ];

    // Add developer-specific items
    if (user?.role === 'developer') {
      return [
        {
          id: "projects",
          path: "/dashboard/my-projects",
          icon: FolderOpen,
          label: "პროექტები",
          show: true
        },
        ...baseItems.slice(0, 2), // Properties and Add
        baseItems[2], // Favorites
        {
          id: "balance",
          path: "/dashboard/balance",
          icon: DollarSign,
          label: "ბალანსი",
          show: true
        }
      ];
    }

    // Add agency-specific items
    if (user?.role === 'agency') {
      return [
        ...baseItems.slice(0, 3), // Properties, Add, Favorites
        {
          id: "users",
          path: "/dashboard/users",
          icon: Users,
          label: "აგენტები",
          show: true
        },
        baseItems[3] // Profile
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems
          .filter(item => item.show)
          .slice(0, 5) // Maximum 5 items for mobile
          .map(({ id, path, icon: Icon, label, badge }) => {
            const active = isActive(path);
            
            return (
              <Link
                key={id}
                to={path}
                className={`flex flex-col items-center justify-center py-2 px-2 min-w-0 flex-1 rounded-lg transition-colors ${
                  active 
                    ? 'text-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className="relative mb-1">
                  <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                  {badge && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] text-center leading-tight truncate w-full ${
                  active ? 'text-primary font-medium' : ''
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
      </div>
    </nav>
  );
};