import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface PersonalInfoProps {
  user: User;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
  const { t } = useTranslation('userDashboard');
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{t('profile.personalInfo')}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('profile.firstName')}</Label>
            <Input id="firstName" placeholder={t('profile.firstName')} />
          </div>
          <div>
            <Label htmlFor="lastName">{t('profile.lastName')}</Label>
            <Input id="lastName" placeholder={t('profile.lastName')} />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">{t('profile.email')}</Label>
          <Input id="email" type="email" value={user.email} readOnly />
        </div>
        
        <div>
          <Label htmlFor="phone">{t('profile.phone')}</Label>
          <Input id="phone" placeholder="+995 5XX XX XX XX" />
        </div>
        
        <div>
          <Label htmlFor="address">{t('profile.address')}</Label>
          <Input id="address" placeholder={t('profile.addressPlaceholder')} />
        </div>
        
        <div className="flex gap-3">
          <Button>{t('common.save')}</Button>
          <Button variant="outline">{t('common.cancel')}</Button>
        </div>
      </div>
    </Card>
  );
};