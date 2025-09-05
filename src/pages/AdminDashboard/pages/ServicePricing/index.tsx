import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, DollarSign, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface ServicePricing {
  id: number;
  serviceType: string;
  nameKa: string;
  nameEn: string;
  nameRu?: string;
  pricePerDay: number;
  descriptionKa?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  features?: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceCardProps {
  service: ServicePricing;
  priceChanges: Record<number, string>;
  onPriceChange: (serviceId: number, value: string) => void;
  formatPrice: (price: number) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  priceChanges,
  onPriceChange,
  formatPrice
}) => {
  const { t, i18n } = useTranslation('admin');
  const currentPrice = priceChanges[service.id] ?? service.pricePerDay.toString();
  const hasChanges = priceChanges[service.id] !== undefined && parseFloat(priceChanges[service.id] || '0') !== service.pricePerDay;
  
  // Helper function to get service name from translations (for better localization)
  const getServiceName = (service: ServicePricing): string => {
    // Try to get translated name first, fallback to database names
    const translatedName = t(`servicePricing.serviceTypes.${service.serviceType}`, '');
    if (translatedName) {
      return translatedName;
    }
    
    // Fallback to database names if no translation exists
    const lang = i18n.language;
    switch (lang) {
      case 'ka':
        return service.nameKa;
      case 'ru':
        return service.nameRu || service.nameEn || service.nameKa;
      case 'en':
      default:
        return service.nameEn || service.nameKa;
    }
  };
  
  // Helper function to get service description from translations
  const getServiceDescription = (service: ServicePricing): string => {
    // Get static translated description based on service type
    const descriptionKey = `servicePricing.serviceDescriptions.${service.serviceType}`;
    return t(descriptionKey, ''); // Empty string as fallback if no translation exists
  };

  const getServiceTypeLabel = (serviceType: string): string => {
    return t(`servicePricing.serviceTypes.${serviceType}`, serviceType);
  };

  const getCategoryLabel = (category: string): string => {
    return t(`servicePricing.categories.${category}`, category === 'vip' ? 'VIP Services' : 'Additional Services');
  };

  const getCategoryColor = (category: string): string => {
    return category === 'vip' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const handleInputChange = (value: string) => {
    onPriceChange(service.id, value);
  };

  // Get card border and accent colors based on service type
  const getCardColors = () => {
    if (service.category === 'vip') {
      switch (service.serviceType) {
        case 'free':
          return {
            border: 'border-l-4 border-l-gray-500 border-gray-100',
            header: 'bg-gradient-to-r from-gray-50 to-transparent',
            accent: 'text-gray-600'
          };
        case 'vip':
          return {
            border: 'border-l-4 border-l-blue-500 border-blue-100',
            header: 'bg-gradient-to-r from-blue-50 to-transparent',
            accent: 'text-blue-600'
          };
        case 'vip_plus':
          return {
            border: 'border-l-4 border-l-purple-500 border-purple-100',
            header: 'bg-gradient-to-r from-purple-50 to-transparent',
            accent: 'text-purple-600'
          };
        case 'super_vip':
          return {
            border: 'border-l-4 border-l-yellow-500 border-yellow-100',
            header: 'bg-gradient-to-r from-yellow-50 to-transparent',
            accent: 'text-yellow-600'
          };
        default:
          return {
            border: 'border-l-4 border-l-purple-500 border-purple-100',
            header: 'bg-gradient-to-r from-purple-50 to-transparent',
            accent: 'text-purple-600'
          };
      }
    } else {
      // Additional services
      switch (service.serviceType) {
        case 'auto_renew':
          return {
            border: 'border-l-4 border-l-green-500 border-green-100',
            header: 'bg-gradient-to-r from-green-50 to-transparent',
            accent: 'text-green-600'
          };
        case 'color_separation':
          return {
            border: 'border-l-4 border-l-orange-500 border-orange-100',
            header: 'bg-gradient-to-r from-orange-50 to-transparent',
            accent: 'text-orange-600'
          };
        default:
          return {
            border: 'border-l-4 border-l-blue-500 border-blue-100',
            header: 'bg-gradient-to-r from-blue-50 to-transparent',
            accent: 'text-blue-600'
          };
      }
    }
  };

  const cardColors = getCardColors();

  return (
    <Card className={`${cardColors.border} hover:shadow-md transition-all duration-200`}>
      <CardHeader className={cardColors.header}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg ${cardColors.accent} font-semibold`}>{getServiceTypeLabel(service.serviceType)}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(service.category)}>
              {getCategoryLabel(service.category)}
            </Badge>
            {service.isActive ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-2">
        {/* Current price display */}
        <div className={`p-4 rounded-lg ${cardColors.header} border ${cardColors.border.split(' ').slice(-1)[0].replace('border-l-', 'border-')}`}>
          <div className="text-sm text-gray-600 mb-1">{t('servicePricing.labels.currentPrice')}</div>
          <div className={`text-2xl font-bold ${cardColors.accent}`}>
            {formatPrice(service.pricePerDay)} {t('servicePricing.labels.pricePerDay')}
          </div>
        </div>

        {/* Price editing */}
        <div>
          <Label htmlFor={`price-${service.id}`}>{t('servicePricing.labels.newPrice')}</Label>
          <div className="relative">
            <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${cardColors.accent}`} />
            <Input
              id={`price-${service.id}`}
              type="number"
              step="0.01"
              min="0"
              value={currentPrice}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`pl-10 text-lg ${hasChanges ? 'border-orange-300 bg-orange-50' : `focus:border-${cardColors.accent.split('-')[1]}-300`}`}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Description (read-only) */}
        {getServiceDescription(service) && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {getServiceDescription(service)}
          </div>
        )}

        {/* Change indicator */}
        {hasChanges && (
          <div className="pt-4 border-t">
            <div className="flex items-center text-sm text-orange-600">
              <Save className="h-4 w-4 mr-2" />
              <span>{t('servicePricing.messages.priceChanged')}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminServicePricing = () => {
  const { t } = useTranslation('admin');
  const [services, setServices] = useState<ServicePricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [priceChanges, setPriceChanges] = useState<Record<number, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchServicePricing();
  }, []);

  const fetchServicePricing = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getServicePricing();
      setServices(data || []);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('servicePricing.messages.errorLoading');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (serviceId: number, newPrice: string) => {
    setPriceChanges(prev => ({
      ...prev,
      [serviceId]: newPrice
    }));
  };

  const handleSaveAllPrices = async () => {
    if (Object.keys(priceChanges).length === 0) {
      toast({
        title: t('common.info'),
        description: t('servicePricing.messages.noChanges'),
      });
      return;
    }

    try {
      setSaving(true);
      
      // Update all changed prices in parallel
      const updatePromises = Object.entries(priceChanges).map(async ([serviceId, newPriceStr]) => {
        const newPrice = parseFloat(newPriceStr) || 0;
        const data = await adminApi.updateServicePricing(serviceId, { pricePerDay: newPrice });
        return { serviceId: parseInt(serviceId), newPrice, data };
      });
      
      const results = await Promise.all(updatePromises);
      
      // Update local state with all changes
      setServices(prev => 
        prev.map(service => {
          const result = results.find(r => r.serviceId === service.id);
          return result ? { ...service, pricePerDay: result.data.pricePerDay || result.newPrice } : service;
        })
      );
      
      // Clear changes
      setPriceChanges({});
      
      toast({
        title: t('common.success'),
        description: t('servicePricing.messages.updated', { count: results.length }),
      });
    } catch (error: any) {
      console.error('Error updating service pricing:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('servicePricing.messages.errorUpdating');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('servicePricing.title')}</h1>
          <p className="text-gray-600">{t('servicePricing.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('servicePricing.messages.loadingPrices')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group services by category
  const vipServices = services.filter(s => s.category === 'vip');
  const additionalServices = services.filter(s => s.category === 'service');

  const hasAnyChanges = Object.keys(priceChanges).length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('servicePricing.title')}</h1>
        <p className="text-gray-600">{t('servicePricing.subtitleWithCount', { count: services.length })}</p>
      </div>

      {/* VIP Services */}
      {vipServices.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">{t('servicePricing.categories.vip')}</h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {vipServices.length} {t('servicePricing.labels.services')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vipServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                priceChanges={priceChanges}
                onPriceChange={handlePriceChange}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      )}

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('servicePricing.categories.service')}</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {additionalServices.length} {t('servicePricing.labels.services')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {additionalServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                priceChanges={priceChanges}
                onPriceChange={handlePriceChange}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('servicePricing.messages.noServicesFound')}</h3>
            <p className="text-gray-500 mb-4">
              {t('servicePricing.messages.noServicesAvailable')}
            </p>
            <Button onClick={fetchServicePricing}>
              {t('servicePricing.buttons.refresh')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Save All Button - Fixed at bottom */}
      {hasAnyChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={handleSaveAllPrices}
            disabled={saving}
            size="lg"
            className="bg-green-600 hover:bg-green-700 shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('servicePricing.buttons.saveAllPrices')} ({Object.keys(priceChanges).length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminServicePricing;