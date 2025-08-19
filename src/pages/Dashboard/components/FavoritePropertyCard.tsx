import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Phone, MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    navigate(`/property/${id}`);
  };

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">

          {/* Image - Reduced size */}

          {/* Image */}

          <div className="relative flex-shrink-0">
            <img 
              src={image} 
              alt={title}

              className="w-20 h-20 object-cover rounded-lg"

            />
            {featured && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5">
                  რჩეული
                </Badge>
              </div>
            )}
          </div>

          {/* Content - Reduced spacing */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">

              <h3 className="font-semibold text-lg truncate pr-4">{title}</h3>
              <span className="text-lg font-bold text-primary whitespace-nowrap">

                {price.toLocaleString()} ₾
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{address}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />

                <span>{area} მ²</span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {type}
              </Badge>

              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {transactionType}
              </Badge>
            </div>

            {/* Date Info - Simplified */}
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>დამატებული: {addedDate}</span>
            </div>
          </div>

          {/* Actions - Reduced size */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewProperty}
                className="flex items-center text-xs px-2 py-1 h-7"
              >
                <Eye className="h-3 w-3 mr-1" />
                ნახვა
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleContactOwner}
                className="flex items-center text-xs px-2 py-1 h-7"
              >
                <Phone className="h-3 w-3 mr-1" />
                დარეკვა
              </Button>
            </div>

            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-7"
              onClick={handleRemoveFromFavorites}
            >
              <Heart className="h-3 w-3 mr-1 fill-current" />
              ამოშლა
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};