import { Home, Building, Building2, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: "home",
      path: "/",
      icon: Home,
      label: "მთავარი",
      show: true
    },
    {
      id: "properties",
      path: "/properties",
      icon: Building,
      label: "ქონება",
      show: true
    },
    {
      id: "favorites",
      path: isAuthenticated ? "/dashboard/favorites" : "/login",
      icon: Heart,
      label: "ფავორიტი",
      show: true,
      badge: isAuthenticated && favorites.size > 0 ? favorites.size : null
    },
    {
      id: "profile",
      path: isAuthenticated ? "/dashboard" : "/login",
      icon: User,
      label: isAuthenticated ? "კაბინეტი" : "შესვლა",
      show: true
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems
          .filter(item => item.show)
          .map(({ id, path, icon: Icon, label, badge }) => {
            const active = isActive(path);
            
            return (
              <Link
                key={id}
                to={path}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 rounded-lg transition-colors ${
                  active 
                    ? 'text-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className="relative mb-1">
                  <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                  {badge && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </div>
                  )}
                </div>
                <span className={`text-xs text-center leading-tight truncate w-full ${
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