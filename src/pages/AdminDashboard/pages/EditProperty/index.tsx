import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BasicInfoSection } from "../../../Dashboard/pages/AddProperty/components/BasicInfoSection";
import { PropertyDetailsSection } from "../../../Dashboard/pages/AddProperty/components/PropertyDetailsSection";
import { FeaturesSection } from "../../../Dashboard/pages/AddProperty/components/FeaturesSection";
import { AdvantagesSection } from "../../../Dashboard/pages/AddProperty/components/AdvantagesSection";
import { FurnitureAppliancesSection } from "../../../Dashboard/pages/AddProperty/components/FurnitureAppliancesSection";
import { TagsSection } from "../../../Dashboard/pages/AddProperty/components/TagsSection";
import { PriceAreaSection } from "../../../Dashboard/pages/AddProperty/components/PriceAreaSection";
import { ContactInfoSection } from "../../../Dashboard/pages/AddProperty/components/ContactInfoSection";
import { DescriptionSection } from "../../../Dashboard/pages/AddProperty/components/DescriptionSection";
import { PhotoGallerySection } from "../../../Dashboard/pages/AddProperty/components/PhotoGallerySection";
import { FormActions } from "../../../Dashboard/pages/AddProperty/components/FormActions";
import { propertyFormSchema, type PropertyFormData } from "../../../Dashboard/pages/AddProperty/types/propertyForm";
import { propertyApi, citiesApi } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish: string;
  nameRussian: string;
  isActive: boolean;
}

const AdminEditProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      features: [],
      advantages: [],
      furnitureAppliances: [],
      tags: [],
      photos: [],
      hasBalcony: false,
      hasPool: false,
      hasLivingRoom: false,
      hasLoggia: false,
      hasVeranda: false,
      hasYard: false,
      hasStorage: false,
    },
  });

  // Fetch cities on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchCities = async (retryCount = 0) => {
      if (!isMounted) return;
      
      try {
        const fetchedCities = await citiesApi.getAllCities(true); // Only active cities
        if (isMounted) {
          setCities(fetchedCities);
        }
      } catch (error: any) {
        if (!isMounted) return;
        
        // Handle 429 with single retry
        if (error.response?.status === 429 && retryCount === 0) {
          const retryAfter = Math.min(error.response?.data?.retryAfter || 2000, 5000);
          
          setTimeout(() => {
            if (isMounted) {
              fetchCities(retryCount + 1);
            }
          }, retryAfter);
          return;
        }
        
        // Give up and use empty array
        if (isMounted) {
          setCities([]);
        }
      }
    };

    fetchCities();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Load property data when component mounts
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        toast({
          title: t('common.error'),
          description: t('editProperty.messages.noId'),
          variant: "destructive",
        });
        navigate('/admin/listings');
        return;
      }

      try {
        setIsPropertyLoading(true);
        const property = await propertyApi.getPropertyByIdForEdit(id);
        
        // Populate form with property data
        // Store district value to set it after city is set
        const districtValue = property.areaData?.id?.toString() || "";
        
        form.reset({
          title: property.title || "",
          propertyType: property.propertyType || "",
          dealType: property.dealType || "",
          dailyRentalSubcategory: property.dailyRentalSubcategory || "",
          city: property.cityData?.code || property.city || "",
          district: "", // Set empty initially
          street: property.street || "",
          streetNumber: property.streetNumber || "",
          cadastralCode: property.cadastralCode || "",
          rooms: property.rooms?.toString() || "",
          bedrooms: property.bedrooms?.toString() || "",
          bathrooms: property.bathrooms?.toString() || "",
          totalFloors: property.totalFloors?.toString() || "",
          buildingStatus: property.buildingStatus || "",
          constructionYear: property.constructionYear?.toString() || "",
          condition: property.condition || "",
          projectType: property.projectType || "",
          ceilingHeight: property.ceilingHeight?.toString() || "",
          heating: property.heating || "",
          parking: property.parking || "",
          hotWater: property.hotWater || "",
          buildingMaterial: property.buildingMaterial || "",
          hasBalcony: property.hasBalcony || false,
          balconyCount: property.balconyCount?.toString() || "",
          balconyArea: property.balconyArea?.toString() || "",
          hasPool: property.hasPool || false,
          poolType: property.poolType || "",
          hasLivingRoom: property.hasLivingRoom || false,
          livingRoomArea: property.livingRoomArea?.toString() || "",
          livingRoomType: property.livingRoomType || "",
          hasLoggia: property.hasLoggia || false,
          loggiaArea: property.loggiaArea?.toString() || "",
          hasVeranda: property.hasVeranda || false,
          verandaArea: property.verandaArea?.toString() || "",
          hasYard: property.hasYard || false,
          yardArea: property.yardArea?.toString() || "",
          hasStorage: property.hasStorage || false,
          storageArea: property.storageArea?.toString() || "",
          storageType: property.storageType || "",
          features: property.features || [],
          advantages: property.advantages || [],
          furnitureAppliances: property.furnitureAppliances || [],
          tags: property.tags || [],
          area: property.area?.toString() || "",
          totalPrice: property.totalPrice?.toString() || "",
          pricePerSqm: property.pricePerSqm?.toString() || "",
          contactName: property.contactName || "",
          contactPhone: property.contactPhone || "",
          descriptionGeorgian: property.descriptionGeorgian || "",
          descriptionEnglish: property.descriptionEnglish || "",
          descriptionRussian: property.descriptionRussian || "",
          photos: []
        });
        
        // Set district value after form is reset and when areas are loaded
        // We need to wait a bit for the city to trigger area loading
        if (districtValue && property.cityData?.code) {
          setTimeout(() => {
            form.setValue("district", districtValue, { 
              shouldValidate: false, 
              shouldDirty: false,
              shouldTouch: false 
            });
          }, 1000); // Wait for areas to load
        }
      } catch (error: any) {
        console.error("Property loading error:", error);
        toast({
          title: t('common.error'),
          description: t('editProperty.messages.loadError'),
          variant: "destructive",
        });
        navigate('/admin/listings');
      } finally {
        setIsPropertyLoading(false);
      }
    };

    loadProperty();
  }, [id, form, toast, navigate]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!id) return;
    
    // Ensure cities are loaded before submission
    if (cities.length === 0) {
      toast({
        title: t('common.error'),
        description: t('editProperty.messages.citiesNotLoaded'),
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Convert form data to API format
      // Helper functions for data conversion
      const cleanData = (value: any) => value === "" ? undefined : value;
      const toNumber = (value: any) => value !== "" && value != null ? Number(value) : undefined;
      const toRequiredNumber = (value: any) => Number(value);
      
      // Map city code to cityId using fetched cities (case-insensitive)
      const getCityId = (cityCode: string) => {
        const city = cities.find(c => 
          c.code.toLowerCase() === cityCode.toLowerCase() ||
          c.nameEnglish?.toLowerCase() === cityCode.toLowerCase()
        );
        if (!city) {
          console.warn('City not found for code:', cityCode, 'Available codes:', cities.map(c => c.code));
          return undefined;
        }
        return city.id;
      };
      
      const cityId = getCityId(data.city);
      if (!cityId) {
        toast({
          title: t('common.error'),
          description: t('editProperty.messages.cityNotFound', { city: data.city }),
          variant: "destructive",
        });
        return;
      }
      
      const propertyData = {
        title: data.title,
        propertyType: data.propertyType,
        dealType: data.dealType,
        dailyRentalSubcategory: cleanData(data.dailyRentalSubcategory),
        cityId: cityId,
        city: data.city, // Keep for backward compatibility
        areaId: data.district ? toNumber(data.district) : undefined,
        district: data.district,
        street: data.street,
        streetNumber: cleanData(data.streetNumber),
        cadastralCode: cleanData(data.cadastralCode),
        rooms: toNumber(data.rooms),
        bedrooms: toNumber(data.bedrooms),
        bathrooms: toNumber(data.bathrooms),
        totalFloors: toNumber(data.totalFloors),
        buildingStatus: cleanData(data.buildingStatus),
        constructionYear: cleanData(data.constructionYear),
        condition: cleanData(data.condition),
        projectType: cleanData(data.projectType),
        ceilingHeight: toNumber(data.ceilingHeight),
        heating: cleanData(data.heating),
        parking: cleanData(data.parking),
        hotWater: cleanData(data.hotWater),
        buildingMaterial: cleanData(data.buildingMaterial),
        hasBalcony: data.hasBalcony,
        balconyCount: toNumber(data.balconyCount),
        balconyArea: toNumber(data.balconyArea),
        hasPool: data.hasPool,
        poolType: cleanData(data.poolType),
        hasLivingRoom: data.hasLivingRoom,
        livingRoomArea: toNumber(data.livingRoomArea),
        livingRoomType: cleanData(data.livingRoomType),
        hasLoggia: data.hasLoggia,
        loggiaArea: toNumber(data.loggiaArea),
        hasVeranda: data.hasVeranda,
        verandaArea: toNumber(data.verandaArea),
        hasYard: data.hasYard,
        yardArea: toNumber(data.yardArea),
        hasStorage: data.hasStorage,
        storageArea: toNumber(data.storageArea),
        storageType: cleanData(data.storageType),
        features: data.features,
        advantages: data.advantages,
        furnitureAppliances: data.furnitureAppliances,
        tags: data.tags,
        area: toRequiredNumber(data.area),
        totalPrice: toRequiredNumber(data.totalPrice),
        pricePerSqm: toNumber(data.pricePerSqm),
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        descriptionGeorgian: cleanData(data.descriptionGeorgian),
        descriptionEnglish: cleanData(data.descriptionEnglish),
        descriptionRussian: cleanData(data.descriptionRussian),
        // TODO: Handle photo uploads
        photos: []
      };

      await propertyApi.updateProperty(id, propertyData);
      
      toast({
        title: t('common.success'),
        description: t('editProperty.messages.updated'),
      });
      
      navigate('/admin/listings');
    } catch (error: any) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast({
        title: "შეცდომა",
        description: error.response?.data?.message || error.response?.data?.errors?.join(', ') || t('editProperty.messages.updateError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    try {
      const formData = form.getValues();
      // Save to localStorage as draft with property ID
      localStorage.setItem(`admin_property_draft_${id}`, JSON.stringify(formData));
      
      toast({
        title: t('editProperty.messages.draftSaved'),
        description: t('editProperty.messages.draftDescription'),
      });
    } catch (error) {
      console.error("Draft save error:", error);
      toast({
        title: t('common.error'),
        description: t('editProperty.messages.draftError'),
        variant: "destructive",
      });
    } finally {
      setIsDraftSaving(false);
    }
  };

  if (isPropertyLoading) {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/listings")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <h2 className="text-2xl font-bold mb-6">{t('editProperty.title')}</h2>
          </div>
          <Card className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('common.loading')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/listings")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h2 className="text-2xl font-bold mb-6">{t('editProperty.title')}</h2>
          <p className="text-gray-600">{t('editProperty.propertyNumber', { id })}</p>
        </div>
      
      <Card className="p-6 mb-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <BasicInfoSection />
          
          {/* Property Details Section */}
          <PropertyDetailsSection />
          
          {/* Features Section */}
          <FeaturesSection />
          
          {/* Advantages Section */}
          <AdvantagesSection />
          
          {/* Furniture & Appliances Section */}
          <FurnitureAppliancesSection />
          
          {/* Tags Section */}
          <TagsSection />
          
          {/* Price & Area Section */}
          <PriceAreaSection />
          
          {/* Contact Info Section */}
          <ContactInfoSection />
          
          {/* Description Section */}
          <DescriptionSection />
          
          {/* Photo Gallery Section */}
          <PhotoGallerySection />
          
          
          </form>
        </Form>
      </Card>
      </div>
      
      <FormActions
        onSaveDraft={handleSaveDraft}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
        isDraftSaving={isDraftSaving}
        isEdit={true}
      />
    </div>
  );
};

export default AdminEditProperty;