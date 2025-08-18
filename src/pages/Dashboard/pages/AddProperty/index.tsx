import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { PropertyDetailsSection } from "./components/PropertyDetailsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { AdvantagesSection } from "./components/AdvantagesSection";
import { FurnitureAppliancesSection } from "./components/FurnitureAppliancesSection";
import { TagsSection } from "./components/TagsSection";
import { PriceAreaSection } from "./components/PriceAreaSection";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { DescriptionSection } from "./components/DescriptionSection";
import { PhotoGallerySection } from "./components/PhotoGallerySection";
import { FormActions } from "./components/FormActions";
import { propertyFormSchema, type PropertyFormData } from "./types/propertyForm";
import { propertyApi, citiesApi } from "@/lib/api";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish: string;
  nameRussian: string;
  isActive: boolean;
}

export const AddProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const onSubmit = async (data: PropertyFormData) => {
    // Ensure cities are loaded before submission
    if (cities.length === 0) {
      toast({
        title: "შეცდომა",
        description: "ქალაქები ჯერ არ ჩაიტვირთა. გთხოვთ მოიცადოთ.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
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
          title: "შეცდომა",
          description: `ქალაქი "${data.city}" ვერ მოიძებნა. გთხოვთ აირჩიოთ სწორი ქალაქი.`,
          variant: "destructive",
        });
        return;
      }
      
      // Convert form data to API format
      const propertyData = {
        title: data.title,
        propertyType: data.propertyType,
        dealType: data.dealType,
        dailyRentalSubcategory: cleanData(data.dailyRentalSubcategory),
        projectId: data.projectId ? toNumber(data.projectId) : undefined,
        cityId: cityId,
        city: data.city,
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

      await propertyApi.createProperty(propertyData);
      
      toast({
        title: "წარმატება!",
        description: "განცხადება წარმატებით დაემატა და ადმინისტრაციის მიერ განხილვაშია",
      });
      
      navigate('/dashboard/my-properties');
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "შეცდომა",
        description: error.response?.data?.message || "შეცდომა მოხდა განცხადების დამატებისას",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative">
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-2xl font-bold mb-6">განცხადების დამატება</h2>
      
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
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </div>
  );
};
