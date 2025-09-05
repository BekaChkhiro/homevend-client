import React from "react";
import { Heart, Home, User, Plus, DollarSign, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";

interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  category?: string; // Optional category for grouping
  roles?: string[];
}

interface SidebarMenuProps {
  onNavigate?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ onNavigate }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  
  // Define menu items with categories
  const { t } = useTranslation('userDashboard');
  
  const allMenuItems: MenuItem[] = [
    // For developers, show both project and property options
    ...(user?.role === 'developer' ? [
      { 
        id: "add-project", 
        path: getLanguageUrl("dashboard/add-project", i18n.language), 
        label: t('menu.addProject'), 
        icon: <Plus className="h-5 w-5" />,
        category: "projects"
      },
      { 
        id: "add-property", 
        path: getLanguageUrl("dashboard/add-property", i18n.language), 
        label: t('menu.addProperty'), 
        icon: <Plus className="h-5 w-5" />,
        category: "properties"
      },
      { 
        id: "my-projects", 
        path: getLanguageUrl("dashboard/my-projects", i18n.language), 
        label: t('menu.myProjects'), 
        icon: <Home className="h-5 w-5" />,
        category: "projects"
      },
      { 
        id: "my-properties", 
        path: getLanguageUrl("dashboard/my-properties", i18n.language), 
        label: t('menu.myProperties'), 
        icon: <Home className="h-5 w-5" />,
        category: "properties"
      },
    ] : [
      // For regular users, show only property options
      { 
        id: "add-property", 
        path: getLanguageUrl("dashboard/add-property", i18n.language), 
        label: t('menu.addProperty'), 
        icon: <Plus className="h-5 w-5" />,
        category: "properties"
      },
      { 
        id: "my-properties", 
        path: getLanguageUrl("dashboard/my-properties", i18n.language), 
        label: t('menu.myProperties'), 
        icon: <Home className="h-5 w-5" />,
        category: "properties"
      },
    ]),
    { 
      id: "favorites", 
      path: getLanguageUrl("dashboard/favorites", i18n.language), 
      label: t('menu.favorites'), 
      icon: <Heart className="h-5 w-5" />,
      category: "properties"
    },
    { 
      id: "profile", 
      path: getLanguageUrl("dashboard/profile", i18n.language), 
      label: t('menu.profile'), 
      icon: <User className="h-5 w-5" />,
      category: "account"
    },
    {
      id: "users",
      path: getLanguageUrl("dashboard/users", i18n.language),
      label: t('menu.agents'),
      icon: <Users className="h-5 w-5" />,
      category: "account",
      roles: ['agency'],
    },
    { 
      id: "balance", 
      path: getLanguageUrl("dashboard/balance", i18n.language), 
      label: t('menu.balance'), 
      icon: <DollarSign className="h-5 w-5" />,
      category: "account"
    },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  // Group menu items by category
  const projectItems = menuItems.filter(item => item.category === "projects");
  const propertyItems = menuItems.filter(item => item.category === "properties");
  const accountItems = menuItems.filter(item => item.category === "account");
  const uncategorizedItems = menuItems.filter(item => !item.category);

  // Check if path is active or is a sub-path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Render a single menu item with animations
  const renderMenuItem = (item: MenuItem) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="mb-1"
    >
      <Link
        to={item.path}
        onClick={onNavigate}
        className={cn(
          "flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 border border-transparent",
          isActive(item.path)
            ? "bg-primary/10 text-primary font-medium shadow-sm border-primary/20"
            : "text-gray-700 hover:bg-gray-100 hover:border-gray-200"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md mr-3",
          isActive(item.path) 
            ? "bg-primary/20 text-primary" 
            : "bg-gray-100 text-gray-600"
        )}>
          {item.icon}
        </div>
        <span className="font-medium">{item.label}</span>
        
        {/* Active indicator */}
        {isActive(item.path) && (
          <motion.div 
            layoutId="activeIndicator"
            className="ml-auto w-1.5 h-6 bg-primary rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  );

  // Render a category section with title
  const renderCategory = (title: string, items: MenuItem[]) => (
    <div className="mb-3">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </div>
      {items.map(renderMenuItem)}
    </div>
  );

  return (
    <div className="p-3">
      {projectItems.length > 0 && renderCategory(t('menu.categories.projects'), projectItems)}
      {propertyItems.length > 0 && renderCategory(t('menu.categories.properties'), propertyItems)}
      {accountItems.length > 0 && renderCategory(t('menu.categories.account'), accountItems)}
      {uncategorizedItems.length > 0 && uncategorizedItems.map(renderMenuItem)}
    </div>
  );
};
