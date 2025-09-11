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
      if (agency.logoUrl) {
        // Set logo preview with full URL for server-uploaded images
        const logoUrl = agency.logoUrl.startsWith('/') 
          ? `http://localhost:5000${agency.logoUrl}` 
          : agency.logoUrl;
        setLogoPreview(logoUrl);
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
        title: "შეცდომა",
        description: "სააგენტოს მონაცემების ჩატვირთვა ვერ მოხერხდა - იყენებს mock მონაცემებს",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AgencyData, value: string) => {
    setAgencyData(prev => ({
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
        // Upload file to server
        const uploadResult = await agencyApi.uploadLogo(file);
        console.log('Logo upload result:', uploadResult);
        
        // Update local preview
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Update logo URL in state
        setAgencyData(prev => ({
          ...prev,
          logoUrl: uploadResult.logoUrl
        }));

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
        name: agencyData.name,
        phone: agencyData.phone,
        email: agencyData.email,
        website: agencyData.website || undefined,
        socialMediaUrl: agencyData.socialMediaUrl || undefined,
        logoUrl: logoPreview || undefined
      };

      await agencyApi.updateAgency(agencyData.id, updateData);
      
      toast({
        title: "წარმატება",
        description: "სააგენტოს მონაცემები შენახულია",
      });
    } catch (error) {
      console.error('Failed to save agency data:', error);
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
    loadAgencyData();
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
      <h3 className="text-lg font-medium mb-4">სააგენტოს ინფორმაცია</h3>
      <div className="space-y-4">
        {/* Agency Name */}
        <div>
          <Label htmlFor="agencyName" className="text-sm font-medium">
            სააგენტოს დასახელება
          </Label>
          <Input 
            id="agencyName" 
            value={agencyData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="შეიყვანეთ სააგენტოს დასახელება"
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
                  id="agency-logo-upload"
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
            value={agencyData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="სააგენტოს ელ-ფოსტის მისამართი"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="agencyPhone" className="text-sm font-medium">
            ტელეფონის ნომერი
          </Label>
          <Input 
            id="agencyPhone" 
            value={agencyData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="ტელეფონის ნომერი"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Social Media */}
        <div>
          <Label htmlFor="agencySocialMedia" className="text-sm font-medium">
            სოციალური მედია URL (არასავალდებულო)
          </Label>
          <Input 
            id="agencySocialMedia" 
            value={agencyData.socialMediaUrl}
            onChange={(e) => handleInputChange('socialMediaUrl', e.target.value)}
            placeholder="https://facebook.com/yourpage"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="agencyWebsite" className="text-sm font-medium">
            ვებსაიტი (არასავალდებულო)
          </Label>
          <Input 
            id="agencyWebsite" 
            value={agencyData.website}
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