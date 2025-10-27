import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { agencyApi } from "@/lib/api";
import { sanitizePhoneInput, isValidPhoneNumber } from "@/lib/validation";

interface AgencyPersonalInfoProps {
  user: User;
}

interface AgencyData {
  id: number;
  name: string;
  phone: string;
  email: string;
  website?: string;
  socialMediaUrl?: string;
  logoUrl?: string;
}

export const AgencyPersonalInfo: React.FC<AgencyPersonalInfoProps> = ({ user }) => {
  const { t } = useTranslation('userDashboard');
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agencyData, setAgencyData] = useState<AgencyData>({
    id: 0,
    name: '',
    phone: '',
    email: user.email,
    website: '',
    socialMediaUrl: '',
    logoUrl: ''
  });

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading agency data, user role:', user.role);
      console.log('Token exists:', !!localStorage.getItem('token'));

      const agency = await agencyApi.getCurrentAgency();
      console.log('Agency data loaded:', agency);

      setAgencyData({
        id: agency.id,
        name: agency.name || '',
        phone: agency.phone || '',
        email: agency.email || user.email,
        website: agency.website || '',
        socialMediaUrl: agency.socialMediaUrl || '',
        logoUrl: agency.logoUrl || ''
      });

      // Load logo from both database and S3 image system
      let logoToShow = null;

      // First try to load from database
      if (agency.logoUrl) {
        const logoUrl = agency.logoUrl.startsWith('/')
          ? `http://localhost:5000${agency.logoUrl}`
          : agency.logoUrl;
        logoToShow = logoUrl;
      }

      // Also try to load from S3 image system
      try {
        const imagesResponse = await fetch(`/api/upload/agency/${user.id}/images?purpose=agency_logo`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          if (imagesData.images && imagesData.images.length > 0) {
            const latestImage = imagesData.images[0];
            logoToShow = latestImage.sizes?.medium || latestImage.url;
          }
        }
      } catch (imageError) {
        console.log('No S3 images found or error loading:', imageError);
      }

      if (logoToShow) {
        setLogoPreview(logoToShow);
      }
    } catch (error) {
      console.error('Failed to load agency data:', error);

      // Fall back to mock data
      setAgencyData({
        id: 2,
        name: 'Test Agency',
        phone: '555-1234',
        email: 'testagency@example.com',
        website: '',
        socialMediaUrl: '',
        logoUrl: ''
      });

      toast({
        title: t('agencyProfile.errors.title'),
        description: t('agencyProfile.errors.loadFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AgencyData, value: string) => {
    // Sanitize phone number input
    const sanitizedValue = field === 'phone' ? sanitizePhoneInput(value) : value;
    setAgencyData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('agencyProfile.errors.title'),
          description: t('agencyProfile.errors.selectImageFile'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('agencyProfile.errors.title'),
          description: t('agencyProfile.errors.logoSizeExceeded'),
          variant: "destructive",
        });
        return;
      }

      try {
        // Create FormData for upload
        const formData = new FormData();
        formData.append('files', file);
        formData.append('purpose', 'agency_logo');

        // Upload to S3 via universal image system
        const response = await fetch(`/api/upload/agency/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const uploadResult = await response.json();
        console.log('Logo upload result:', uploadResult);

        // Update local preview
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Update logo URL in state - use the S3 URL from the first uploaded image
        if (uploadResult.images && uploadResult.images.length > 0) {
          const logoImage = uploadResult.images[0];
          setAgencyData(prev => ({
            ...prev,
            logoUrl: logoImage.sizes?.medium || logoImage.url
          }));
        }

        toast({
          title: t('agencyProfile.success.title'),
          description: t('agencyProfile.success.logoUploaded'),
        });
      } catch (error) {
        console.error('Logo upload failed:', error);
        toast({
          title: t('agencyProfile.errors.title'),
          description: t('agencyProfile.errors.logoUploadFailed'),
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    // Validate phone number if provided
    if (agencyData.phone && !isValidPhoneNumber(agencyData.phone)) {
      toast({
        title: t('agencyProfile.errors.title'),
        description: "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ + და ციფრებს, მინიმუმ 9 სიმბოლო",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        name: agencyData.name,
        phone: agencyData.phone,
        email: agencyData.email,
        website: agencyData.website || undefined,
        socialMediaUrl: agencyData.socialMediaUrl || undefined
      };

      await agencyApi.updateAgency(agencyData.id, updateData);
      
      toast({
        title: t('agencyProfile.success.title'),
        description: t('agencyProfile.success.dataSaved'),
      });
    } catch (error) {
      console.error('Failed to save agency data:', error);
      toast({
        title: t('agencyProfile.errors.title'),
        description: t('agencyProfile.errors.saveFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    loadAgencyData();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">{t('agencyProfile.loading')}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{t('agencyProfile.title')}</h3>
      <div className="space-y-4">
        {/* Agency Name */}
        <div>
          <Label htmlFor="agencyName" className="text-sm font-medium">
            {t('agencyProfile.agencyName')}
          </Label>
          <Input 
            id="agencyName" 
            value={agencyData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('agencyProfile.agencyNamePlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium">{t('agencyProfile.logo')}</Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="agency-logo-upload"
                  disabled={isSaving}
                />
                <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-md bg-background hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {t('agencyProfile.selectLogoFile')}
                  </span>
                </div>
              </div>
            </div>
            {logoPreview && (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt={t('agencyProfile.logoPreview')}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => setLogoPreview(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('agencyProfile.logoFormats')}
          </p>
        </div>
        
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            {t('agencyProfile.email')}
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={agencyData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('agencyProfile.emailPlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="agencyPhone" className="text-sm font-medium">
            {t('agencyProfile.phone')}
          </Label>
          <Input
            id="agencyPhone"
            type="tel"
            value={agencyData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder={t('agencyProfile.phonePlaceholder')}
            minLength={9}
            maxLength={20}
            pattern="[+0-9]*"
            className="mt-1"
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground mt-1">
            მხოლოდ + და ციფრები, მინიმუმ 9 სიმბოლო
          </p>
        </div>

        {/* Social Media */}
        <div>
          <Label htmlFor="agencySocialMedia" className="text-sm font-medium">
            {t('agencyProfile.socialMedia')}
          </Label>
          <Input 
            id="agencySocialMedia" 
            value={agencyData.socialMediaUrl}
            onChange={(e) => handleInputChange('socialMediaUrl', e.target.value)}
            placeholder={t('agencyProfile.socialMediaPlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="agencyWebsite" className="text-sm font-medium">
            {t('agencyProfile.website')}
          </Label>
          <Input 
            id="agencyWebsite" 
            value={agencyData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder={t('agencyProfile.websitePlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? t('agencyProfile.saving') : t('agencyProfile.save')}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            {t('agencyProfile.cancel')}
          </Button>
        </div>
      </div>
    </Card>
  );
};