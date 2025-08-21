import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, RefreshCw, Palette, Loader2 } from 'lucide-react';
import { servicesApi } from '@/lib/api';

interface ServicePricing {
  id: number;
  serviceType: string;
  nameKa: string;
  nameEn: string;
  pricePerDay: number;
  descriptionKa: string;
  descriptionEn: string;
  features: string[];
  category: string;
}

interface Service {
  serviceType: string;
  days: number;
  colorCode?: string;
}

interface ServicesSelectorProps {
  propertyId?: number;
  onServicesChange: (services: Service[]) => void;
  selectedServices?: Service[];
  showPurchaseButton?: boolean;
  onPurchase?: (services: Service[]) => Promise<void>;
  showOnlyAdditionalServices?: boolean; // New prop to show only auto-renew and color separation
}

const SERVICE_TYPE_ICONS = {
  'vip': Crown,
  'vip_plus': Crown,
  'super_vip': Crown,
  'auto_renew': RefreshCw,
  'color_separation': Palette,
};

const SERVICE_TYPE_COLORS = {
  'vip': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'vip_plus': 'bg-orange-100 text-orange-800 border-orange-300', 
  'super_vip': 'bg-red-100 text-red-800 border-red-300',
  'auto_renew': 'bg-blue-100 text-blue-800 border-blue-300',
  'color_separation': 'bg-green-100 text-green-800 border-green-300',
};

const COLOR_OPTIONS = [
  { value: '#FF5733', label: 'Red', color: '#FF5733' },
  { value: '#33FF57', label: 'Green', color: '#33FF57' },
  { value: '#3357FF', label: 'Blue', color: '#3357FF' },
  { value: '#FF33F1', label: 'Pink', color: '#FF33F1' },
  { value: '#F1FF33', label: 'Yellow', color: '#F1FF33' },
  { value: '#33FFF1', label: 'Cyan', color: '#33FFF1' },
];

export const ServicesSelector: React.FC<ServicesSelectorProps> = ({
  propertyId,
  onServicesChange,
  selectedServices = [],
  showPurchaseButton = false,
  onPurchase,
  showOnlyAdditionalServices = false
}) => {
  const [allServices, setAllServices] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [services, setServices] = useState<Service[]>(selectedServices);

  useEffect(() => {
    fetchServicePricing();
  }, []);

  useEffect(() => {
    setServices(selectedServices);
  }, [selectedServices]);

  const fetchServicePricing = async () => {
    try {
      const pricing = await servicesApi.getServicePricing();
      // Combine VIP and additional services
      const combined = [...(pricing.vipServices || []), ...(pricing.additionalServices || [])];
      
      // Filter to show only additional services if requested
      const servicesToShow = showOnlyAdditionalServices 
        ? combined.filter(s => ['auto_renew', 'color_separation'].includes(s.serviceType))
        : combined;
        
      setAllServices(servicesToShow);
    } catch (error) {
      console.error('Error fetching service pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const isServiceSelected = (serviceType: string) => {
    return services.some(s => s.serviceType === serviceType);
  };

  const getSelectedService = (serviceType: string) => {
    return services.find(s => s.serviceType === serviceType);
  };

  const handleServiceToggle = (serviceType: string, checked: boolean) => {
    let newServices: Service[];
    
    if (checked) {
      // Add service with default 7 days
      newServices = [...services, { 
        serviceType, 
        days: 7, 
        colorCode: serviceType === 'color_separation' ? COLOR_OPTIONS[0].value : undefined 
      }];
    } else {
      // Remove service
      newServices = services.filter(s => s.serviceType !== serviceType);
    }
    
    setServices(newServices);
    onServicesChange(newServices);
  };

  const handleDaysChange = (serviceType: string, days: number) => {
    const newServices = services.map(s => 
      s.serviceType === serviceType ? { ...s, days } : s
    );
    setServices(newServices);
    onServicesChange(newServices);
  };

  const handleColorChange = (serviceType: string, colorCode: string) => {
    const newServices = services.map(s => 
      s.serviceType === serviceType ? { ...s, colorCode } : s
    );
    setServices(newServices);
    onServicesChange(newServices);
  };

  const calculateTotalCost = () => {
    return services.reduce((total, service) => {
      const pricing = allServices.find(p => p.serviceType === service.serviceType);
      return total + (pricing ? pricing.pricePerDay * service.days : 0);
    }, 0);
  };

  const handlePurchase = async () => {
    if (!onPurchase || services.length === 0) return;

    setPurchasing(true);
    try {
      await onPurchase(services);
    } catch (error) {
      console.error('Error purchasing VIP services:', error);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>VIP სერვისების ჩატვირთვა...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          VIP სერვისები
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {allServices.map((pricing) => {
          const Icon = SERVICE_TYPE_ICONS[pricing.serviceType as keyof typeof SERVICE_TYPE_ICONS] || Crown;
          const isSelected = isServiceSelected(pricing.serviceType);
          const selectedService = getSelectedService(pricing.serviceType);
          
          return (
            <div key={pricing.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleServiceToggle(pricing.serviceType, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" />
                    <Badge className={SERVICE_TYPE_COLORS[pricing.serviceType as keyof typeof SERVICE_TYPE_COLORS] || 'bg-gray-100'}>
                      {pricing.nameKa}
                    </Badge>
                    <span className="text-sm font-medium">
                      {pricing.pricePerDay.toFixed(2)}₾/დღე
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {pricing.descriptionKa}
                  </p>
                  
                  {pricing.features && pricing.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pricing.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {isSelected && selectedService && (
                <div className="ml-8 space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`days-${pricing.serviceType}`}>დღეების რაოდენობა</Label>
                      <Input
                        id={`days-${pricing.serviceType}`}
                        type="number"
                        min="1"
                        max="30"
                        value={selectedService.days}
                        onChange={(e) => handleDaysChange(pricing.serviceType, parseInt(e.target.value) || 1)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">სრული ღირებულება</Label>
                      <div className="text-lg font-bold text-primary">
                        {(pricing.pricePerDay * selectedService.days).toFixed(2)}₾
                      </div>
                    </div>
                  </div>
                  
                  {pricing.serviceType === 'color_separation' && (
                    <div>
                      <Label htmlFor={`color-${pricing.serviceType}`}>აირჩიეთ ფერი</Label>
                      <Select
                        value={selectedService.colorCode || COLOR_OPTIONS[0].value}
                        onValueChange={(value) => handleColorChange(pricing.serviceType, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: color.color }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {services.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">სულ:</span>
              <span className="text-2xl font-bold text-primary">
                {calculateTotalCost().toFixed(2)}₾
              </span>
            </div>
            
            {showPurchaseButton && (
              <Button
                onClick={handlePurchase}
                disabled={purchasing || services.length === 0}
                className="w-full"
                size="lg"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    შეძენა...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    VIP სერვისების შეძენა
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};