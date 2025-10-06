
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Crown, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
interface Property {
  id: number;
  title: string;
  price: number;
  totalPrice?: string;
  pricePerSqm?: number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  area: string | number;
  type?: string;
  address?: string;
  agentName?: string;
  photos?: string[];
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
  colorSeparationEnabled?: boolean;
  colorSeparationExpiresAt?: string;
  city?: string;
  cityData?: {
    nameGeorgian: string;
    nameEnglish?: string;
    nameRussian?: string;
    nameKa?: string;
    nameEn?: string;
    nameRu?: string;
    name?: string;
  };
  areaData?: {
    nameKa: string;
    nameEn: string;
    nameRu?: string;
    name?: string;
  };
  district?: string;
}
import { Link } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useState, useEffect } from "react";

interface PropertyCardProps {
  property: Property;
}

const VIP_BG_COLORS = {
  vip: 'bg-blue-500 text-white border-blue-600',
  vip_plus: 'bg-purple-500 text-white border-purple-600', 
  super_vip: 'bg-yellow-500 text-black border-yellow-600'
};

// VIP labels are now handled with translations inside the component

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { t, i18n } = useTranslation('propertyCard');
  
  const formatPrice = (price: number) => {
    // Use appropriate locale for number formatting based on current language
    let locale = 'ka-GE';
    switch (i18n.language) {
      case 'ka':
        locale = 'ka-GE';
        break;
      case 'en':
        locale = 'en-US';
        break;
      case 'ru':
        locale = 'ru-RU';
        break;
      default:
        locale = 'ka-GE';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isVipActive = () => {
    if (!property.vipStatus || property.vipStatus === 'none') return false;
    if (!property.vipExpiresAt) return false;
    return new Date(property.vipExpiresAt) > new Date();
  };

  const getVipInfo = () => {
    if (!isVipActive()) return null;
    const vipType = property.vipStatus!;
    const colorClass = VIP_BG_COLORS[vipType as keyof typeof VIP_BG_COLORS];
    
    // Use translations for VIP labels
    let label = '';
    switch (vipType) {
      case 'vip':
        label = t('propertyCard.vip');
        break;
      case 'vip_plus':
        label = t('propertyCard.vipPlus');
        break;
      case 'super_vip':
        label = t('propertyCard.superVip');
        break;
      default:
        label = 'VIP';
    }
    
    return { colorClass, label };
  };

  const isColorSeparationActive = () => {
    if (!property.colorSeparationEnabled) return false;
    if (!property.colorSeparationExpiresAt) return property.colorSeparationEnabled; // No expiry means always active if enabled
    return new Date(property.colorSeparationExpiresAt) > new Date();
  };

  const getColorSeparationStyle = () => {
    if (!isColorSeparationActive()) return {};
    
    const colorCode = 'hsl(var(--primary))'; // Use primary color from CSS variables
    return {
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: colorCode,
      boxShadow: `0 0 15px hsl(var(--primary) / 0.3), 0 0 5px hsl(var(--primary) / 0.2)`,
      background: `linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, transparent 100%)`
    };
  };

  // Get city name for badge - language aware
  const getCityName = () => {
    if (property.cityData) {
      // Use appropriate language name based on current language
      switch (i18n.language) {
        case 'ka':
          return property.cityData.nameGeorgian || property.cityData['nameKa'];
        case 'en':
          return property.cityData['nameEnglish'] || property.cityData['nameEn'] || property.cityData.nameGeorgian;
        case 'ru':
          return property.cityData['nameRussian'] || property.cityData['nameRu'] || property.cityData.nameGeorgian;
        default:
          return property.cityData.nameGeorgian;
      }
    } else if (property.city) {
      return property.city;
    }
    return null;
  };

  // Build the location string with district and street (without city) - language aware
  // Order: District → Street → Street Number
  const getDistrictAndStreet = () => {
    const parts = [];
    
    // 1. Add district/area first - language aware
    if (property.areaData) {
      let areaName = '';
      switch (i18n.language) {
        case 'ka':
          areaName = property.areaData['nameKa'] || property.areaData['nameGeorgian'] || property.areaData['name'];
          break;
        case 'en':
          areaName = property.areaData['nameEn'] || property.areaData['nameEnglish'] || property.areaData['nameKa'] || property.areaData['name'];
          break;
        case 'ru':
          areaName = property.areaData['nameRu'] || property.areaData['nameRussian'] || property.areaData['nameKa'] || property.areaData['name'];
          break;
        default:
          areaName = property.areaData['nameKa'] || property.areaData['name'];
      }
      if (areaName) parts.push(areaName);
    } else if (property.district) {
      parts.push(property.district);
    }
    
    // 2. Add street and street number from address
    if (property.address && property.address !== t('propertyCard.locationNotSpecified')) {
      // Try to extract street part (first part before comma)
      const addressParts = property.address.split(', ');
      if (addressParts.length > 0) {
        const streetPart = addressParts[0];
        // Only add if it's not already district/area name
        if (!parts.some(part => streetPart.includes(part))) {
          // Split street part to separate street name and number
          const streetMatch = streetPart.match(/^(.+?)(\d+.*)$/);
          if (streetMatch) {
            // Street name and number found
            const streetName = streetMatch[1].trim();
            const streetNumber = streetMatch[2].trim();
            if (streetName) parts.push(streetName);
            if (streetNumber) parts.push(streetNumber);
          } else {
            // No number found, just add the street part
            parts.push(streetPart);
          }
        }
      }
    }
    
    return parts.length > 0 ? parts.join(', ') : t('propertyCard.locationNotSpecified');
  };

  const [imageError, setImageError] = useState(false);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(true);
  
  // Fetch property images when component mounts
  useEffect(() => {
    const fetchPropertyImages = async () => {
      setImagesLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/property/${property.id}/images`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            // Map the image URLs to get the large version if available, otherwise use the original
            const imageUrls = data.images.map((img: any) =>
              img.urls?.large || img.urls?.medium || img.urls?.original
            ).filter(Boolean);
            setPropertyImages(imageUrls);
          }
        }
      } catch (error) {
        console.warn('Failed to load property images:', error);
        // Fall back to the property.photos if available
        if (property.photos && property.photos.length > 0) {
          setPropertyImages(property.photos);
        }
      } finally {
        setImagesLoading(false);
      }
    };

    fetchPropertyImages();
  }, [property.id, property.photos]);

  // Get all available images or use a placeholder
  const getImageUrls = () => {
    if (propertyImages.length > 0) {
      return propertyImages;
    }
    if (property.photos && property.photos.length > 0) {
      return property.photos;
    }
    return ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'];
  };

  const images = getImageUrls();
  const hasMultipleImages = images.length > 1;

  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagesLoading) return false;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    return false;
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagesLoading) return false;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    return false;
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagesLoading) return false;
    setCurrentImageIndex(index);
    return false;
  };

  return (
    <Link
      to={getLanguageUrl(`/property/${property.id}`)}
      className="block h-full transition-all hover:shadow-lg rounded-lg group"
      style={getColorSeparationStyle()}
    >
      <Card className="h-full flex flex-col border border-border shadow-md overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Property Image Carousel */}
          <div className="relative h-48 bg-muted overflow-hidden">
            {images.length > 0 ? (
              <div className="relative w-full h-full">
                {/* Main Image */}
                <img 
                  src={images[currentImageIndex]}
                  alt={`${property.title || 'Property image'} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
                
                {/* Navigation Arrows */}
                {hasMultipleImages && !imagesLoading && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full p-1.5 shadow-md z-10 transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full p-1.5 shadow-md z-10 transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {hasMultipleImages && !imagesLoading && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Image Dots */}
                {hasMultipleImages && images.length > 1 && !imagesLoading && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(e, index)}
                        className={`h-1.5 rounded-full transition-all ${currentImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Loading Indicator */}
                {imagesLoading && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Home className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* VIP Badge */}
            {getVipInfo() && (
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold ${getVipInfo().colorClass} z-10`}>
                {getVipInfo().label}
              </div>
            )}
            
            {/* Favorite Button */}
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton propertyId={property.id} size="sm" variant="ghost" className="bg-white/90 hover:bg-white" />
            </div>
          </div>

          <CardContent className="p-2 sm:p-3">
            {/* Price and City Section */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-primary font-bold text-lg">{formatPrice(property.price)}</div>
                {getCityName() && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {getCityName()}
                  </Badge>
                )}
              </div>
              {property.pricePerSqm && (
                <div className="text-muted-foreground text-xs">
                  {property.pricePerSqm.toLocaleString()} {t('propertyCard.perSqm')}
                </div>
              )}
            </div>

            <div className="mb-1 sm:mb-2">
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors h-8 sm:h-10 flex items-start">
                <span className="line-clamp-2">
                  {property.title || t('propertyCard.titleNotSpecified')}
                </span>
              </h3>
              <div className="flex items-start text-muted-foreground text-xs sm:text-sm mt-0.5">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 mt-0.5 text-primary" />
                <span className="line-clamp-2">{getDistrictAndStreet()}</span>
              </div>
              {property.agentName && (
                <div className="text-xs text-muted-foreground mt-1">
                  {t('propertyCard.agent')} {property.agentName}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center space-x-0.5">
                <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>{property.bedrooms || '0'}</span>
              </div>
              <div className="flex items-center space-x-0.5">
                <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>{property.bathrooms || '0'}</span>
              </div>
              <div className="flex items-center space-x-0.5">
                <Square className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>{property.area} {t('propertyCard.sqMeter')}</span>
              </div>
            </div>
          </CardContent>
        </CardContent>
      </Card>
    </Link>
  );
};
