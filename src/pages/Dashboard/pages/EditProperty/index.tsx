import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { BasicInfoSection } from "../AddProperty/components/BasicInfoSection";
import { PropertyDetailsSection } from "../AddProperty/components/PropertyDetailsSection";
import { FeaturesSection } from "../AddProperty/components/FeaturesSection";
import { AdvantagesSection } from "../AddProperty/components/AdvantagesSection";
import { FurnitureAppliancesSection } from "../AddProperty/components/FurnitureAppliancesSection";
import { TagsSection } from "../AddProperty/components/TagsSection";
import { PriceAreaSection } from "../AddProperty/components/PriceAreaSection";
import { ContactInfoSection } from "../AddProperty/components/ContactInfoSection";
import { DescriptionSection } from "../AddProperty/components/DescriptionSection";
import { PhotoGallerySection } from "../AddProperty/components/PhotoGallerySection";
import { FormActions } from "../AddProperty/components/FormActions";
import { propertyFormSchema, type PropertyFormData } from "../AddProperty/types/propertyForm";
import { propertyApi } from "@/lib/api";

export const EditProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

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

  // Load property data when component mounts
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        toast({
          title: "შეცდომა",
          description: "უძრავი ქონების ID არ არის მითითებული",
          variant: "destructive",
        });
        navigate('/dashboard/my-properties');
        return;
      }

      try {
        setIsPropertyLoading(true);
        const property = await propertyApi.getPropertyByIdForEdit(id);
        
        // Populate form with property data
        form.reset({
          title: property.title || "",
          propertyType: property.propertyType || "",
          dealType: property.dealType || "",
          city: property.city || "",
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
      } catch (error: any) {
        console.error("Property loading error:", error);
        toast({
          title: "შეცდომა",
          description: "შეცდომა მოხდა უძრავი ქონების ჩატვირთვისას",
          variant: "destructive",
        });
        navigate('/dashboard/my-properties');
      } finally {
        setIsPropertyLoading(false);
      }
    };

    loadProperty();
  }, [id, form, toast, navigate]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!id) return;
    
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

      await propertyApi.updateProperty(id, propertyData);
      
      toast({
        title: "წარმატება!",
        description: "განცხადება წარმატებით განახლდა",
      });
      
      navigate('/dashboard/my-properties');
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "შეცდომა",
        description: error.response?.data?.message || "შეცდომა მოხდა განცხადების განახლებისას",
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
      localStorage.setItem(`property_draft_${id}`, JSON.stringify(formData));
      
      toast({
        title: "დრაფთი შენახულია",
        description: "შეგიძლიათ მოგვიანებით განაგრძოთ განცხადების რედაქტირება",
      });
    } catch (error) {
      console.error("Draft save error:", error);
      toast({
        title: "შეცდომა",
        description: "შეცდომა მოხდა დრაფთის შენახვისას",
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
          <h2 className="text-2xl font-bold mb-6">განცხადების რედაქტირება</h2>
          <Card className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">მონაცემების ჩატვირთვა...</p>
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
        <h2 className="text-2xl font-bold mb-6">განცხადების რედაქტირება</h2>
      
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