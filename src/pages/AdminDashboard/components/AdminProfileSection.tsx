import React from "react";
import { useTranslation } from "react-i18next";
import { User } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

interface AdminProfileSectionProps {
  user: User;
}

export const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({ user }) => {
  const { t } = useTranslation('admin');

  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {t('navigation.administrator')}
          </p>
        </div>
      </div>
    </div>
  );
};