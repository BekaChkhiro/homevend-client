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

interface ServicePricing {
  id: number;
  serviceType: string;
  nameKa: string;
  nameEn: string;
  pricePerDay: number;
  descriptionKa?: string;
  descriptionEn?: string;
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
  getServiceTypeLabel: (serviceType: string) => string;
  getCategoryLabel: (category: string) => string;
  getCategoryColor: (category: string) => string;
  formatPrice: (price: number) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  priceChanges,
  onPriceChange,
  getServiceTypeLabel,
  getCategoryLabel,
  getCategoryColor,
  formatPrice
}) => {
  const currentPrice = priceChanges[service.id] ?? service.pricePerDay.toString();
  const hasChanges = priceChanges[service.id] !== undefined && parseFloat(priceChanges[service.id] || '0') !== service.pricePerDay;

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
            <CardDescription className="text-gray-600">{service.nameKa}</CardDescription>
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
      
      <CardContent className="space-y-4">
        {/* Current price display */}
        <div className={`p-4 rounded-lg ${cardColors.header} border ${cardColors.border.split(' ').slice(-1)[0].replace('border-l-', 'border-')}`}>
          <div className="text-sm text-gray-600 mb-1">მიმდინარე ფასი</div>
          <div className={`text-2xl font-bold ${cardColors.accent}`}>
            {formatPrice(service.pricePerDay)} ₾ / დღეში
          </div>
        </div>

        {/* Price editing */}
        <div>
          <Label htmlFor={`price-${service.id}`}>ახალი ღირებულება (დღეში)</Label>
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
        {service.descriptionKa && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {service.descriptionKa}
          </div>
        )}

        {/* Change indicator */}
        {hasChanges && (
          <div className="pt-4 border-t">
            <div className="flex items-center text-sm text-orange-600">
              <Save className="h-4 w-4 mr-2" />
              <span>ფასი შეცვლილია - შენახვისთვის გამოიყენეთ "ყველა ფასის შენახვა" ღილაკი</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminServicePricing = () => {
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
                          "ფასების ჩატვირთვისას მოხდა შეცდომა";
      toast({
        title: "შეცდომა",
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
        title: "ინფორმაცია",
        description: "ცვლილებები არ არის შესანახად",
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
        title: "წარმატება",
        description: `${results.length} სერვისის ფასი წარმატებით განახლდა`,
      });
    } catch (error: any) {
      console.error('Error updating service pricing:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "ფასების განახლებისას მოხდა შეცდომა";
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getServiceTypeLabel = (serviceType: string): string => {
    const labels: Record<string, string> = {
      free: 'უფასო განცხადება',
      vip: 'VIP',
      vip_plus: 'VIP+',
      super_vip: 'სუპერ VIP',
      auto_renew: 'ავტო-განახლება',
      color_separation: 'ფერადი განცალკევება'
    };
    return labels[serviceType] || serviceType;
  };

  const getCategoryLabel = (category: string): string => {
    return category === 'vip' ? 'VIP სერვისები' : 'დამატებითი სერვისები';
  };

  const getCategoryColor = (category: string): string => {
    return category === 'vip' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ფასების მართვა</h1>
          <p className="text-gray-600">VIP და დამატებითი სერვისების ფასების მართვა</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>ფასების ჩატვირთვა...</span>
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
        <h1 className="text-3xl font-bold mb-2">ფასების მართვა</h1>
        <p className="text-gray-600">VIP და დამატებითი სერვისების ფასების მართვა ({services.length} სერვისი)</p>
      </div>

      {/* VIP Services */}
      {vipServices.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">VIP სერვისები</h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {vipServices.length} სერვისი
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vipServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                priceChanges={priceChanges}
                onPriceChange={handlePriceChange}
                getServiceTypeLabel={getServiceTypeLabel}
                getCategoryLabel={getCategoryLabel}
                getCategoryColor={getCategoryColor}
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
            <h2 className="text-xl font-semibold">დამატებითი სერვისები</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {additionalServices.length} სერვისი
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {additionalServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                priceChanges={priceChanges}
                onPriceChange={handlePriceChange}
                getServiceTypeLabel={getServiceTypeLabel}
                getCategoryLabel={getCategoryLabel}
                getCategoryColor={getCategoryColor}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">სერვისები ვერ მოიძებნა</h3>
            <p className="text-gray-500 mb-4">
              ამჟამად არ არის ხელმისაწვდომი სერვისების ფასები
            </p>
            <Button onClick={fetchServicePricing}>
              განახლება
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
                შენახვა...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                ყველა ფასის შენახვა ({Object.keys(priceChanges).length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminServicePricing;