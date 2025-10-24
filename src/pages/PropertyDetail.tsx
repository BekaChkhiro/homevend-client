
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Phone, Mail, Share2, Calendar, Loader2, Building, Building2, Home, Thermometer, Car, Droplets, Hammer, Hash, Ruler, Layers, Info, DollarSign, Banknote, Briefcase, Settings, Calendar as CalendarIcon, Wrench, Star, Trophy, Sofa, Tag, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PropertyDetailSkeleton, SimilarPropertiesSkeleton } from "@/components/PropertyDetailSkeleton";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";
import { ImageLightbox } from "@/components/ImageLightbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Property {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  dailyRentalSubcategory?: string;
  city: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish?: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  street: string;
  streetNumber?: string;
  cadastralCode?: string;
  area: string;
  totalPrice: string;
  pricePerSqm?: number;
  currency?: string;
  
  // Property structure details
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  totalFloors?: string;
  propertyFloor?: string;
  
  // Building characteristics
  buildingStatus?: string;
  constructionYear?: string;
  condition?: string;
  projectType?: string;
  ceilingHeight?: number;
  buildingMaterial?: string;
  
  // Infrastructure
  heating?: string;
  parking?: string;
  hotWater?: string;
  
  // Conditional features with details
  hasBalcony?: boolean;
  balconyCount?: number;
  balconyArea?: number;
  hasPool?: boolean;
  poolType?: string;
  hasLivingRoom?: boolean;
  livingRoomArea?: number;
  livingRoomType?: string;
  hasLoggia?: boolean;
  loggiaArea?: number;
  hasVeranda?: boolean;
  verandaArea?: number;
  hasYard?: boolean;
  yardArea?: number;
  hasStorage?: boolean;
  storageArea?: number;
  storageType?: string;
  
  // Media and content
  photos: string[];
  features: string[];
  advantages: string[];
  furnitureAppliances: string[];
  tags: string[];
  
  // Descriptions
  descriptionGeorgian?: string;
  descriptionEnglish?: string;
  descriptionRussian?: string;
  
  // Contact and metadata
  contactName: string;
  contactPhone: string;
  status: string;
  viewCount: number;
  createdAt: string;
  project?: {
    id: number;
    projectName: string;
    street: string;
    city: {
      nameGeorgian: string;
      nameEnglish?: string;
      nameRussian?: string;
    };
  };
  user: {
    id: number;
    fullName: string;
    email: string;
    role?: string;
  };
  
  // VIP status fields
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
}

// Translation functions moved outside component to prevent recreation on every render
const translateBuildingStatus = (status: string, t: any) => {
  const translationKey = `buildingStatus.${status.replace('-', '_')}`;
  return t(translationKey, { defaultValue: status });
};

const translateConstructionYear = (year: string, t: any) => {
  const translationKey = `constructionYear.${year.replace('-', '_')}`;
  return t(translationKey, { defaultValue: year });
};

const translateCondition = (condition: string, t: any) => {
  const translationKey = `condition.${condition.replace('-', '_')}`;
  return t(translationKey, { defaultValue: condition });
};

const translateProjectType = (type: string, t: any) => {
  const translationKey = `projectType.${type.replace('-', '_')}`;
  return t(translationKey, { defaultValue: type });
};

const translateBuildingMaterial = (material: string, t: any) => {
  const translationKey = `buildingMaterial.${material}`;
  return t(translationKey, { defaultValue: material });
};

const translatePropertyType = (type: string, t: any) => {
  const translationKey = `propertyType.${type}`;
  return t(translationKey, { defaultValue: type });
};

const translateDealType = (type: string, t: any) => {
  const translationKey = `dealType.${type}`;
  return t(translationKey, { defaultValue: type });
};

const translateParking = (parking: string, t: any) => {
  const translationKey = `parking.${parking.replace(/-/g, '_')}`;
  return t(translationKey, { defaultValue: parking });
};

const translateHeating = (heating: string, t: any) => {
  const translationKey = `heating.${heating.replace(/-/g, '_')}`;
  return t(translationKey, { defaultValue: heating });
};

const translateHotWater = (hotWater: string, t: any) => {
  const translationKey = `hotWater.${hotWater.replace(/-/g, '_')}`;
  return t(translationKey, { defaultValue: hotWater });
};

const translatePoolType = (poolType: string, t: any) => {
  const translationKey = `poolType.${poolType}`;
  return t(translationKey, { defaultValue: poolType });
};

const translateFeature = (feature: string, t: any) => {
  const translationKey = `features.${feature.replace('-', '_')}`;
  return t(translationKey, { defaultValue: feature });
};

const translateAdvantage = (advantage: string, t: any) => {
  const translationKey = `advantages.${advantage.replace('-', '_')}`;
  return t(translationKey, { defaultValue: advantage });
};

const translateFurnitureAppliance = (item: string, t: any) => {
  const translationKey = `furnitureAppliances.${item.replace('-', '_')}`;
  return t(translationKey, { defaultValue: item });
};

const translateTag = (tag: string, t: any) => {
  const translationKey = `tags.${tag.replace('-', '_')}`;
  return t(translationKey, { defaultValue: tag });
};

// Component for Similar Property Card to handle image fetching
const SimilarPropertyCard = ({ prop, t, i18n, formatPrice }: {
  prop: Property;
  t: any;
  i18n: any;
  formatPrice: (price: string | number) => string;
}) => {
  const [propertyImage, setPropertyImage] = useState<string>("https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop");

  useEffect(() => {
    const fetchSimilarPropertyImage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/property/${prop.id}/images`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            const firstImage = data.images[0];
            setPropertyImage(firstImage.urls?.medium || firstImage.urls?.small || firstImage.urls?.original);
          }
        }
      } catch (error) {
        console.warn('Failed to load similar property image:', error);
        if (prop.photos && prop.photos.length > 0) {
          setPropertyImage(prop.photos[0]);
        }
      }
    };

    fetchSimilarPropertyImage();
  }, [prop.id, prop.photos]);

  // Helper function to get city name based on language
  const getCityName = (cityData?: Property['cityData'], cityFallback?: string) => {
    if (cityData) {
      if (i18n.language === 'en' && cityData.nameEnglish) {
        return cityData.nameEnglish;
      } else if (i18n.language === 'ru' && cityData.nameRussian) {
        return cityData.nameRussian;
      }
      return cityData.nameGeorgian;
    }
    return cityFallback || '';
  };

  // Helper function to get area name based on language
  const getAreaName = (areaData?: Property['areaData'], districtFallback?: string) => {
    if (areaData) {
      if (i18n.language === 'en' && areaData.nameEn) {
        return areaData.nameEn;
      } else if (i18n.language === 'ru' && areaData.nameRu) {
        return areaData.nameRu;
      }
      return areaData.nameKa;
    }
    return districtFallback || '';
  };

  // Build location string with district if available
  const getLocationString = (property: Property) => {
    let location = property.street;

    // Add street number if available
    if (property.streetNumber) {
      location += ` ${property.streetNumber}`;
    }

    // Add district/area if available
    const areaName = getAreaName(property.areaData, property.district);
    if (areaName) {
      location += `, ${areaName}`;
    }

    // Add city
    const cityName = getCityName(property.cityData, property.city);
    if (cityName) {
      location += `, ${cityName}`;
    }

    return location;
  };

  const similarProperty = {
    id: prop.id,
    title: prop.title || `${translatePropertyType(prop.propertyType, t)} ${translateDealType(prop.dealType, t)} ${getCityName(prop.cityData, prop.city)}`,
    price: parseInt(prop.totalPrice) || 0,
    address: getLocationString(prop),
    bedrooms: parseInt(prop.bedrooms || '1'),
    bathrooms: parseInt(prop.bathrooms || '1'),
    area: parseInt(prop.area) || 0,
    image: propertyImage,
    type: prop.propertyType
  };

  return (
    <CarouselItem key={similarProperty.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
      <Link to={getLanguageUrl(`property/${similarProperty.id}`, i18n.language)}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-300 h-full">
          <div className="relative h-48">
            <img
              src={similarProperty.image}
              alt={similarProperty.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <FavoriteButton
                propertyId={similarProperty.id}
                className="bg-white/80 rounded-full"
              />
            </div>
          </div>
          <CardContent className="p-3 md:p-4">
            <h3 className="font-bold text-sm md:text-base truncate mb-1">{similarProperty.title}</h3>
            <div className="flex items-center text-muted-foreground text-xs md:text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{similarProperty.address}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
              <div className="flex items-center">
                <Bed className="h-3 w-3 mr-1" />
                {similarProperty.bedrooms}
              </div>
              <div className="flex items-center">
                <Bath className="h-3 w-3 mr-1" />
                {similarProperty.bathrooms}
              </div>
              <div className="flex items-center">
                <Square className="h-3 w-3 mr-1" />
                {similarProperty.area} {t('squareMeters')}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-primary text-sm md:text-base">
                {formatPrice(similarProperty.price)}
              </div>
              <Badge variant="secondary" className="text-xs">{translatePropertyType(similarProperty.type, t)}</Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </CarouselItem>
  );
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [propertyImages, setPropertyImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const { t, i18n } = useTranslation('propertyDetail');

  // Minimum swipe distance (in px) to trigger a slide change
  const minSwipeDistance = 50;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  // Get total image count for keyboard navigation
  const getTotalImages = () => {
    if (propertyImages.length > 0) return propertyImages.length;
    if (property?.photos.length > 0) return property.photos.length;
    return 1; // Default placeholder image
  };

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!property) return;

      const totalImages = getTotalImages();
      if (totalImages <= 1) return;

      if (event.key === 'ArrowLeft') {
        setCurrentImageIndex(prev =>
          prev === 0 ? totalImages - 1 : prev - 1
        );
      } else if (event.key === 'ArrowRight') {
        setCurrentImageIndex(prev =>
          prev === totalImages - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property, propertyImages]);

  // Touch/Swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const totalImages = getTotalImages();

    if (isLeftSwipe && totalImages > 1) {
      // Swipe left - go to next image
      setCurrentImageIndex(prev =>
        prev === totalImages - 1 ? 0 : prev + 1
      );
    }

    if (isRightSwipe && totalImages > 1) {
      // Swipe right - go to previous image
      setCurrentImageIndex(prev =>
        prev === 0 ? totalImages - 1 : prev - 1
      );
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  const fetchProperty = async () => {
    if (!id) {
      setError(t('errors.propertyIdRequired'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch the specific property
      const propertyData = await propertyApi.getPropertyById(id);
      setProperty(propertyData);

      // Fetch property images from Universal Image system
      try {
        const imagesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/property/${id}/images`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setPropertyImages(imagesData.images || []);
        }
      } catch (imageError) {
        console.warn('Failed to load property images:', imageError);
        setPropertyImages([]);
      }

      // Fetch similar properties with rate limiting handling - delay this call
      setTimeout(async () => {
        try {
          const allProperties = await propertyApi.getProperties({});
          
          if (!allProperties || !allProperties.properties) {
            console.error('Invalid API response structure:', allProperties);
            setSimilarProperties([]);
            return;
          }
          
          // First try exact property type match
          let similar = allProperties.properties.filter((prop: any) =>
            prop.propertyType === propertyData.propertyType &&
            prop.id !== propertyData.id
          );
          
          // If no exact matches, try broader criteria
          if (similar.length === 0) {
            // Try same city and dealType
            similar = allProperties.properties.filter((prop: any) =>
              prop.city === propertyData.city &&
              prop.dealType === propertyData.dealType &&
              prop.id !== propertyData.id
            );
            
            // If still no matches, try just same city
            if (similar.length === 0) {
              similar = allProperties.properties.filter((prop: any) =>
                prop.city === propertyData.city &&
                prop.id !== propertyData.id
              );
            }
            
            // Last resort: any properties except current
            if (similar.length === 0) {
              similar = allProperties.properties.filter((prop: any) =>
                prop.id !== propertyData.id
              );
            }
          }
          
          const final = similar.slice(0, 9);
          setSimilarProperties(final);
        } catch (error: any) {
          // Handle rate limiting specifically
          if (error.response?.status === 429) {
            const retryAfter = error.response?.data?.retryAfter || 2000;
            console.warn(`Rate limited, retrying similar properties after ${retryAfter}ms`);
            setTimeout(async () => {
              try {
                const allProperties = await propertyApi.getProperties({});
                if (!allProperties || !allProperties.properties) {
                  console.error('Invalid API response structure (retry):', allProperties);
                  setSimilarProperties([]);
                  return;
                }
                
                // Apply same logic as above
                let similar = allProperties.properties.filter((prop: any) =>
                  prop.propertyType === propertyData.propertyType &&
                  prop.id !== propertyData.id
                );
                
                if (similar.length === 0) {
                  similar = allProperties.properties.filter((prop: any) =>
                    prop.city === propertyData.city &&
                    prop.dealType === propertyData.dealType &&
                    prop.id !== propertyData.id
                  );
                }
                
                if (similar.length === 0) {
                  similar = allProperties.properties.filter((prop: any) =>
                    prop.city === propertyData.city &&
                    prop.id !== propertyData.id
                  );
                }
                
                if (similar.length === 0) {
                  similar = allProperties.properties.filter((prop: any) =>
                    prop.id !== propertyData.id
                  );
                }
                
                const final = similar.slice(0, 9);
                setSimilarProperties(final);
              } catch (retryError) {
                console.warn('Failed to load similar properties after retry:', retryError);
                setSimilarProperties([]);
              }
            }, Math.min(retryAfter, 5000)); // Cap at 5 seconds max
          } else {
            console.warn('Failed to load similar properties:', error);
            setSimilarProperties([]);
          }
        }
      }, 1000); // Delay initial similar properties call by 1 second

    } catch (error: any) {
      console.error('Error fetching property:', error);
      setError(t('errors.propertyNotFound'));
      toast({
        title: t('errors.title'),
        description: t('errors.loadingFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0,
    }).format(numPrice || 0);
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = property?.title || 'Property on HomeVend';
    const shareText = `${shareTitle} - ${formatPrice(property?.totalPrice || 0)}`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: t('share.successTitle'),
          description: t('share.successDescription'),
        });
      } catch (error: any) {
        // User cancelled the share dialog or share failed
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          // Fallback to clipboard
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback to clipboard for browsers that don't support Web Share API
      copyToClipboard(shareUrl);
    }
  };

  // Fallback clipboard copy function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('share.successTitle'),
        description: t('share.successDescription'),
      });
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      toast({
        title: t('share.errorTitle'),
        description: t('share.errorDescription'),
        variant: "destructive",
      });
    }
  };


  const getContactTitle = (userRole?: string) => {
    switch (userRole) {
      case 'agency':
        return t('contact.contactAgent');
      case 'developer':
        return t('contact.contactDeveloper');
      default:
        return t('contact.contact');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 md:pt-32">
          {/* Top Ad Banner Skeleton */}
          <div className="container mx-auto px-4 pt-4">
            <div className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>

          {/* Main Property Detail Skeleton */}
          <PropertyDetailSkeleton />

          {/* Similar Properties Skeleton */}
          <SimilarPropertiesSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{t('propertyNotFound')}</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform property data for display
  
  // Helper function to get city name based on language
  const getCityName = (cityData?: Property['cityData'], cityFallback?: string) => {
    if (cityData) {
      if (i18n.language === 'en' && cityData.nameEnglish) {
        return cityData.nameEnglish;
      } else if (i18n.language === 'ru' && cityData.nameRussian) {
        return cityData.nameRussian;
      }
      return cityData.nameGeorgian;
    }
    return cityFallback || '';
  };

  // Helper function to get area name based on language
  const getAreaName = (areaData?: Property['areaData'], districtFallback?: string) => {
    if (areaData) {
      if (i18n.language === 'en' && areaData.nameEn) {
        return areaData.nameEn;
      } else if (i18n.language === 'ru' && areaData.nameRu) {
        return areaData.nameRu;
      }
      return areaData.nameKa;
    }
    return districtFallback || '';
  };

  // Build location string with district if available
  const getLocationString = (property: Property) => {
    let location = property.street;
    
    // Add street number if available
    if (property.streetNumber) {
      location += ` ${property.streetNumber}`;
    }
    
    // Add district/area if available
    const areaName = getAreaName(property.areaData, property.district);
    if (areaName) {
      location += `, ${areaName}`;
    }
    
    // Add city
    const cityName = getCityName(property.cityData, property.city);
    if (cityName) {
      location += `, ${cityName}`;
    }
    
    return location;
  };
  
  // Create image URLs from Universal Image system
  const getImageUrls = () => {
    if (propertyImages.length > 0) {
      // Sort by isPrimary first, then by sortOrder
      const sortedImages = [...propertyImages].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.sortOrder - b.sortOrder;
      });
      
      // Use large size for display, fallback to medium, then original
      return sortedImages.map(img => 
        img.urls?.large || img.urls?.medium || img.urls?.original
      ).filter(Boolean);
    }
    
    // Fallback to property.photos if no Universal Images, then placeholder
    if (property.photos.length > 0) {
      return property.photos;
    }
    
    return ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"];
  };

  const displayProperty = {
    id: property.id,
    title: property.title || `${property.propertyType} ${property.dealType} ${property.city}`,
    price: parseInt(property.totalPrice) || 0,
    address: getLocationString(property),
    bedrooms: parseInt(property.bedrooms || '1'),
    bathrooms: parseInt(property.bathrooms || '1'),
    area: parseInt(property.area) || 0,
    type: property.propertyType,
    images: getImageUrls(),
    description: property.descriptionGeorgian || property.descriptionEnglish || t('noDescription'),
    features: property.features,
    advantages: property.advantages,
    furnitureAppliances: property.furnitureAppliances,
    tags: property.tags,
    agent: {
      name: property.user.fullName,
      phone: property.contactPhone,
      email: property.user.email
    },
    dateAdded: property.createdAt,
    status: property.status,
    viewCount: property.viewCount
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 md:pt-32 relative">

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 pt-4">
          <AdBanner type="horizontal" placementId="7" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col xl:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="flex-1 xl:w-2/3">
              {/* Property Images Slider */}
              <div className="mb-4 md:mb-6">
                {/* Main Image Display */}
                <div
                  className="relative mb-4"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <img
                    src={displayProperty.images[currentImageIndex]}
                    alt={`${displayProperty.title} ${currentImageIndex + 1}`}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity select-none"
                    onClick={() => setIsLightboxOpen(true)}
                    draggable={false}
                  />
                  
                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {displayProperty.images.length}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {displayProperty.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === 0 
                            ? displayProperty.images.length - 1 
                            : currentImageIndex - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === displayProperty.images.length - 1 
                            ? 0 
                            : currentImageIndex + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {displayProperty.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {displayProperty.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0 border-2 ${
                          index === currentImageIndex
                            ? 'border-primary opacity-100 ring-2 ring-primary/30'
                            : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsLightboxOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Dots Indicator for Mobile */}
                {displayProperty.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {displayProperty.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-primary w-4' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <Card className="mb-4 md:mb-6">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{displayProperty.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {displayProperty.address}
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{translatePropertyType(displayProperty.type, t)}</Badge>
                        {property.dailyRentalSubcategory && (
                          <Badge variant="outline">{property.dailyRentalSubcategory}</Badge>
                        )}
                        {(() => {
                          // Check if property has active VIP status
                          const isVipActive = property.vipStatus && property.vipStatus !== 'none' && 
                            property.vipExpiresAt && new Date(property.vipExpiresAt) > new Date();
                          
                          if (!isVipActive) return null;
                          
                          const vipColors = {
                            vip: 'bg-blue-100 text-blue-800 border-blue-300',
                            vip_plus: 'bg-purple-100 text-purple-800 border-purple-300',
                            super_vip: 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          };
                          
                          const vipLabels = {
                            vip: t('vipStatus.vip'),
                            vip_plus: t('vipStatus.vip_plus'),
                            super_vip: t('vipStatus.super_vip')
                          };
                          
                          const vipType = property.vipStatus!;
                          const colorClass = vipColors[vipType as keyof typeof vipColors];
                          const label = vipLabels[vipType as keyof typeof vipLabels];
                          
                          return (
                            <Badge className={colorClass}>
                              <Crown className="h-3 w-3 mr-1" />
                              {label}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <FavoriteButton
                        propertyId={property.id}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="h-8 w-8 p-0"
                        aria-label={t('share.buttonLabel')}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {formatPrice(displayProperty.price)}
                  </div>
                  {property.pricePerSqm && (
                    <div className="text-lg font-semibold text-muted-foreground mb-6">
                      {formatPrice(property.pricePerSqm)}/{t('perSquareMeter')}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Bed className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.bedrooms}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">{t('bedrooms')}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Bath className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.bathrooms}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">{t('bathrooms')}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Square className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.area}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">{t('squareMeters')}</span>
                    </div>
                  </div>

                  {/* Required Fields Section */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                        <Info className="h-4 w-4 text-foreground" />
                        {t('sections.mainInformation')}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2 bg-primary">
                              <Hash className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.listingTitle')}</span>
                              <p className="font-semibold text-sm leading-tight break-words text-foreground">{property.title}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2 bg-primary">
                              <Building className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.propertyType')}</span>
                              <p className="font-semibold text-sm text-foreground">{translatePropertyType(property.propertyType, t)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2 bg-primary">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.dealType')}</span>
                              <p className="font-semibold text-sm text-foreground">{translateDealType(property.dealType, t)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2 bg-primary">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.location')}</span>
                              <p className="font-semibold text-sm leading-tight break-words text-foreground">{displayProperty.address}</p>
                            </div>
                          </div>
                        </div>


                        {property.cadastralCode && (
                          <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-foreground">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Hash className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.cadastralCode')}</span>
                                <p className="font-semibold text-sm font-mono tracking-wider break-all text-foreground">{property.cadastralCode}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Property Structure */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                        <Home className="h-4 w-4 text-foreground" />
                        {t('sections.propertyStructure')}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.rooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Home className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.rooms')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.rooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Bed className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.bedrooms')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.bedrooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Bath className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.bathrooms')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.bathrooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.totalFloors && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Layers className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.totalFloors')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.totalFloors}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.propertyFloor && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Layers className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.propertyFloor')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.propertyFloor}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2 bg-primary">
                              <Square className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.usableArea')}</span>
                              <p className="font-semibold text-sm text-foreground">{property.area} {t('squareMeters')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Building Information */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                        <Building className="h-4 w-4 text-foreground" />
                        {t('sections.buildingInformation')}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.buildingStatus && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Settings className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.status')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateBuildingStatus(property.buildingStatus, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.constructionYear && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <CalendarIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.constructionYear')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateConstructionYear(property.constructionYear, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.condition && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Wrench className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.condition')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateCondition(property.condition, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.projectType && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Building className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.projectType')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateProjectType(property.projectType, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.ceilingHeight && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Ruler className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.ceilingHeight')}</span>
                                <p className="font-semibold text-sm text-foreground">{property.ceilingHeight} {t('meters')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.buildingMaterial && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Hammer className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.buildingMaterial')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateBuildingMaterial(property.buildingMaterial, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                        <Settings className="h-4 w-4 text-foreground" />
                        {t('sections.infrastructure')}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.heating && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Thermometer className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.heating')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateHeating(property.heating, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.parking && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Car className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.parking')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateParking(property.parking, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.hotWater && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2 bg-primary">
                                <Droplets className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.hotWater')}</span>
                                <p className="font-semibold text-sm text-foreground">{translateHotWater(property.hotWater, t)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Special Spaces */}
                  {(property.hasBalcony || property.hasPool || property.hasLivingRoom || property.hasLoggia || property.hasVeranda || property.hasYard || property.hasStorage) && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                          <Home className="h-4 w-4 text-foreground" />
                          {t('sections.additionalSpaces')}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          {property.hasBalcony && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Home className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.balcony')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {(property.balconyCount || property.balconyArea) && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">
                                      {property.balconyCount && `${property.balconyCount}${t('count')}`}
                                      {property.balconyCount && property.balconyArea && ' • '}
                                      {property.balconyArea && `${property.balconyArea}${t('squareMeters')}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasPool && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Droplets className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.pool')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.poolType && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">{translatePoolType(property.poolType, t)}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasLivingRoom && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Sofa className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.livingRoom')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.livingRoomArea && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">
                                      {property.livingRoomArea}{t('squareMeters')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasLoggia && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.loggia')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.loggiaArea && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">{property.loggiaArea}{t('squareMeters')}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasVeranda && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Home className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.veranda')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.verandaArea && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">{property.verandaArea}{t('squareMeters')}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasYard && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.hasYard')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.yardArea && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">{property.yardArea}{t('squareMeters')}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasStorage && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2 bg-primary">
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70 text-foreground">{t('fields.storage')}</span>
                                  <p className="font-semibold text-sm text-foreground">{t('yes')}</p>
                                  {property.storageArea && (
                                    <p className="text-xs mt-1 opacity-60 text-foreground">
                                      {property.storageArea}{t('squareMeters')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}



                  {/* Features Section */}
                  {displayProperty.features && displayProperty.features.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                          <Star className="h-4 w-4 text-foreground" />
                          {t('sections.features')}
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.features.map((feature, index) => (
                            <div key={`feature-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium text-foreground">
                                {translateFeature(feature, t)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Advantages Section */}
                  {displayProperty.advantages && displayProperty.advantages.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                          <Trophy className="h-4 w-4 text-foreground" />
                          {t('sections.advantages')}
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.advantages.map((advantage, index) => (
                            <div key={`advantage-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium text-foreground">
                                {translateAdvantage(advantage, t)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Furniture & Appliances Section */}
                  {displayProperty.furnitureAppliances && displayProperty.furnitureAppliances.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                          <Sofa className="h-4 w-4 text-foreground" />
                          {t('sections.furnitureAppliances')}
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.furnitureAppliances.map((item, index) => (
                            <div key={`furniture-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium text-foreground">
                                {translateFurnitureAppliance(item, t)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags Section */}
                  {displayProperty.tags && displayProperty.tags.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                          <Tag className="h-4 w-4 text-foreground" />
                          {t('sections.tags')}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {displayProperty.tags.map((tag, index) => (
                            <Badge key={`tag-${index}`} className="text-white px-3 py-1 text-sm font-semibold hover:opacity-90 transition-opacity bg-foreground">
                              #{translateTag(tag, t)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description Section - Moved to end */}
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">{t('sections.description')}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {displayProperty.description}
                    </p>
                  </div>

                </CardContent>
              </Card>

              {/* Ad Banner */}
              <AdBanner type="horizontal" placementId="8" />
            </div>

            {/* Sidebar */}
            <div className="xl:w-1/3">
              <div className="sticky space-y-4 md:space-y-6" style={{top:"8rem"}}>
              {/* Developer/Agent Info */}
              <Card className="overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4 text-white">
                  <h3 className="text-lg md:text-xl font-bold text-center">{getContactTitle(property.user.role)}</h3>
                </div>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mr-3 md:mr-4 shadow-md ring-2 md:ring-4 ring-white">
                      <span className="text-white text-xl md:text-2xl font-bold">
                        {displayProperty.agent.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link 
                        to={getLanguageUrl(`user/${property.user.id}`, i18n.language)}
                        className="font-bold text-base md:text-lg hover:text-primary transition-colors cursor-pointer block truncate"
                      >
                        {displayProperty.agent.name}
                      </Link>
                      <p className="text-xs md:text-sm text-gray-500">
                        {property.user.role === 'agency' ? t('userRoles.agent') : 
                         property.user.role === 'developer' ? t('userRoles.developer') : 
                         t('userRoles.user')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project info if linked */}
                  {property.project && (
                    <div className="mb-4 md:mb-6 bg-blue-50 rounded-lg p-3 md:p-4 hover:bg-blue-100 transition-colors border border-blue-200">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="text-white rounded-lg p-1.5 md:p-2 bg-blue-600">
                          <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium block mb-1 text-blue-800">{t('linkedProject')}</span>
                          <Link 
                            to={getLanguageUrl(`projects/${property.project.id}`, i18n.language)}
                            className="font-semibold text-xs md:text-sm leading-tight break-words text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                          >
                            {property.project.projectName}
                          </Link>
                          <p className="text-xs text-blue-700 mt-1">
                            {getCityName(property.project.city as any, property.project.city.nameGeorgian)}, {getAreaName(property.areaData, property.district)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 md:space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-3 md:py-5 font-medium text-sm md:text-base" variant="default">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      <span className="truncate">{displayProperty.agent.phone}</span>
                    </Button>
                    <Button className="w-full border-border text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 py-3 md:py-5 font-medium text-sm md:text-base" variant="outline">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      {t('email')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Banner Vertical */}
              <AdBanner type="vertical" placementId="9" />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Carousel Section */}
        {similarProperties.length > 0 && (
          <div className="container mx-auto px-4 py-6 md:py-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{t('similarProperties')}</h2>
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: similarProperties.length > 3,
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {similarProperties.map((prop) => (
                    <SimilarPropertyCard
                      key={prop.id}
                      prop={prop}
                      t={t}
                      i18n={i18n}
                      formatPrice={formatPrice}
                    />
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6" />
                <CarouselNext className="hidden sm:flex -right-4 lg:-right-6" />
              </Carousel>
              
              {/* Mobile navigation dots */}
              <div className="flex sm:hidden justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(similarProperties.length / 1) }).slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={displayProperty.images}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setCurrentImageIndex}
        title={displayProperty.title}
      />
    </div>
  );
};

export default PropertyDetail;
