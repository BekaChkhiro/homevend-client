import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/lib/api";
import { sanitizePhoneInput, isValidPhoneNumber } from "@/lib/validation";

interface PersonalInfoProps {
  user: User;
  onProfileUpdate?: (updatedUser: User) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onProfileUpdate }) => {
  const { t } = useTranslation('userDashboard');
  const { toast } = useToast();

  // Split fullName into firstName and lastName
  const nameParts = user.fullName?.split(' ') || [];
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user.email,
    phone: user.phoneNumber || ''
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when user prop changes
  useEffect(() => {
    const nameParts = user.fullName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName,
      lastName,
      email: user.email,
      phone: user.phoneNumber || ''
    });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    // Sanitize phone number input
    const sanitizedValue = field === 'phone' ? sanitizePhoneInput(value) : value;
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Validate phone number if provided
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast({
        title: t('common.error'),
        description: "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ + და ციფრებს, მინიმუმ 9 სიმბოლო",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Combine firstName and lastName into fullName
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

      // Call API to update profile
      const updatedUser = await authApi.updateProfile({
        fullName,
        phone: formData.phone
      });

      // Update local storage with new user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.fullName = updatedUser.fullName;
        userData.phoneNumber = updatedUser.phoneNumber;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Notify parent component about the update
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }

      toast({
        title: t('common.success'),
        description: "Profile updated successfully",
      });
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    const nameParts = user.fullName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName,
      lastName,
      email: user.email,
      phone: user.phoneNumber || ''
    });
    setHasChanges(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{t('profile.personalInfo')}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('profile.firstName')}</Label>
            <Input
              id="firstName"
              placeholder={t('profile.firstName')}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t('profile.lastName')}</Label>
            <Input
              id="lastName"
              placeholder={t('profile.lastName')}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">{t('profile.email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div>
          <Label htmlFor="phone">{t('profile.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+995 5XX XX XX XX"
            minLength={9}
            maxLength={20}
            pattern="[+0-9]*"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            მხოლოდ + და ციფრები, მინიმუმ 9 სიმბოლო
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t('common.save')}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || !hasChanges}
          >
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Card>
  );
};