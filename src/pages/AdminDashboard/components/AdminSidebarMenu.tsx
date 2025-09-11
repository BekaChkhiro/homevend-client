import React from "react";
import { BarChart3, Users, Home, Monitor, MapPin, DollarSign, Building, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface AdminMenuItem {
  id: string;
  path: string;
  labelKey: string;
  icon: React.ReactNode;
  category?: string; // Optional category for grouping
}

export const AdminSidebarMenu: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation('common');
  
  // Define menu items with categories (paths without language prefix)
  const menuItems: AdminMenuItem[] = [
    { 
      id: "overview", 
      path: "admin/overview", 
      labelKey: "navigation.menu.overview", 
      icon: <BarChart3 className="h-5 w-5" />,
      category: "analytics"
    },
    { 
      id: "listings", 
      path: "admin/listings", 
      labelKey: "navigation.menu.listings", 
      icon: <Home className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "projects", 
      path: "admin/projects", 
      labelKey: "navigation.menu.projects", 
      icon: <FolderOpen className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "agencies", 
      path: "admin/agencies", 
      labelKey: "navigation.menu.agencies", 
      icon: <Building className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "users", 
      path: "admin/users", 
      labelKey: "navigation.menu.users", 
      icon: <Users className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "advertisements", 
      path: "admin/advertisements", 
      labelKey: "navigation.menu.advertisements", 
      icon: <Monitor className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "districts", 
      path: "admin/districts", 
      labelKey: "navigation.menu.districts", 
      icon: <MapPin className="h-5 w-5" />,
      category: "data"
    },
    { 
      id: "service-pricing", 
      path: "admin/service-pricing", 
      labelKey: "navigation.menu.servicePricing", 
      icon: <DollarSign className="h-5 w-5" />,
      category: "data"
    },
  ];

  // Group menu items by category
  const analyticsItems = menuItems.filter(item => item.category === "analytics");
  const contentItems = menuItems.filter(item => item.category === "content");
  const dataItems = menuItems.filter(item => item.category === "data");
  const uncategorizedItems = menuItems.filter(item => !item.category);

  // Check if path is active or is a sub-path (considering language prefix)
  const isActive = (path: string) => {
    const fullPath = getLanguageUrl(path, i18n.language);
    return location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);
  };

  // Render a single menu item with animations
  const renderMenuItem = (item: AdminMenuItem) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="mb-1"
    >
      <Link
        to={getLanguageUrl(item.path, i18n.language)}
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
        <span className="font-medium">{t(item.labelKey)}</span>
        
        {/* Active indicator */}
        {isActive(item.path) && (
          <motion.div 
            layoutId="adminActiveIndicator"
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
  const renderCategory = (titleKey: string, items: AdminMenuItem[]) => (
    <div className="mb-3">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {t(titleKey)}
      </div>
      {items.map(renderMenuItem)}
    </div>
  );

  return (
    <div className="p-3">
      {analyticsItems.length > 0 && renderCategory("navigation.categories.analytics", analyticsItems)}
      {contentItems.length > 0 && renderCategory("navigation.categories.content", contentItems)}
      {dataItems.length > 0 && renderCategory("navigation.categories.data", dataItems)}
      {uncategorizedItems.length > 0 && uncategorizedItems.map(renderMenuItem)}
    </div>
  );
};