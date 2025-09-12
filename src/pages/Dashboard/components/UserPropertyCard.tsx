import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Calendar, User, Crown, Clock, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { VipPurchaseModal } from "@/components/VipPurchaseModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useBalanceRefresh } from "../Dashboard";
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
    nameRussian?: string;
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
  // Active services
  services?: Array<{
    serviceType: string;
    expiresAt: string;
    colorCode?: string;
  }>;
}

interface UserPropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  onVipPurchased?: () => void;
  services?: Array<{
    serviceType: string;
    colorCode?: string;
    expiresAt: string;
  }>;
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

const DEFAULT_SERVICE_COLORS = {
  vip: '#3b82f6', // Blue
  vip_plus: '#8b5cf6', // Purple
  super_vip: '#f59e0b', // Amber/Gold
  auto_renew: '#10b981', // Green
  color_separation: '#f97316' // Orange
};

export const UserPropertyCard = ({ property, onDelete, onVipPurchased, services }: UserPropertyCardProps) => {
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const refreshBalance = useBalanceRefresh();
  const { t, i18n } = useTranslation('userDashboard');

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/property/${property.id}/images`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            const imageUrls = data.images.map((img: any) => 
              img.urls?.large || img.urls?.medium || img.urls?.original
            ).filter(Boolean);
            setPropertyImages(imageUrls);
          }
        }
      } catch (error) {
        console.warn('Failed to load property images:', error);
        if (property.photos && property.photos.length > 0) {
          setPropertyImages(property.photos);
        }
      }
    };

    fetchPropertyImages();
  }, [property.id, property.photos]);

  const getImageUrls = () => {
    if (propertyImages.length > 0) {
      return propertyImages;
    }
    if (property.photos && property.photos.length > 0) {
      return property.photos;
    }
    return ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'];
  };

  const images = getImageUrls();
  const hasMultipleImages = images.length > 1;

  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    return false;
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    return false;
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
    return false;
  };

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'en' ? 'en-US' : 
                   i18n.language === 'ru' ? 'ru-RU' : 'ka-GE';
    return new Date(dateString).toLocaleDateString(locale);
  };

  const getMainImage = () => {
    if (images.length > 0) {
      return images[currentImageIndex];
    }
    if (property.photos && property.photos.length > 0) {
      return property.photos[0];
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';
  };

  const cityTranslations: Record<string, Record<string, string>> = {
    'თბილისი': { en: 'Tbilisi', ru: 'Тбилиси', ka: 'თბილისი' },
    'ბათუმი': { en: 'Batumi', ru: 'Батуми', ka: 'ბათუმი' },
    'ქუთაისი': { en: 'Kutaisi', ru: 'Кутаиси', ka: 'ქუთაისი' }
  };

  const districtTranslations: Record<string, Record<string, string>> = {
    'ვაკე-საბურთალო': { en: 'Vake-Saburtalo', ru: 'Ваке-Сабурталo', ka: 'ვაკე-საბურთალო' },
    'ვაკე': { en: 'Vake', ru: 'Ваке', ka: 'ვაკე' },
    'საბურთალო': { en: 'Saburtalo', ru: 'Сабурталo', ka: 'საბურთალო' },
    'დიდუბე': { en: 'Didube', ru: 'Дидубе', ka: 'დიდუბე' },
    'ისანი': { en: 'Isani', ru: 'Исани', ka: 'ისანი' },
    'კრწანისი': { en: 'Krtsanisi', ru: 'Крцаниси', ka: 'კრწანისი' },
    'მთაწმინდა': { en: 'Mtatsminda', ru: 'Мтацминда', ka: 'მთაწმინდა' },
    'ნაძალადევი': { en: 'Nadzaladevi', ru: 'Надзаладеви', ka: 'ნაძალადევი' },
    'სამგორი': { en: 'Samgori', ru: 'Самгори', ka: 'სამგორი' },
    'ჩუღურეთი': { en: 'Chughureti', ru: 'Чугурети', ka: 'ჩუღურეთი' }
  };

  const translateText = (text: string, targetLang: string): string => {
    if (!text || targetLang === 'ka') return text;
    
    let translatedText = text;
    
    Object.entries(cityTranslations).forEach(([georgian, translations]) => {
      if (translatedText.includes(georgian)) {
        translatedText = translatedText.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    Object.entries(districtTranslations).forEach(([georgian, translations]) => {
      if (translatedText.includes(georgian)) {
        translatedText = translatedText.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    return translatedText;
  };

  const getLocationString = () => {
    const parts = [];
    
    if (property.areaData) {
      let areaName;
      switch (i18n.language) {
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
    
    if (property.cityData) {
      let cityName;
      switch (i18n.language) {
        case 'ka':
          cityName = property.cityData.nameGeorgian || property.cityData.nameEnglish;
          break;
        case 'ru':
          cityName = property.cityData.nameRussian || property.cityData.nameEnglish || property.cityData.nameGeorgian;
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
    
    return parts.length > 0 ? parts.join(', ') : t('propertyCard.locationNotSpecified');
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
            text: t('vipStatus.vipActive'),
            textColor: "text-blue-700"
          };
        case 'vip_plus':
          return {
            className: "h-8 px-2 text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-300",
            text: t('vipStatus.vipPlusActive'), 
            textColor: "text-purple-700"
          };
        case 'super_vip':
          return {
            className: "h-8 px-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300",
            text: t('vipStatus.superVipActive'),
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
        text: t('vipStatus.purchaseVip'),
        textColor: "text-yellow-600"
      };
    }
  };

  const getVipExpirationInfo = () => {
    if (!isVipActive() || !property.vipExpiresAt) return '';
    
    const expirationDate = new Date(property.vipExpiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return t('vipStatus.expirestoday');
    if (daysLeft === 1) return t('vipStatus.dayRemaining');
    return t('vipStatus.daysRemaining', { days: daysLeft });
  };

  const getDaysRemaining = (expiresAt: string): number => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getServiceLabel = (serviceType: string): string => {
    const key = `serviceLabels.${serviceType.replace('_', '').replace('-', '')}`;
    return t(key) || serviceType;
  };

  const formatDaysRemaining = (days: number): string => {
    if (days === 0) return t('vipStatus.expirestoday');
    if (days === 1) return '1 ' + t('vipStatus.day');
    return t('vipStatus.daysRemainingShort', { days });
  };

  const getServiceColor = (serviceType: string, customColor?: string): string => {
    if (customColor) return customColor;
    return DEFAULT_SERVICE_COLORS[serviceType as keyof typeof DEFAULT_SERVICE_COLORS] || '#6b7280';
  };

  const handleVipSuccess = () => {
    onVipPurchased?.();
    setIsVipModalOpen(false);
  };

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-0">
        {/* Mobile View - Compact card layout like FavoritePropertyCard */}
        <div className="sm:hidden p-4">
          {/* First Row - Main Info */}
          <div className="flex items-center gap-3 mb-3">
            {/* Image Carousel */}
            <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
              <img 
                src={getMainImage()} 
                alt={property.title || `${property.propertyType} ${property.city}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows (only show on hover and if multiple images) */}
              {hasMultipleImages && (
                <div className="absolute inset-0 group">
                  <button 
                    onClick={goToPrevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-0.5 rounded-r-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={goToNextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-0.5 rounded-l-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 text-center">
                    <span className="text-white text-[10px] font-medium">
                      {currentImageIndex + 1}/{images.length}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Title and Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-base leading-tight truncate">
                    {property.title || `${property.propertyType} ${property.city}`}
                  </h3>
                  {/* Active Services under title */}
                  {services && services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {services.map((service, index) => {
                        const daysLeft = getDaysRemaining(service.expiresAt);
                        const serviceColor = getServiceColor(service.serviceType, service.colorCode);
                        return (
                          <div 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border shadow-sm"
                            style={{ 
                              backgroundColor: serviceColor,
                              borderColor: serviceColor,
                              color: '#ffffff'
                            }}
                          >
                            <span className="font-semibold">{getServiceLabel(service.serviceType)}</span>
                            <Clock className="h-3 w-3 mx-1 opacity-80" />
                            <span className="opacity-90">{formatDaysRemaining(daysLeft)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className="text-lg font-bold text-primary whitespace-nowrap">
                  {formatPrice(property.totalPrice)} ₾
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-1.5">
                <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="text-sm truncate">
                  {getLocationString()}
                </span>
              </div>
            </div>
          </div>

          {/* Second Row - Details */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-3">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="font-medium">{property.area} {t('common.squareMeters')}</span>
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-xs px-2 py-1 h-6 whitespace-nowrap font-medium">
                  {property.propertyType}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1 h-6 whitespace-nowrap font-medium">
                  {property.dealType}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span>{property.viewCount}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(property.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Show owner info if property belongs to an agent */}
          {property.owner && !property.isOwnProperty && (
            <div className="flex items-center text-gray-600 mb-3 text-sm bg-gray-50 rounded-lg px-3 py-2">
              <User className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
              <span className="truncate font-medium">
                {t('propertyCard.agent')}: {property.owner.fullName}
              </span>
            </div>
          )}

          {/* Third Row - Main Actions */}
          <div className="flex gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(getLanguageUrl(`/property/${property.id}`, i18n.language))}
              className="h-10 px-4 py-2 text-sm flex-1 font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('common.view')}
            </Button>
            
            {property.isOwnProperty !== false && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(getLanguageUrl(`/dashboard/edit-property/${property.id}`, i18n.language))}
                  className="h-10 px-4 py-2 text-sm flex-1 font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.edit')}
                </Button>

              </>
            )}
          </div>

          {/* Fourth Row - Delete Action */}
          {property.isOwnProperty !== false && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-full font-medium border border-red-200 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('propertyCard.deleteProperty')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('propertyCard.deleteConfirmation')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* VIP expiration info */}
          {isVipActive() && (
            <div className="mt-2 text-center">
              <span className={`text-xs ${getVipButtonStyle().textColor} font-medium`}>
                {getVipExpirationInfo()}
              </span>
            </div>
          )}
        </div>

        {/* Desktop/Tablet View - Keep existing horizontal layout */}
        <div className="hidden sm:flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 p-3 lg:p-4">
          {/* Image */}
          <div className="relative flex-shrink-0 sm:w-full lg:w-auto">
            <img 
              src={getMainImage()} 
              alt={property.title || `${property.propertyType} ${property.city}-ში`}
              className="w-full sm:h-32 lg:w-20 lg:h-20 object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1 sm:gap-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base lg:text-lg truncate sm:pr-4">
                  {property.title || `${property.propertyType} ${property.city}-ში`}
                </h3>
                {/* Active Services */}
                {services && services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {services.map((service, index) => {
                      const daysLeft = getDaysRemaining(service.expiresAt);
                      const serviceColor = getServiceColor(service.serviceType, service.colorCode);
                      return (
                        <div 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border shadow-sm"
                          style={{ 
                            backgroundColor: serviceColor,
                            borderColor: serviceColor,
                            color: '#ffffff'
                          }}
                        >
                          <span className="font-semibold">{getServiceLabel(service.serviceType)}</span>
                          <Clock className="h-3 w-3 mx-1 opacity-80" />
                          <span className="opacity-90">{formatDaysRemaining(daysLeft)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <span className="text-base lg:text-lg font-bold text-primary whitespace-nowrap">
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
                  {t('propertyCard.agent')}: {property.owner.fullName}
                </span>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
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
                <span>{property.area} {t('common.squareMeters')}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {property.propertyType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {property.dealType}
              </Badge>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{property.viewCount} {t('propertyCard.views')}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(property.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => navigate(getLanguageUrl(`/property/${property.id}`, i18n.language))}
              title={t('common.view')}
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('common.view')}</span>
            </Button>
            
            {property.isOwnProperty !== false && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => navigate(getLanguageUrl(`/dashboard/edit-property/${property.id}`, i18n.language))}
                title={t('common.edit')}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('common.edit')}</span>
              </Button>
            )}

            {property.isOwnProperty !== false && (
              <div className="flex flex-col items-center space-y-1">
                <Button 
                  variant={isVipActive() ? "default" : "ghost"}
                  size="sm" 
                  className={getVipButtonStyle().className}
                  onClick={() => setIsVipModalOpen(true)}
                  title={isVipActive() ? `${getVipButtonStyle().text} - ${getVipExpirationInfo()} - ${t('vipStatus.purchaseVip')}` : t('vipStatus.purchaseVip')}
                >
                  <Crown className={`h-4 w-4 mr-1 ${getVipButtonStyle().textColor}`} />
                  <span className="text-xs">{getVipButtonStyle().text}</span>
                </Button>
                {isVipActive() && (
                  <span className={`text-xs ${getVipButtonStyle().textColor} font-medium`}>
                    {getVipExpirationInfo()}
                  </span>
                )}
              </div>
            )}
            
            {property.isOwnProperty !== false && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">{t('common.delete')}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('propertyCard.deleteProperty')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('propertyCard.deleteConfirmation')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      {t('common.delete')}
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
        propertyTitle={property.title || `${property.propertyType} ${property.city}`}
        onSuccess={handleVipSuccess}
        onBalanceChange={refreshBalance}
      />
    </Card>
  );
};