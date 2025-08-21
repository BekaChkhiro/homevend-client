import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, AlertCircle, RotateCcw, Palette } from 'lucide-react';
import { servicesApi, balanceApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface VipPricing {
  id: number;
  serviceType: string;
  vipType?: string; // Keep for backward compatibility
  pricePerDay: number;
  nameKa: string;
  nameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  features: string[];
}

interface VipPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: number;
  propertyTitle?: string;
  onSuccess?: (data: any) => void;
  onBalanceChange?: () => void;
}

const SERVICE_COLORS = {
  free: 'text-gray-600 bg-gray-50 border-gray-200 ring-gray-300',
  vip: 'text-blue-600 bg-blue-50 border-blue-200 ring-blue-300',
  vip_plus: 'text-purple-600 bg-purple-50 border-purple-200 ring-purple-300', 
  super_vip: 'text-yellow-600 bg-yellow-50 border-yellow-200 ring-yellow-300',
  auto_renew: 'text-green-600 bg-green-50 border-green-200 ring-green-300',
  color_separation: 'text-orange-600 bg-orange-50 border-orange-200 ring-orange-300'
};

const SERVICE_LABELS = {
  free: 'უფასო განცხადება',
  vip: 'VIP',
  vip_plus: 'VIP+',
  super_vip: 'SUPER VIP',
  auto_renew: 'ავტო განახლება',
  color_separation: 'ფერადი გამოყოფა'
};

const SERVICE_ICONS = {
  free: Crown,
  vip: Crown,
  vip_plus: Crown,
  super_vip: Crown,
  auto_renew: RotateCcw,
  color_separation: Palette
};

interface ServiceSelection {
  serviceType: string;
  days: number;
}

export const VipPurchaseModal: React.FC<VipPurchaseModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onSuccess,
  onBalanceChange
}) => {
  const [vipPricing, setVipPricing] = useState<VipPricing[]>([]);
  const [additionalServices, setAdditionalServices] = useState<VipPricing[]>([]);
  const [selectedVipType, setSelectedVipType] = useState<string>('free');
  const [selectedVipDays, setSelectedVipDays] = useState<number>(7);
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPricing, setFetchingPricing] = useState(true);
  const [userBalance, setUserBalance] = useState<number>(0);
  const { toast } = useToast();

  const selectedPricing = vipPricing.find(p => (p.vipType || p.serviceType) === selectedVipType);
  const selectedServicePricing = additionalServices.filter(s => 
    selectedServices.some(sel => sel.serviceType === s.serviceType)
  );
  
  const vipCost = selectedPricing && selectedVipType !== 'free' 
    ? selectedPricing.pricePerDay * selectedVipDays : 0;
  const servicesCost = selectedServicePricing.reduce((total, service) => {
    const selectedService = selectedServices.find(s => s.serviceType === service.serviceType);
    return total + (service.pricePerDay * (selectedService?.days || 1));
  }, 0);
  const totalCost = vipCost + servicesCost;
  const canAfford = userBalance >= totalCost;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setFetchingPricing(true);
      const [servicesData, balanceData] = await Promise.all([
        servicesApi.getServicePricing(),
        balanceApi.getBalance()
      ]);
      
      // Use VIP services from the new API and map to expected structure
      const vipServices = servicesData.vipServices || [];
      const additionalSvcs = servicesData.additionalServices || [];
      
      const mappedVipPricing = vipServices.map((service: any) => ({
        id: service.id,
        serviceType: service.serviceType,
        vipType: service.serviceType, // For backward compatibility
        pricePerDay: service.pricePerDay,
        nameKa: service.nameKa || '',
        nameEn: service.nameEn || '',
        descriptionKa: service.descriptionKa || '',
        descriptionEn: service.descriptionEn || '',
        features: service.features || []
      }));
      
      const mappedAdditionalServices = additionalSvcs.map((service: any) => ({
        id: service.id,
        serviceType: service.serviceType,
        vipType: service.serviceType, // For backward compatibility
        pricePerDay: service.pricePerDay,
        nameKa: service.nameKa || '',
        nameEn: service.nameEn || '',
        descriptionKa: service.descriptionKa || '',
        descriptionEn: service.descriptionEn || '',
        features: service.features || []
      }));
      
      setVipPricing(mappedVipPricing.filter((p: VipPricing) => p.serviceType !== 'none'));
      setAdditionalServices(mappedAdditionalServices);
      setUserBalance(balanceData.balance);
    } catch (error) {
      console.error('Error fetching VIP data:', error);
      toast({
        title: "შეცდომა",
        description: "VIP ინფორმაციის მიღება ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setFetchingPricing(false);
    }
  };

  const handlePurchase = async () => {
    if (!propertyId) {
      toast({
        title: "შეცდომა", 
        description: "უძრავი ქონების ID არ არის მითითებული",
        variant: "destructive",
      });
      return;
    }

    // Validate VIP days
    if (selectedVipType !== 'free' && (selectedVipDays < 1 || selectedVipDays > 30)) {
      toast({
        title: "შეცდომა",
        description: "VIP დღეების რაოდენობა უნდა იყოს 1-დან 30-მდე",
        variant: "destructive",
      });
      return;
    }

    // Validate additional services days
    for (const service of selectedServices) {
      if (service.days < 1 || service.days > 30) {
        toast({
          title: "შეცდომა",
          description: "სერვისების დღეების რაოდენობა უნდა იყოს 1-დან 30-მდე",
          variant: "destructive",
        });
        return;
      }
    }

    if (!canAfford && totalCost > 0) {
      toast({
        title: "არასაკმარისი ბალანსი",
        description: `საჭიროა ${totalCost.toFixed(2)}₾, ხელმისაწვდომია ${userBalance.toFixed(2)}₾`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare services array for purchase - combine VIP and additional services
      const servicesToPurchase = [];
      
      // Add VIP service if not free
      if (selectedVipType !== 'free') {
        servicesToPurchase.push({
          serviceType: selectedVipType,
          days: selectedVipDays
        });
      }
      
      // Add additional services
      selectedServices.forEach(service => {
        servicesToPurchase.push({
          serviceType: service.serviceType,
          days: service.days
        });
      });
      
      // Purchase all services together if any selected
      if (servicesToPurchase.length > 0) {
        const response = await servicesApi.purchaseServices(propertyId!, servicesToPurchase);
        
        // Refresh user balance after purchase
        const balanceData = await balanceApi.getBalance();
        setUserBalance(balanceData.balance);
        
        // Call balance change callback to update BalanceSection
        console.log('🔔 Calling onBalanceChange callback');
        onBalanceChange?.();
        
        toast({
          title: "წარმატება!",
          description: `სერვისები წარმატებით შეძენილია. ახალი ბალანსი: ${balanceData.balance.toFixed(2)}₾`,
        });

        onSuccess?.({
          vipType: selectedVipType,
          vipDays: selectedVipDays,
          additionalServices: selectedServices,
          newBalance: balanceData.balance
        });
      } else {
        // No services selected (free option with no additional services)
        toast({
          title: "შენახულია",
          description: "განცხადება შენახულია უფასო სტატუსით",
        });
        
        onSuccess?.({
          vipType: 'free',
          vipDays: 0,
          additionalServices: []
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error('Service purchase error:', error);
      const errorMessage = error.response?.data?.message || 'სერვისების შეძენა ვერ მოხერხდა';
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>VIP სტატუსის შეძენა</DialogTitle>
          {propertyTitle && (
            <p className="text-sm text-gray-600">განცხადება: {propertyTitle}</p>
          )}
        </DialogHeader>

        {fetchingPricing ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Balance Display */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">თქვენი ბალანსი:</span>
              <span className="font-semibold">{userBalance.toFixed(2)}₾</span>
            </div>

            {/* VIP Package Selection */}
            <div>
              <Label className="text-sm font-medium">აირჩიეთ VIP პაკეტი</Label>
              <RadioGroup value={selectedVipType} onValueChange={setSelectedVipType} className="mt-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* Free Option */}
                  <Card 
                    className={`cursor-pointer transition-all min-h-[120px] ${
                      selectedVipType === 'free' ? `ring-2 ring-offset-2 ${SERVICE_COLORS.free.split(' ').pop()}` : 'hover:shadow-md'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVipType('free');
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="free" id="free" onClick={(e) => e.stopPropagation()} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Crown className={`h-4 w-4 ${selectedVipType === 'free' ? SERVICE_COLORS.free.split(' ')[0] : 'text-gray-400'}`} />
                              <Badge variant="outline" className={`text-sm font-medium ${selectedVipType === 'free' ? SERVICE_COLORS.free : ''}`}>
                                {SERVICE_LABELS.free}
                              </Badge>
                            </div>
                            <span className="font-semibold text-base">0₾</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">სტანდარტული ხილვადობა</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* VIP Options */}
                  {vipPricing.map((pricing) => {
                    const serviceType = pricing.vipType || pricing.serviceType;
                    const colorClass = SERVICE_COLORS[serviceType as keyof typeof SERVICE_COLORS];
                    const label = SERVICE_LABELS[serviceType as keyof typeof SERVICE_LABELS];
                    const IconComponent = SERVICE_ICONS[serviceType as keyof typeof SERVICE_ICONS];
                    const isSelected = selectedVipType === serviceType;
                    
                    return (
                      <Card 
                        key={pricing.id} 
                        className={`cursor-pointer transition-all min-h-[120px] ${
                          isSelected ? `ring-2 ring-offset-2 ${colorClass ? colorClass.split(' ').pop() : 'ring-blue-300'}` : 'hover:shadow-md'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedVipType(serviceType);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={serviceType} id={serviceType} onClick={(e) => e.stopPropagation()} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className={`h-4 w-4 ${isSelected ? (colorClass ? colorClass.split(' ')[0] : 'text-blue-600') : 'text-gray-400'}`} />
                                  <Badge variant="outline" className={`text-sm font-medium ${isSelected ? (colorClass || '') : ''}`}>
                                    {label}
                                  </Badge>
                                </div>
                                <span className="font-semibold text-base">{pricing.pricePerDay.toFixed(2)}₾/დღე</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                {serviceType === 'vip' && 'პრიორიტეტული ჩვენება VIP ნიშნით'}
                                {serviceType === 'vip_plus' && 'გაუმჯობესებული VIP მაღალი პრიორიტეტით'}
                                {serviceType === 'super_vip' && 'უმაღლესი დონის VIP პრემიუმ ადგილით'}
                              </p>
                              
                              {/* Day Selection for selected VIP */}
                              {isSelected && (
                                <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                                  <Label className="text-sm font-medium">რამდენი დღით?</Label>
                                  <Select 
                                    value={selectedVipDays.toString()} 
                                    onValueChange={(value) => setSelectedVipDays(parseInt(value))}
                                  >
                                    <SelectTrigger className="w-full mt-1">
                                      <SelectValue placeholder="აირჩიეთ დღეები" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                                        <SelectItem key={day} value={day.toString()}>
                                          {day} დღე
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Additional Services Selection */}
            <div>
              <Label className="text-sm font-medium">დამატებითი სერვისები (არჩევითი)</Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {additionalServices.map((service) => {
                  const serviceType = service.vipType || service.serviceType;
                  const colorClass = SERVICE_COLORS[serviceType as keyof typeof SERVICE_COLORS];
                  const label = SERVICE_LABELS[serviceType as keyof typeof SERVICE_LABELS];
                  const IconComponent = SERVICE_ICONS[serviceType as keyof typeof SERVICE_ICONS];
                  const isSelected = selectedServices.some(s => s.serviceType === serviceType);
                  const selectedService = selectedServices.find(s => s.serviceType === serviceType);
                  
                  return (
                    <Card 
                      key={service.id} 
                      className={`cursor-pointer transition-all min-h-[120px] ${
                        isSelected ? `ring-2 ring-offset-2 ${colorClass ? colorClass.split(' ').pop() : 'ring-green-300'}` : 'hover:shadow-md'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isSelected) {
                          setSelectedServices(selectedServices.filter(s => s.serviceType !== serviceType));
                        } else {
                          setSelectedServices([...selectedServices, { serviceType: serviceType, days: 7 }]);
                        }
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            id={serviceType}
                            checked={isSelected}
                            onChange={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`h-4 w-4 ${isSelected ? (colorClass ? colorClass.split(' ')[0] : 'text-green-600') : 'text-gray-400'}`} />
                                <Badge variant="outline" className={`text-sm font-medium ${isSelected ? (colorClass || '') : ''}`}>
                                  {label}
                                </Badge>
                              </div>
                              <span className="font-semibold text-base">{service.pricePerDay.toFixed(2)}₾/დღე</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              {serviceType === 'auto_renew' && 'ყოველდღიური ავტომატური განახლება'}
                              {serviceType === 'color_separation' && 'ფერადი ბორდერით გამოყოფა'}
                            </p>
                            
                            {/* Day Selection for selected service */}
                            {isSelected && (
                              <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                                <Label className="text-sm font-medium">რამდენი დღით?</Label>
                                <Select 
                                  value={(selectedService?.days || 7).toString()} 
                                  onValueChange={(value) => {
                                    const updatedServices = selectedServices.map(s => 
                                      s.serviceType === serviceType 
                                        ? { ...s, days: parseInt(value) }
                                        : s
                                    );
                                    setSelectedServices(updatedServices);
                                  }}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="აირჩიეთ დღეები" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                                      <SelectItem key={day} value={day.toString()}>
                                        {day} დღე
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Cost Summary - show if any paid services selected */}
            {(selectedPricing && selectedVipType !== 'free' || selectedServices.length > 0) && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">ღირებულების ჯამი</h4>
                    
                    {/* VIP Cost */}
                    {selectedPricing && selectedVipType !== 'free' && (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>VIP პაკეტი:</span>
                          <span>{SERVICE_LABELS[selectedVipType as keyof typeof SERVICE_LABELS]}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{selectedPricing.pricePerDay.toFixed(2)}₾/დღე × {selectedVipDays} დღე:</span>
                          <span>{vipCost.toFixed(2)}₾</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Additional Services Cost */}
                    {selectedServicePricing.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">დამატებითი სერვისები:</div>
                        {selectedServicePricing.map((service) => (
                          <div key={service.serviceType} className="flex justify-between text-sm text-gray-600">
                            <span>{SERVICE_LABELS[service.serviceType as keyof typeof SERVICE_LABELS]} ({service.pricePerDay.toFixed(2)}₾/დღე × {selectedServices.find(s => s.serviceType === service.serviceType)?.days || 1} დღე):</span>
                            <span>{(service.pricePerDay * (selectedServices.find(s => s.serviceType === service.serviceType)?.days || 1)).toFixed(2)}₾</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>სულ:</span>
                      <span className={!canAfford ? 'text-red-600' : 'text-green-600'}>
                        {totalCost.toFixed(2)}₾
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insufficient Balance Warning - only show if not 'free' */}
            {!canAfford && totalCost > 0 && selectedVipType !== 'free' && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 text-sm">
                  არასაკმარისი ბალანსი. საჭიროა ბალანსის შევსება.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                გაუქმება
              </Button>
              <Button 
                size="sm"
                onClick={handlePurchase} 
                disabled={loading || (!canAfford && totalCost > 0)}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                შეძენა {totalCost > 0 ? `${totalCost.toFixed(2)}₾-ით` : ''}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};