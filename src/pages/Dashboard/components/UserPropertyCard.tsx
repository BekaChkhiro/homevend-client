import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar, User, Crown } from "lucide-react";
import { useState } from "react";
import { VipPurchaseModal } from "@/components/VipPurchaseModal";
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
  // New fields for agency functionality
  owner?: {
    id: number;
    fullName: string;
    email: string;
  };
  isOwnProperty?: boolean;
  // VIP status fields
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
}

interface UserPropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  onVipPurchased?: () => void;
}

const VIP_BG_COLORS = {
  vip: 'bg-blue-100 text-blue-800 border-blue-300',
  vip_plus: 'bg-purple-100 text-purple-800 border-purple-300',
  super_vip: 'bg-yellow-100 text-yellow-800 border-yellow-300'
};

const VIP_LABELS = {
  vip: 'VIP',
  vip_plus: 'VIP+',
  super_vip: 'SUPER VIP'
};

export const UserPropertyCard = ({ property, onDelete, onVipPurchased }: UserPropertyCardProps) => {
  const navigate = useNavigate();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);


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

  const getLocationString = () => {
    const parts = [];
    
    // Add district/area if available
    if (property.areaData?.nameKa) {
      parts.push(property.areaData.nameKa);
    } else if (property.district) {
      parts.push(property.district);
    }
    
    // Add city
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

  const isVipActive = () => {
    if (!property.vipStatus || property.vipStatus === 'none') return false;
    if (!property.vipExpiresAt) return false;
    return new Date(property.vipExpiresAt) > new Date();
  };

  const getVipInfo = () => {
    if (!isVipActive()) return null;
    const vipType = property.vipStatus!;
    const colorClass = VIP_BG_COLORS[vipType as keyof typeof VIP_BG_COLORS];
    const label = VIP_LABELS[vipType as keyof typeof VIP_LABELS];
    return { colorClass, label };
  };

  const getVipButtonStyle = () => {
    if (isVipActive()) {
      const vipType = property.vipStatus!;
      switch (vipType) {
        case 'vip':
          return {
            className: "h-8 px-2 text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300",
            text: "VIP აქტიური",
            textColor: "text-blue-700"
          };
        case 'vip_plus':
          return {
            className: "h-8 px-2 text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-300",
            text: "VIP+ აქტიური", 
            textColor: "text-purple-700"
          };
        case 'super_vip':
          return {
            className: "h-8 px-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300",
            text: "SUPER VIP",
            textColor: "text-yellow-700"
          };
        default:
          return {
            className: "h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50",
            text: "VIP",
            textColor: "text-yellow-600"
          };
      }
    } else {
      return {
        className: "h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50",
        text: "VIP შეძენა",
        textColor: "text-yellow-600"
      };
    }
  };

  const getVipExpirationInfo = () => {
    if (!isVipActive() || !property.vipExpiresAt) return '';
    
    const expirationDate = new Date(property.vipExpiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return 'დღეს იწურება';
    if (daysLeft === 1) return '1 დღე დარჩა';
    return `${daysLeft} დღე დარჩა`;
  };

  const handleVipSuccess = () => {
    onVipPurchased?.();
    setIsVipModalOpen(false);
  };

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">

          {/* Image - Reduced size */}

          {/* Image */}

          <div className="relative flex-shrink-0">
            <img 
              src={getMainImage()} 
              alt={property.title || `${property.propertyType} ${property.city}-ში`}

              className="w-20 h-20 object-cover rounded-lg"

            />
          </div>

          {/* Content - Reduced spacing */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate pr-4">
                  {property.title || `${property.propertyType} ${property.city}-ში`}
                </h3>
                {/* VIP Badge */}
                {(() => {
                  const vipInfo = getVipInfo();
                  if (!vipInfo) return null;
                  const { colorClass, label } = vipInfo;
                  return (
                    <Badge className={`text-xs mt-1 ${colorClass}`}>
                      <Crown className="h-3 w-3 mr-1" />
                      {label}
                    </Badge>
                  );
                })()}
              </div>
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

            {/* Statistics - Simplified */}
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

          {/* Actions - Direct buttons */}
          <div className="flex gap-1 flex-shrink-0">
            {/* View button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => navigate(`/property/${property.id}`)}
              title="ნახვა"
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">ნახვა</span>
            </Button>
            
            {/* Edit button - only for own properties */}
            {property.isOwnProperty !== false && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => navigate(`/dashboard/edit-property/${property.id}`)}
                title="რედაქტირება"
              >
                <Edit className="h-4 w-4 mr-1" />
                <span className="text-xs">რედაქტირება</span>
              </Button>
            )}

            {/* VIP Purchase button - only for own properties */}
            {property.isOwnProperty !== false && (
              <div className="flex flex-col items-center space-y-1">
                <Button 
                  variant={isVipActive() ? "default" : "ghost"}
                  size="sm" 
                  className={getVipButtonStyle().className}
                  onClick={() => setIsVipModalOpen(true)}
                  title={isVipActive() ? `${getVipButtonStyle().text} - ${getVipExpirationInfo()} - VIP გაგრძელება` : "VIP სტატუსის შეძენა"}
                >
                  <Crown className={`h-4 w-4 mr-1 ${getVipButtonStyle().textColor}`} />
                  <span className="text-xs">{getVipButtonStyle().text}</span>
                </Button>
                {/* Expiration info for active VIP */}
                {isVipActive() && (
                  <span className={`text-xs ${getVipButtonStyle().textColor} font-medium`}>
                    {getVipExpirationInfo()}
                  </span>
                )}
              </div>
            )}
            
            {/* Delete button with AlertDialog - only for own properties */}
            {property.isOwnProperty !== false && (
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
            )}
          </div>
        </div>
      </CardContent>
      
      {/* VIP Purchase Modal */}
      <VipPurchaseModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        propertyId={parseInt(property.id)}
        propertyTitle={property.title || `${property.propertyType} ${property.city}-ში`}
        onSuccess={handleVipSuccess}
      />
    </Card>
  );
};