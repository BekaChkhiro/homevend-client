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
import { VipPurchaseSection } from "./components/VipPurchaseSection";
import { propertyFormSchema, type PropertyFormData } from "../AddProperty/types/propertyForm";
import { propertyApi, citiesApi, vipApi, balanceApi, servicesApi } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish: string;
  nameRussian: string;
  isActive: boolean;
}

export const EditProperty = () => {
  const { t } = useTranslation('userDashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedVipType, setSelectedVipType] = useState<string>('free');
  const [selectedVipDays, setSelectedVipDays] = useState<number>(7);
  const [selectedServices, setSelectedServices] = useState<{serviceType: string, days: number}[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);
  const [freeServicePrice, setFreeServicePrice] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      currency: "USD", // All prices stored in USD
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

  // Fetch cities and VIP data on component mount
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

    const fetchVipData = async () => {
      if (!isMounted) return;
      
      try {
        const [servicesData, balanceData] = await Promise.all([
          servicesApi.getServicePricing(),
          balanceApi.getBalance()
        ]);
        
        if (isMounted) {
          // Use VIP services from the new API and map to expected structure
          const vipServices = servicesData.vipServices || [];
          const additionalSvcs = servicesData.additionalServices || [];
          
          const mappedVipPricing = vipServices.map((service: any) => ({
            id: service.id,
            vipType: service.serviceType,
            pricePerDay: service.pricePerDay,
            descriptionKa: service.descriptionKa,
            descriptionEn: service.descriptionEn,
            features: service.features || []
          }));
          
          // Find free service from VIP services and store its price
          const freeService = mappedVipPricing.find(p => p.vipType === 'free');
          const freePriceValue = freeService?.pricePerDay || 0;
          setFreeServicePrice(freePriceValue);
          
          const mappedAdditionalServices = additionalSvcs.map((service: any) => ({
            id: service.id,
            serviceType: service.serviceType,
            pricePerDay: service.pricePerDay,
            descriptionKa: service.descriptionKa,
            descriptionEn: service.descriptionEn,
            features: service.features || []
          }));
          
          // Filter out free service if its price is 0 (we'll show hardcoded free card instead)
          const filteredVipPricing = mappedVipPricing.filter((p: any) => 
            p.vipType !== 'none' && !(p.vipType === 'free' && p.pricePerDay === 0)
          );
          setVipPricing(filteredVipPricing);
          setAdditionalServices(mappedAdditionalServices);
          setUserBalance(balanceData.balance);
        }
      } catch (error) {
        console.error('Error fetching VIP data:', error);
      }
    };

    fetchCities();
    fetchVipData();
    
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
          description: t('editProperty.propertyIdMissing'),
          variant: "destructive",
        });
        navigate('/dashboard/my-properties');
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
          isPriceNegotiable: property.isPriceNegotiable || false,
          pricePerSqm: property.pricePerSqm?.toString() || "",
          currency: "USD", // All prices stored in USD
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
          description: t('editProperty.loadError'),
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
    
    // Ensure cities are loaded before submission
    if (cities.length === 0) {
      toast({
        title: t('common.error'),
        description: t('addProperty.citiesNotLoaded'),
        variant: "destructive",
      });
      return;
    }

    // Services validation and cost calculation
    const selectedPricing = vipPricing.find(p => p.vipType === selectedVipType);
    const selectedServicePricing = additionalServices.filter(s => 
      selectedServices.some(sel => sel.serviceType === s.serviceType)
    );
    
    const vipCost = selectedPricing && selectedVipType !== 'free' 
      ? selectedPricing.pricePerDay * selectedVipDays : 0;
    const servicesCost = selectedServicePricing.reduce((total, service) => {
      const selectedService = selectedServices.find(s => s.serviceType === service.serviceType);
      return total + (service.pricePerDay * (selectedService?.days || 1));
    }, 0);
    const totalCost = vipCost + servicesCost;
    
    // Days validation
    if (selectedVipType !== 'free' && (selectedVipDays < 1 || selectedVipDays > 30)) {
      toast({
        title: t('common.error'),
        description: t('addProperty.vipDaysError'),
        variant: "destructive",
      });
      return;
    }

    // Validate additional services days
    for (const service of selectedServices) {
      if (service.days < 1 || service.days > 30) {
        toast({
          title: t('common.error'),
          description: t('addProperty.serviceDaysError'),
          variant: "destructive",
        });
        return;
      }
    }
    
    // Balance validation
    if (totalCost > 0 && userBalance < totalCost) {
      toast({
        title: t('addProperty.insufficientBalance'),
        description: t('addProperty.insufficientBalanceDesc', { 
          required: totalCost.toFixed(2), 
          available: userBalance.toFixed(2) 
        }),
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
          description: t('addProperty.cityNotFound', { city: data.city }),
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
        isPriceNegotiable: data.isPriceNegotiable,
        totalPrice: data.isPriceNegotiable ? null : toRequiredNumber(data.totalPrice),
        pricePerSqm: data.isPriceNegotiable ? null : toNumber(data.pricePerSqm),
        currency: "USD", // All prices stored in USD only
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        descriptionGeorgian: cleanData(data.descriptionGeorgian),
        descriptionEnglish: cleanData(data.descriptionEnglish),
        descriptionRussian: cleanData(data.descriptionRussian),
        // TODO: Handle photo uploads
        photos: []
      };

      // Update property first
      await propertyApi.updateProperty(id, propertyData);
      
      // Upload pending images if any
      if (pendingImages.length > 0) {
        try {
          const formData = new FormData();
          pendingImages.forEach(file => {
            formData.append('images', file);
          });
          formData.append('purpose', 'property_gallery');
          
          const token = localStorage.getItem('token');
          const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/property/${id}`, {
            method: 'POST',
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
          });
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            setUploadedImages([...uploadedImages, ...(uploadResult.images || [])]);
            setPendingImages([]); // Clear pending images
            console.log(`Successfully uploaded ${uploadResult.images?.length || 0} images`);
          } else {
            const errorResult = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
            console.warn('Image upload failed:', errorResult.error);
            // Don't throw error - property update succeeded, just image upload failed
          }
        } catch (uploadError) {
          console.warn('Image upload error:', uploadError);
          // Don't throw error - property update succeeded, just image upload failed
        }
      }
      
      // Handle services purchase (VIP + additional services)
      const servicesToPurchase = [];
      
      // Add VIP service if not free
      if (selectedVipType !== 'free') {
        servicesToPurchase.push({
          serviceType: selectedVipType,
          days: selectedVipDays
        });
      }
      
      // Add additional services
      selectedServices.forEach(service => {
        servicesToPurchase.push({
          serviceType: service.serviceType,
          days: service.days
        });
      });
      
      // Purchase all services together if any selected
      if (servicesToPurchase.length > 0) {
        await servicesApi.purchaseServices(parseInt(id), servicesToPurchase);
        
        const servicesText = [];
        if (selectedVipType !== 'free') {
          servicesText.push(`VIP სტატუსი (${selectedVipDays} დღე)`);
        }
        selectedServices.forEach(service => {
          const label = service.serviceType === 'auto_renew' ? 'ავტო განახლება' : 'ფერადი გამოყოფა';
          servicesText.push(`${label} (${service.days} დღე)`);
        });
        
        const imageUploadText = pendingImages.length > 0 ? ` Images uploaded: ${pendingImages.length}` : '';
        toast({
          title: t('common.success'),
          description: t('editProperty.successWithServices', { services: servicesText.join(', ') }) + imageUploadText,
        });
      } else {
        const imageUploadText = pendingImages.length > 0 ? ` ${pendingImages.length} images uploaded successfully.` : '';
        toast({
          title: t('common.success'),
          description: t('editProperty.successWithoutServices') + imageUploadText,
        });
      }
      
      navigate('/dashboard/my-properties');
    } catch (error: any) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || error.response?.data?.errors?.join(', ') || t('editProperty.updateError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (isPropertyLoading) {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-2xl font-bold mb-6">{t('editProperty.title')}</h2>
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
      <div className="flex-1 overflow-auto p-6 pb-32">
        <h2 className="text-2xl font-bold mb-6">{t('editProperty.title')}</h2>
      
      <Card className="p-6 mb-6">
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
          <PhotoGallerySection 
            propertyId={id ? parseInt(id) : undefined}
            onImagesChange={(images) => {
              setUploadedImages(images);
            }}
            onPendingImagesChange={(files) => {
              setPendingImages(files);
            }}
          />
          
          </form>
        </Form>
      </Card>
      
      {/* VIP Purchase Section */}
      {id && (
        <div className="mb-6">
          <VipPurchaseSection
            propertyId={parseInt(id)}
            propertyTitle={form.watch('title') || 'განცხადება'}
            selectedVipType={selectedVipType}
            selectedVipDays={selectedVipDays}
            selectedServices={selectedServices}
            onVipTypeChange={setSelectedVipType}
            onVipDaysChange={setSelectedVipDays}
            onServicesChange={setSelectedServices}
            userBalance={userBalance}
            vipPricing={vipPricing}
            additionalServices={additionalServices}
            freeServicePrice={freeServicePrice}
          />
        </div>
      )}
      
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {pendingImages.length > 0 ? 
                  t('editProperty.updatingWithImages', { count: pendingImages.length }) : 
                  t('editProperty.updating')
                }
              </>
            ) : (
              t('editProperty.updateProperty')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};