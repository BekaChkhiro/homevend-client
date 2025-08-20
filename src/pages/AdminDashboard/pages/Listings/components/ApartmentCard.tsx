import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

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
    if (!property) return 'მდებარეობა არ არის მითითებული';
    
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
    
    return parts.length > 0 ? parts.join(', ') : 'მდებარეობა არ არის მითითებული';
  };

  const handleDelete = () => {
    onDelete(property.id);
  };

  const handleView = () => {
    navigate(`/property/${property.id}`);
  };

  const handleEdit = () => {
    navigate(`/admin/edit-property/${property.id}`);
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
                  აგენტი: {property.owner.fullName}
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
                <span>{property.area} მ²</span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {property.propertyType}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {property.dealType}
              </Badge>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{property.viewCount} ნახვა</span>
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
              title="ნახვა"
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">ნახვა</span>
            </Button>
            
            {/* Edit button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={handleEdit}
              title="რედაქტირება"
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="text-xs">რედაქტირება</span>
            </Button>
            
            {/* Delete button with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="წაშლა"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">წაშლა</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>განცხადების წაშლა</AlertDialogTitle>
                  <AlertDialogDescription>
                    დარწმუნებული ხართ, რომ გსურთ ამ განცხადების წაშლა? ეს მოქმედება შეუქცევადია.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    წაშლა
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