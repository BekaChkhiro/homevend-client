import { Home, Heart, User, Plus, DollarSign, Users, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";

export const MobileDashboardNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { t, i18n } = useTranslation('userDashboard');

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        id: "properties",
        path: getLanguageUrl("dashboard/my-properties", i18n.language),
        icon: Home,
        label: t('mobileNav.properties'),
        show: true
      },
      {
        id: "add",
        path: getLanguageUrl("dashboard/add-property", i18n.language),
        icon: Plus,
        label: t('mobileNav.add'),
        show: true
      },
      {
        id: "favorites",
        path: getLanguageUrl("dashboard/favorites", i18n.language),
        icon: Heart,
        label: t('mobileNav.favorites'),
        show: true,
        badge: favorites.size > 0 ? favorites.size : null
      },
      {
        id: "profile",
        path: getLanguageUrl("dashboard/profile", i18n.language),
        icon: User,
        label: t('mobileNav.profile'),
        show: true
      }
    ];

    // Add developer-specific items
    if (user?.role === 'developer') {
      return [
        {
          id: "projects",
          path: getLanguageUrl("dashboard/my-projects", i18n.language),
          icon: FolderOpen,
          label: t('mobileNav.projects'),
          show: true
        },
        ...baseItems.slice(0, 2), // Properties and Add
        baseItems[2], // Favorites
        {
          id: "balance",
          path: getLanguageUrl("dashboard/balance", i18n.language),
          icon: DollarSign,
          label: t('mobileNav.balance'),
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
          path: getLanguageUrl("dashboard/users", i18n.language),
          icon: Users,
          label: t('mobileNav.agents'),
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