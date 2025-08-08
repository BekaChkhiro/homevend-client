import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  street: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  status: 'active' | 'inactive' | 'pending' | 'sold';
  viewCount: number;
  createdAt: string;
  photos: string[];
  contactName: string;
  contactPhone: string;
}

interface UserPropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
}

export const UserPropertyCard = ({ property, onDelete }: UserPropertyCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "sold": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "აქტიური";
      case "pending": return "მოლოდინში";
      case "sold": return "გაყიდული";
      case "inactive": return "არააქტიური";
      default: return status;
    }
  };

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const getMainImage = () => {
    if (property.photos && property.photos.length > 0) {
      return property.photos[0];
    }
    return "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop";
  };

  const handleDelete = () => {
    onDelete(property.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center gap-6 p-6">
          {/* Image */}
          <div className="relative flex-shrink-0">
            <img 
              src={getMainImage()} 
              alt={property.title || `${property.propertyType} ${property.city}-ში`}
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-xl truncate pr-4">
                {property.title || `${property.propertyType} ${property.city}-ში`}
              </h3>
              <span className="text-xl font-bold text-primary whitespace-nowrap">
                {formatPrice(property.totalPrice)} ₾
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-base truncate">
                {property.street}, {property.city}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-base text-gray-600 mb-2">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Square className="h-5 w-5 mr-2" />
                <span>{property.area} მ²</span>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {property.propertyType}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {property.dealType}
              </Badge>
            </div>

            {/* Statistics and Contact Info */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{property.viewCount} ნახვა</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>შექმნილია: {formatDate(property.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {property.status !== "pending" && (
              <Badge className={`${getStatusColor(property.status)} px-3 py-1`}>
                {getStatusText(property.status)}
              </Badge>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                ნახვა
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/dashboard/edit-property/${property.id}`)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                რედაქტირება
              </Button>
            </div>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  წაშლა
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
            
            <span className="text-sm text-gray-500">ID: {property.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};