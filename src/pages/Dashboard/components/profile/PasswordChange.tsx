import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PasswordChange: React.FC = () => {
  const { t } = useTranslation('userDashboard');
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-5 w-5" />
        <h3 className="text-lg font-medium">{t('profileSections.passwordChange.title')}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">{t('profileSections.passwordChange.currentPassword')}</Label>
          <Input id="currentPassword" type="password" placeholder={t('profileSections.passwordChange.currentPassword')} />
        </div>
        
        <div>
          <Label htmlFor="newPassword">{t('profileSections.passwordChange.newPassword')}</Label>
          <Input id="newPassword" type="password" placeholder={t('profileSections.passwordChange.newPassword')} />
          <p className="text-xs text-gray-500 mt-1">{t('validation.minLength', { min: 8 }) + ', ' + (t('passwordValidation.requirements') || 'მინ. 8 სიმბოლო, ერთი დიდი და პატარა ასო')}</p>
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">{t('profileSections.passwordChange.confirmPassword')}</Label>
          <Input id="confirmPassword" type="password" placeholder={t('profileSections.passwordChange.confirmPassword')} />
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>{t('common.note') || 'შენიშვნა'}:</strong> {t('passwordChange.logoutWarning') || 'პაროლის შეცვლის შემდეგ თქვენ ავტომატურად გამოვალთ სისტემიდან'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button>{t('passwordChange.changePassword') || 'პაროლის შეცვლა'}</Button>
          <Button variant="outline">{t('common.cancel')}</Button>
        </div>
      </div>
    </Card>
  );
};