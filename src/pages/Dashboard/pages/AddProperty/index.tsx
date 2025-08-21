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
import { VipSelectionSection } from "./components/VipSelectionSection";
import { propertyFormSchema, type PropertyFormData } from "./types/propertyForm";
import { propertyApi, citiesApi, vipApi, balanceApi, servicesApi } from "@/lib/api";

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
  const [selectedVipType, setSelectedVipType] = useState<string>('free');
  const [selectedVipDays, setSelectedVipDays] = useState<number>(7);
  const [selectedServices, setSelectedServices] = useState<{serviceType: string, days: number}[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);
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
          
          const mappedAdditionalServices = additionalSvcs.map((service: any) => ({
            id: service.id,
            serviceType: service.serviceType,
            pricePerDay: service.pricePerDay,
            descriptionKa: service.descriptionKa,
            descriptionEn: service.descriptionEn,
            features: service.features || []
          }));
          
          setVipPricing(mappedVipPricing.filter((p: any) => p.vipType !== 'none'));
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
        title: "შეცდომა",
        description: "VIP დღეების რაოდენობა უნდა იყოს 1-დან 30-მდე",
        variant: "destructive",
      });
      return;
    }

    // Validate additional services days
    for (const service of selectedServices) {
      if (service.days < 1 || service.days > 30) {
        toast({
          title: "შეცდომა",
          description: "სერვისების დღეების რაოდენობა უნდა იყოს 1-დან 30-მდე",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Balance validation
    if (totalCost > 0 && userBalance < totalCost) {
      toast({
        title: "არასაკმარისი ბალანსი",
        description: `საჭიროა ${totalCost.toFixed(2)}₾, ხელმისაწვდომია ${userBalance.toFixed(2)}₾`,
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


      // Create property first
      const result = await propertyApi.createProperty(propertyData);
      
      // Handle VIP purchase if not free
      if (selectedVipType !== 'free') {
        const daysNum = parseInt(selectedDays);
        await vipApi.purchaseVipStatus(result.id, selectedVipType, daysNum);
        
        toast({
          title: "წარმატება!",
          description: `განცხადება წარმატებით დაემატა და VIP სტატუსი შეძენილია ${daysNum} დღით`,
        });
      } else {
        toast({
          title: "წარმატება!",
          description: "განცხადება წარმატებით დაემატა",
        });
      }
      
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

  
  const handleVipPurchased = () => {
    navigate('/dashboard/my-properties');
  };

  const handleSkipVip = () => {
    navigate('/dashboard/my-properties');
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 pb-16 sm:pb-24 md:pb-32">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">განცხადების დამატება</h2>
      
        <Card className="p-2 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
        
        {/* VIP Selection Section */}
        <VipSelectionSection
          selectedVipType={selectedVipType}
          selectedVipDays={selectedVipDays}
          selectedServices={selectedServices}
          onVipTypeChange={setSelectedVipType}
          onVipDaysChange={setSelectedVipDays}
          onServicesChange={setSelectedServices}
          userBalance={userBalance}
          vipPricing={vipPricing}
          additionalServices={additionalServices}
        />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-end">
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                განცხადების დამატება...
              </>
            ) : (
              'განცხადების დამატება'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
