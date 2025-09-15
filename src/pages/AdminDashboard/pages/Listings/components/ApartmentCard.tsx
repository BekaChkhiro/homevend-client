import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar, User, Home } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useState, useEffect } from "react";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  street: string;
  fullAddress?: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  viewCount: number;
  createdAt: string;
  photos: string[];
  contactName: string;
  contactPhone: string;
  owner?: {
    id: number;
    fullName: string;
    email: string;
  };
  isOwnProperty?: boolean;
}

interface ApartmentCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
}

export const ApartmentCard = ({ property, onDelete }: ApartmentCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('admin');
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  
  if (!property) {
    return null;
  }

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const response = await fetch(`/api/upload/property/${property.id}/images`);
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
  }, [property.id]);

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const getMainImage = () => {
    if (propertyImages.length > 0) {
      return propertyImages[0];
    }
    return null;
  };

  const getLocationString = () => {
    if (!property) return t('apartmentCard.labels.locationNotSpecified');
    
    // Use fullAddress if available (already translated)
    if (property.fullAddress) {
      return property.fullAddress;
    }
    
    // Fallback to constructing address from parts
    const parts = [];
    const lang = i18n.language;
    
    // Get area/district name based on current language
    if (property.areaData) {
      let areaName;
      switch (lang) {
        case 'ka':
          areaName = property.areaData.nameKa || property.areaData.nameEn || property.areaData.nameRu;
          break;
        case 'ru':
          areaName = property.areaData.nameRu || property.areaData.nameEn || property.areaData.nameKa;
          break;
        case 'en':
        default:
          areaName = property.areaData.nameEn || property.areaData.nameKa || property.areaData.nameRu;
          break;
      }
      if (areaName) parts.push(areaName);
    } else if (property.district) {
      parts.push(property.district);
    }
    
    // Get city name based on current language
    if (property.cityData) {
      let cityName;
      switch (lang) {
        case 'ka':
          cityName = property.cityData.nameGeorgian || property.cityData.nameEnglish;
          break;
        case 'ru':
          cityName = property.cityData.nameRu || property.cityData.nameEnglish || property.cityData.nameGeorgian;
          break;
        case 'en':
        default:
          cityName = property.cityData.nameEnglish || property.cityData.nameGeorgian;
          break;
      }
      if (cityName) parts.push(cityName);
    } else if (property.city) {
      parts.push(property.city);
    }
    
    return parts.length > 0 ? parts.join(', ') : t('apartmentCard.labels.locationNotSpecified');
  };

  const handleDelete = () => {
    onDelete(property.id);
  };

  const handleView = () => {
    navigate(getLanguageUrl(`property/${property.id}`, i18n.language));
  };

  const handleEdit = () => {
    navigate(getLanguageUrl(`admin/edit-property/${property.id}`, i18n.language));
  };

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">
          {/* Image */}
          <div className="relative flex-shrink-0">
            {getMainImage() ? (
              <img 
                src={getMainImage()!} 
                alt={property.title || `${property.propertyType} ${property.city}-ში`}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div class="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg truncate pr-4">
                {property.title || `${property.propertyType} ${property.city}-ში`}
              </h3>
              <span className="text-lg font-bold text-primary whitespace-nowrap">
                {formatPrice(property.totalPrice)} ₾
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">
                {getLocationString()}
              </span>
            </div>

            {/* Show owner info if property belongs to an agent */}
            {property.owner && !property.isOwnProperty && (
              <div className="flex items-center text-gray-600 mb-2">
                <User className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">
                  {t('apartmentCard.labels.agent')} {property.owner.fullName}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area} {t('apartmentCard.labels.squareMeters')}</span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {t(`listings.propertyTypes.${property.propertyType}`, { defaultValue: property.propertyType })}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {t(`listings.dealTypes.${property.dealType}`, { defaultValue: property.dealType })}
              </Badge>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{property.viewCount} {t('apartmentCard.labels.views')}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(property.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            {/* View button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={handleView}
              title={t('apartmentCard.buttons.view')}
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('apartmentCard.buttons.view')}</span>
            </Button>
            
            {/* Edit button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={handleEdit}
              title={t('apartmentCard.buttons.edit')}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('apartmentCard.buttons.edit')}</span>
            </Button>
            
            {/* Delete button with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title={t('apartmentCard.buttons.delete')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">{t('apartmentCard.buttons.delete')}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('apartmentCard.deleteDialog.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('apartmentCard.deleteDialog.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('apartmentCard.deleteDialog.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    {t('apartmentCard.deleteDialog.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};