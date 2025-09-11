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
      console.log('=== LOADING DEVELOPER DATA ===');
      console.log('Current user from AuthContext:', user);
      console.log('User role:', user.role);
      console.log('User fullName from AuthContext:', user.fullName);
      console.log('Token exists:', !!localStorage.getItem('token'));
      
      const developer = await developerApi.getMyDeveloper();
      console.log('=== DEVELOPER API RESPONSE ===');
      console.log('Full developer response:', developer);
      console.log('Developer name:', developer.name);
      console.log('Developer phone:', developer.phone);
      console.log('Developer email:', developer.email);
      
      setDeveloperData({
        id: developer.id,
        name: developer.name || '',
        phone: developer.phone || '',
        email: developer.email || user.email,
        website: developer.website || '',
        socialMediaUrl: developer.socialMediaUrl || '',
        logoUrl: developer.logoUrl || ''
      });
      if (developer.logoUrl) {
        // Set logo preview with full URL for server-uploaded images
        const logoUrl = developer.logoUrl.startsWith('/') 
          ? `http://localhost:5000${developer.logoUrl}` 
          : developer.logoUrl;
        setLogoPreview(logoUrl);
      }
    } catch (error) {
      console.error('Failed to load developer data:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Full error object:', error);
      
      // Fall back to mock data
      setDeveloperData({
        id: 2,
        name: 'Test Developer Company',
        phone: '555-1234',
        email: 'testdeveloper@example.com',
        website: '',
        socialMediaUrl: '',
        logoUrl: ''
      });
      
      toast({
        title: "შეცდომა",
        description: "დეველოპერის მონაცემების ჩატვირთვა ვერ მოხერხდა - იყენებს mock მონაცემებს",
        variant: "destructive",
      });
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
          title: "შეცდომა",
          description: "გთხოვთ აირჩიოთ სურათის ფაილი",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "შეცდომა", 
          description: "ლოგოს ზომა არ უნდა აღემატებოდეს 5MB-ს",
          variant: "destructive",
        });
        return;
      }

      try {
        // For now, just set preview since upload might not be implemented
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        toast({
          title: "წარმატება",
          description: "ლოგო ატვირთულია",
        });
      } catch (error) {
        console.error('Logo upload failed:', error);
        toast({
          title: "შეცდომა",
          description: "ლოგოს ატვირთვა ვერ მოხერხდა",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        name: developerData.name,
        phone: developerData.phone,
        email: developerData.email,
        website: developerData.website || undefined,
        socialMediaUrl: developerData.socialMediaUrl || undefined,
        logoUrl: logoPreview || undefined
      };

      await developerApi.updateDeveloper(developerData.id.toString(), updateData);
      
      toast({
        title: "წარმატება",
        description: "დეველოპერის მონაცემები შენახულია",
      });
    } catch (error) {
      console.error('Failed to save developer data:', error);
      toast({
        title: "შეცდომა",
        description: "მონაცემების შენახვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
            <p className="mt-2">მონაცემები იტვირთება...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">დეველოპერული კომპანიის ინფორმაცია</h3>
      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <Label htmlFor="developerName" className="text-sm font-medium">
            დეველოპერული კომპანიის დასახელება
          </Label>
          <Input 
            id="developerName" 
            value={developerData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="შეიყვანეთ კომპანიის დასახელება"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium">ლოგო (არასავალდებულო)</Label>
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
                    აირჩიეთ ლოგოს ფაილი
                  </span>
                </div>
              </div>
            </div>
            {logoPreview && (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="ლოგოს წინასწარი ნახვა"
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
            მხარდაჭერილი ფორმატები: JPG, PNG, GIF. მაქსიმალური ზომა: 5MB
          </p>
        </div>
        
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            ელ-ფოსტა
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={developerData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="კომპანიის ელ-ფოსტის მისამართი"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="developerPhone" className="text-sm font-medium">
            ტელეფონის ნომერი
          </Label>
          <Input 
            id="developerPhone" 
            value={developerData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="ტელეფონის ნომერი"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Social Media */}
        <div>
          <Label htmlFor="developerSocialMedia" className="text-sm font-medium">
            სოციალური მედია URL (არასავალდებულო)
          </Label>
          <Input 
            id="developerSocialMedia" 
            value={developerData.socialMediaUrl}
            onChange={(e) => handleInputChange('socialMediaUrl', e.target.value)}
            placeholder="https://facebook.com/yourpage"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="developerWebsite" className="text-sm font-medium">
            ვებსაიტი (არასავალდებულო)
          </Label>
          <Input 
            id="developerWebsite" 
            value={developerData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
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
            {isSaving ? "შენახვა..." : "შენახვა"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            გაუქმება
          </Button>
        </div>
      </div>
    </Card>
  );
};