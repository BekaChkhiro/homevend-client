import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Phone, MapPin, Bed, Bath, Square } from "lucide-react";
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
  ownerPhone 
}: FavoritePropertyCardProps) => {
  const navigate = useNavigate();

  const handleRemoveFromFavorites = () => {
    // Handle removing from favorites
    console.log("Remove from favorites:", id);
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
          {/* Image */}
          <div className="relative flex-shrink-0">
            <img 
              src={image} 
              alt={title}
              className="w-20 h-20 object-cover rounded-md"
            />
            {featured && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5">
                  რჩეული
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-base truncate pr-4">
                {title}
              </h3>
              <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
                {price.toLocaleString()} ₾
              </span>
            </div>
            
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {address}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-600">
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
                <span>{area} მ²</span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {type}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleViewProperty}>
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleContactOwner}
            >
              <Phone className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              onClick={handleRemoveFromFavorites}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};