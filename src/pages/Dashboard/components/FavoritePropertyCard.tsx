import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Phone, MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface FavoritePropertyCardProps {
  id: number;
  title: string;
  price: number;
  address: string;
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
  const { t, i18n } = useTranslation('userDashboard');

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
            <img 
              src={image} 
              alt={title}
              className="w-16 h-16 object-cover rounded-lg"
            />
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
              <span className="text-xs truncate">{address}</span>
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
            {t('propertyCard.contact') || 'დარეკვა'}
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