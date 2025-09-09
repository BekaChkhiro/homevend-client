import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { AdminSidebar } from "./components/AdminSidebar";
import { getLanguageUrl } from "@/components/LanguageRoute";

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('admin');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(getLanguageUrl("login", i18n.language));
        return;
      }

      if (user.role !== 'admin') {
        navigate(getLanguageUrl("dashboard", i18n.language));
        return;
      }

      // Check if we're at the admin root path (with language prefix)
      const currentPath = location.pathname;
      const adminPath = getLanguageUrl("admin", i18n.language);
      if (currentPath === adminPath || currentPath === `${adminPath}/`) {
        navigate(getLanguageUrl("admin/overview", i18n.language), { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto flex mt-6 pt-32 pb-8">
        <div className="flex-shrink-0">
          <AdminSidebar user={user} />
        </div>

        <div className="flex-1 bg-white rounded-lg border">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;