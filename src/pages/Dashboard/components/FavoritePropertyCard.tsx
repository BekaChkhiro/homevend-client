import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Phone, MapPin, Bed, Bath, Square, Calendar, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useState, useEffect } from "react";

interface FavoritePropertyCardProps {
  id: number;
  title: string;
  price: number;
  address: string;
  city?: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  transactionType: string;
  image: string;
  featured: boolean;
  addedDate: string;
  ownerName: string;
  ownerPhone: string;
  onRemoveFromFavorites?: () => void;
}

export const FavoritePropertyCard = ({ 
  id, 
  title, 
  price, 
  address,
  city,
  district,
  cityData,
  areaData,
  bedrooms, 
  bathrooms, 
  area, 
  type, 
  transactionType, 
  image, 
  featured, 
  addedDate, 
  ownerName, 
  ownerPhone,
  onRemoveFromFavorites
}: FavoritePropertyCardProps) => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['userDashboard', 'propertyCard']);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const response = await fetch(`/api/upload/property/${id}/images`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            const imageUrls = data.images.map((img: any) => 
              img.urls?.medium || img.urls?.original || img.url
            ).filter(Boolean);
            setPropertyImages(imageUrls);
          }
        }
      } catch (error) {
        console.warn('Failed to load property images:', error);
      }
    };

    fetchPropertyImages();
  }, [id]);

  const getDisplayImage = () => {
    if (propertyImages.length > 0) {
      return propertyImages[0];
    }
    if (image) {
      return image;
    }
    return null;
  };

  const getLocationString = () => {
    const parts = [];
    
    // Add district/area if available - use language-specific name
    if (areaData) {
      let areaName;
      switch (i18n.language) {
        case 'ka':
          areaName = areaData.nameKa || areaData.nameEn || areaData.nameRu;
          break;
        case 'ru':
          areaName = areaData.nameRu || areaData.nameEn || areaData.nameKa;
          break;
        case 'en':
        default:
          areaName = areaData.nameEn || areaData.nameKa || areaData.nameRu;
          break;
      }
      if (areaName) parts.push(areaName);
    } else if (district) {
      parts.push(district);
    }
    
    // Add city - use language-specific name with proper fallback
    if (cityData) {
      let cityName;
      switch (i18n.language) {
        case 'ka':
          cityName = cityData.nameGeorgian || cityData.nameEnglish;
          break;
        case 'ru':
          cityName = cityData.nameRussian || cityData.nameEnglish || cityData.nameGeorgian;
          break;
        case 'en':
        default:
          cityName = cityData.nameEnglish || cityData.nameGeorgian;
          break;
      }
      if (cityName) parts.push(cityName);
    } else if (city) {
      parts.push(city);
    }
    
    return parts.length > 0 ? parts.join(', ') : address || t('propertyCard:locationNotSpecified');
  };

  const handleRemoveFromFavorites = () => {
    if (onRemoveFromFavorites) {
      onRemoveFromFavorites();
    }
  };

  const handleContactOwner = () => {
    // Handle contacting property owner
    console.log("Contact owner:", ownerPhone);
  };

  const handleViewProperty = () => {
    navigate(getLanguageUrl(`property/${id}`, i18n.language));
  };

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        {/* First Row - Main Info */}
        <div className="flex items-center gap-3 mb-2">
          {/* Image */}
          <div className="relative flex-shrink-0">
            {getDisplayImage() ? (
              <img 
                src={getDisplayImage()!} 
                alt={title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div class="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      </div>
                    </div>
                    ${featured ? '<div class="absolute -top-1 -right-1"><span class="bg-orange-100 text-orange-800 text-xs px-1 py-0.5 rounded">რჩეული</span></div>' : ''}
                  `;
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {featured && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5">
                  {t('favorites.propertyTypes.featured') || 'რჩეული'}
                </Badge>
              </div>
            )}
          </div>

          {/* Title and Price */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-base truncate pr-2">{title}</h3>
              <span className="text-base font-bold text-primary whitespace-nowrap">
                {price.toLocaleString()} ₾
              </span>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{getLocationString()}</span>
            </div>
          </div>
        </div>

        {/* Second Row - Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-3 w-3 mr-1" />
              <span>{area}{t('common.squareMeters') || 'მ²'}</span>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            <Badge variant="outline" className="text-xs px-2 py-1 h-5 whitespace-nowrap">
              {type}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 h-5 whitespace-nowrap">
              {transactionType}
            </Badge>
          </div>
        </div>

        {/* Third Row - Actions */}
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewProperty}
            className="h-6 px-2 text-xs flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            {t('common.view')}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleContactOwner}
            className="h-6 px-2 text-xs flex-1"
          >
            <Phone className="h-3 w-3 mr-1" />
{t('propertyCard:contact')}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
            onClick={handleRemoveFromFavorites}
          >
            <Heart className="h-3 w-3 mr-1 fill-current" />
            {t('common.remove')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};