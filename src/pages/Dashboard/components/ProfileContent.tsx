import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings } from "lucide-react";
import { PersonalInfo } from "./profile/PersonalInfo";
import { AgencyPersonalInfo } from "./profile/AgencyPersonalInfo";
import { DeveloperPersonalInfo } from "./profile/DeveloperPersonalInfo";
import { PasswordChange } from "./profile/PasswordChange";
import { User as UserType } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { authApi } from "@/lib/api";

interface ProfileContentProps {
  user: UserType;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ user: initialUser }) => {
  const { t } = useTranslation('userDashboard');
  const [user, setUser] = useState(initialUser);

  const handleProfileUpdate = async (updatedUser: UserType) => {
    // Update the local user state
    setUser(updatedUser);

    // Refresh user data from server to ensure we have the latest
    try {
      const freshUserData = await authApi.getMe();
      setUser(freshUserData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('profileSettings.title')}</h2>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profileSettings.tabs.personal')}
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('profileSettings.tabs.password')}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="personal">
              {user.role === 'agency' ? (
                <AgencyPersonalInfo user={user} />
              ) : user.role === 'developer' ? (
                <DeveloperPersonalInfo user={user} />
              ) : (
                <PersonalInfo user={user} onProfileUpdate={handleProfileUpdate} />
              )}
            </TabsContent>

            <TabsContent value="password">
              <PasswordChange />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
