import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { developerApi } from "@/lib/api";

interface DeveloperPersonalInfoProps {
  user: User;
}

interface DeveloperData {
  id: number;
  name: string;
  phone: string;
  email: string;
  website?: string;
  socialMediaUrl?: string;
  logoUrl?: string;
}

export const DeveloperPersonalInfo: React.FC<DeveloperPersonalInfoProps> = ({ user }) => {
  const { t } = useTranslation('userDashboard');
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [developerData, setDeveloperData] = useState<DeveloperData>({
    id: 0,
    name: '',
    phone: '',
    email: user.email,
    website: '',
    socialMediaUrl: '',
    logoUrl: ''
  });

  useEffect(() => {
    loadDeveloperData();
  }, []);

  const loadDeveloperData = async () => {
    try {
      setIsLoading(true);

      // Check if user has developer role
      if (!user || user.role !== 'developer') {
        throw new Error('User is not a developer');
      }

      const developer = await developerApi.getMyDeveloper();

      if (developer && typeof developer === 'object') {
        setDeveloperData({
          id: developer.id || 0,
          name: developer.name || '',
          phone: developer.phone || '',
          email: developer.email || user.email,
          website: developer.website || '',
          socialMediaUrl: developer.socialMediaUrl || '',
          logoUrl: developer.logoUrl || ''
        });

        // Try to load logo from developer record or from image system
        let logoUrl = developer.logoUrl;

        // If no logo in developer record, try to fetch from image system
        if (!logoUrl) {
          try {
            const imageResponse = await fetch(`/api/upload/developer/${user.id}/images?purpose=developer_logo`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              if (imageData.images && imageData.images.length > 0) {
                const logo = imageData.images[0];
                logoUrl = logo.urls?.small || logo.urls?.medium || logo.urls?.original;

                // Update developer data with found logo
                setDeveloperData(prev => ({
                  ...prev,
                  logoUrl: logoUrl || ''
                }));
              }
            }
          } catch (imageError) {
            console.log('No existing logo images found:', imageError);
          }
        }

        if (logoUrl) {
          setLogoPreview(logoUrl);
        } else {
          setLogoPreview(null);
        }
      } else {
        throw new Error('Invalid developer data received');
      }
    } catch (error) {
      console.error('Failed to load developer data:', error);

      // Fall back to basic user data
      setDeveloperData({
        id: user.developerId || 0,
        name: user.fullName || 'Developer Company',
        phone: user.phone || '',
        email: user.email,
        website: '',
        socialMediaUrl: '',
        logoUrl: ''
      });

      // Clear logo preview for fallback data
      setLogoPreview(null);

      // Only show toast if it's a real API error, not just missing endpoint
      if (error?.response?.status !== 404) {
        toast({
          title: t('developerProfile.errors.title'),
          description: t('developerProfile.errors.loadFailed'),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof DeveloperData, value: string) => {
    setDeveloperData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('developerProfile.errors.title'),
          description: t('developerProfile.errors.selectImageFile'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('developerProfile.errors.title'),
          description: t('developerProfile.errors.logoSizeExceeded'),
          variant: "destructive",
        });
        return;
      }

      try {
        setIsSaving(true);

        // Set preview first for immediate feedback
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('images', file);
        formData.append('purpose', 'developer_logo');

        // Upload to universal image upload endpoint
        const response = await fetch(`/api/upload/developer/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.images && result.images.length > 0) {
          const uploadedImage = result.images[0];
          const logoUrl = uploadedImage.urls?.small || uploadedImage.urls?.medium || uploadedImage.urls?.original;

          // Update the logo preview with the uploaded image URL
          setLogoPreview(logoUrl);

          // Update developer data with the new logo URL
          setDeveloperData(prev => ({
            ...prev,
            logoUrl: logoUrl
          }));

          toast({
            title: t('developerProfile.success.title'),
            description: t('developerProfile.success.logoUploaded'),
          });
        } else {
          throw new Error('No image data received from server');
        }
      } catch (error) {
        console.error('Logo upload failed:', error);
        toast({
          title: t('developerProfile.errors.title'),
          description: t('developerProfile.errors.logoUploadFailed'),
          variant: "destructive",
        });
        // Reset preview on error
        setLogoPreview(null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Basic validation
      if (!developerData.name.trim()) {
        toast({
          title: t('developerProfile.errors.title'),
          description: t('validation.required'),
          variant: "destructive",
        });
        return;
      }

      const updateData = {
        name: developerData.name.trim(),
        phone: developerData.phone.trim(),
        email: developerData.email.trim(),
        website: developerData.website?.trim() || undefined,
        socialMediaUrl: developerData.socialMediaUrl?.trim() || undefined,
        logoUrl: developerData.logoUrl || undefined
      };

      // Make the API call - the backend will handle creating the record if it doesn't exist
      let developerId = developerData.id;

      // If no ID, use a placeholder (backend will create the record)
      if (!developerId || developerId === 0) {
        developerId = 1; // Placeholder ID - backend will create the record
      }

      const result = await developerApi.updateDeveloper(developerId.toString(), updateData);

      // Update the local state with the returned data
      if (result && result.id) {
        setDeveloperData(prevData => ({
          ...prevData,
          id: result.id
        }));
      }

      // Reload the data to ensure we have the latest information
      await loadDeveloperData();

      toast({
        title: t('developerProfile.success.title'),
        description: t('developerProfile.success.dataSaved'),
      });
    } catch (error) {
      console.error('Failed to save developer data:', error);

      // Show specific error messages when available
      const errorMessage = error?.response?.data?.message || t('developerProfile.errors.saveFailed');

      toast({
        title: t('developerProfile.errors.title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setDeveloperData(prev => ({
      ...prev,
      logoUrl: ''
    }));
  };

  const handleCancel = () => {
    loadDeveloperData();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">{t('developerProfile.loading')}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{t('developerProfile.title')}</h3>
      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <Label htmlFor="developerName" className="text-sm font-medium">
            {t('developerProfile.companyName')}
          </Label>
          <Input
            id="developerName"
            value={developerData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('developerProfile.companyNamePlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium">{t('developerProfile.logo')}</Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="developer-logo-upload"
                  disabled={isSaving}
                />
                <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-md bg-background hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isSaving ? t('developerProfile.loading') : t('developerProfile.selectLogoFile')}
                  </span>
                </div>
              </div>
            </div>
            {logoPreview && (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt={t('developerProfile.logoPreview')}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={handleLogoRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('developerProfile.logoFormats')}
          </p>
        </div>
        
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            {t('developerProfile.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={developerData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('developerProfile.emailPlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="developerPhone" className="text-sm font-medium">
            {t('developerProfile.phone')}
          </Label>
          <Input
            id="developerPhone"
            value={developerData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder={t('developerProfile.phonePlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Social Media */}
        <div>
          <Label htmlFor="developerSocialMedia" className="text-sm font-medium">
            {t('developerProfile.socialMedia')}
          </Label>
          <Input
            id="developerSocialMedia"
            value={developerData.socialMediaUrl}
            onChange={(e) => handleInputChange('socialMediaUrl', e.target.value)}
            placeholder={t('developerProfile.socialMediaPlaceholder')}
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="developerWebsite" className="text-sm font-medium">
            {t('developerProfile.website')}
          </Label>
          <Input
            id="developerWebsite"
            value={developerData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder={t('developerProfile.websitePlaceholder')}
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
            {isSaving ? t('developerProfile.saving') : t('developerProfile.save')}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            {t('developerProfile.cancel')}
          </Button>
        </div>
      </div>
    </Card>
  );
};