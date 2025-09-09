
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Crown } from "lucide-react";
import type { Property } from "@/pages/Index";
import { Link } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

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

  return (
    <Link to={getLanguageUrl(`property/${property.id}`, i18n.language)} className="block w-full min-w-0 max-w-full">

      <Card 
        className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full min-w-0 max-w-full"
        style={getColorSeparationStyle()}
      >

        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {(() => {
            const vipInfo = getVipInfo();
            if (!vipInfo) return null;
            const { colorClass, label } = vipInfo;
            return (
              <Badge className={`absolute top-3 left-3 ${colorClass} z-10 shadow-lg border-2 font-bold px-2 py-1 text-xs`}>
                <Crown className="h-4 w-4 mr-1" />
                {label}
              </Badge>
            );
          })()}

          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton
              propertyId={property.id}
              className="absolute top-2 right-2 sm:top-3 sm:right-3"
            />
          </div>
          {getCityName() && (
            <Badge className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 text-white text-xs px-2 py-1 backdrop-blur-sm">
              {getCityName()}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-2 sm:p-3">
          <div className="mb-1 sm:mb-2">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors h-8 sm:h-10 flex items-start">
              <span className="line-clamp-2">
                {property.title || t('propertyCard.titleNotSpecified')}
              </span>
            </h3>
            <div className="flex items-start text-muted-foreground text-xs sm:text-sm mt-0.5">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{getDistrictAndStreet()}</span>
            </div>
            {property.agentName && (
              <div className="text-xs text-muted-foreground mt-1">
                {t('propertyCard.agent')} {property.agentName}
              </div>
            )}
          </div>
          
          <div className="mb-1 sm:mb-2">
            {/* Price and type layout - always on same line for cleaner mobile look */}
            <div className="flex items-center justify-between">
              <div className="text-base sm:text-lg font-bold text-primary truncate">
                {formatPrice(property.price)}
              </div>
              <Badge variant="secondary" className="text-[10px] sm:text-xs ml-1 flex-shrink-0">{property.type}</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center space-x-0.5">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <Bath className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{property.area} {t('propertyCard.sqMeter')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
