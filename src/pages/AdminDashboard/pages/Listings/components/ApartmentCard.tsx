import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

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
  
  if (!property) {
    return null;
  }

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const getMainImage = () => {
    // Using test photo since no uploading functionality exists yet
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop";
  };

  const getLocationString = () => {
    if (!property) return t('apartmentCard.labels.locationNotSpecified');
    
    const parts = [];
    
    if (property.areaData?.nameKa) {
      parts.push(property.areaData.nameKa);
    } else if (property.district) {
      parts.push(property.district);
    }
    
    if (property.cityData?.nameGeorgian) {
      parts.push(property.cityData.nameGeorgian);
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
            <img 
              src={getMainImage()} 
              alt={property.title || `${property.propertyType} ${property.city}-ში`}
              className="w-20 h-20 object-cover rounded-lg"
            />
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