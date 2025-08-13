import React, { useState } from "react";
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
import { propertyApi } from "@/lib/api";

export const AddProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);
    try {
      // Convert form data to API format
      const propertyData = {
        title: data.title,
        propertyType: data.propertyType,
        dealType: data.dealType,
        city: data.city,
        street: data.street,
        streetNumber: data.streetNumber,
        cadastralCode: data.cadastralCode,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        totalFloors: data.totalFloors,
        buildingStatus: data.buildingStatus,
        constructionYear: data.constructionYear,
        condition: data.condition,
        projectType: data.projectType,
        ceilingHeight: data.ceilingHeight,
        heating: data.heating,
        parking: data.parking,
        hotWater: data.hotWater,
        buildingMaterial: data.buildingMaterial,
        hasBalcony: data.hasBalcony,
        balconyCount: data.balconyCount,
        balconyArea: data.balconyArea,
        hasPool: data.hasPool,
        poolType: data.poolType,
        hasLivingRoom: data.hasLivingRoom,
        livingRoomArea: data.livingRoomArea,
        livingRoomType: data.livingRoomType,
        hasLoggia: data.hasLoggia,
        loggiaArea: data.loggiaArea,
        hasVeranda: data.hasVeranda,
        verandaArea: data.verandaArea,
        hasYard: data.hasYard,
        yardArea: data.yardArea,
        hasStorage: data.hasStorage,
        storageArea: data.storageArea,
        storageType: data.storageType,
        features: data.features,
        advantages: data.advantages,
        furnitureAppliances: data.furnitureAppliances,
        tags: data.tags,
        area: data.area,
        totalPrice: data.totalPrice,
        pricePerSqm: data.pricePerSqm,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        descriptionGeorgian: data.descriptionGeorgian,
        descriptionEnglish: data.descriptionEnglish,
        descriptionRussian: data.descriptionRussian,
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
