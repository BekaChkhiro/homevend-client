import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Crown, AlertCircle, RotateCcw, Palette, Calendar, Loader2 } from 'lucide-react';
import { vipApi, balanceApi, servicesApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

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

interface VipStatus {
  propertyId: number;
  title: string;
  vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt: string | null;
  isExpired: boolean;
  daysRemaining: number;
}

interface VipPurchaseSectionProps {
  propertyId: number;
  propertyTitle: string;
  selectedVipType: string;
  selectedVipDays: number;
  selectedServices: ServiceSelection[];
  onVipTypeChange: (vipType: string) => void;
  onVipDaysChange: (days: number) => void;
  onServicesChange: (services: ServiceSelection[]) => void;
  userBalance: number;
  vipPricing: any[];
  additionalServices: any[];
  freeServicePrice: number;
}

export const VipPurchaseSection: React.FC<VipPurchaseSectionProps> = ({
  propertyId,
  propertyTitle,
  selectedVipType,
  selectedVipDays,
  selectedServices,
  onVipTypeChange,
  onVipDaysChange,
  onServicesChange,
  userBalance,
  vipPricing,
  additionalServices,
  freeServicePrice
}) => {
  const [vipStatus, setVipStatus] = useState<VipStatus | null>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const { toast } = useToast();

  const selectedPricing = vipPricing.find(p => p.vipType === selectedVipType);
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
    if (propertyId) {
      fetchVipStatus();
    }
  }, [propertyId]);

  const fetchVipStatus = async () => {
    try {
      setFetchingData(true);
      const statusData = await vipApi.getPropertyVipStatus(propertyId);
      setVipStatus(statusData);
    } catch (error) {
      console.error('Error fetching VIP status:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const isVipActive = vipStatus && vipStatus.vipStatus !== 'none' && !vipStatus.isExpired;

  if (fetchingData) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">სერვისები</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">სერვისები</h3>
      <Card>
        <CardHeader>
          <CardTitle>VIP სტატუსის და დამატებითი სერვისების შეძენა</CardTitle>
          {propertyTitle && (
            <CardDescription>განცხადება: {propertyTitle}</CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Status */}
          {isVipActive && vipStatus && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Crown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">VIP სტატუსი აქტიურია</h4>
                  <p className="text-sm text-green-700 mt-1">
                    თქვენს განცხადებას აქვს {SERVICE_LABELS[vipStatus.vipStatus as keyof typeof SERVICE_LABELS]} სტატუსი
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {vipStatus.daysRemaining > 0 
                          ? `${vipStatus.daysRemaining} დღე დარჩენილია`
                          : 'დღეს იწურება'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Display */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">თქვენი ბალანსი:</span>
            <span className="font-semibold text-lg">{userBalance.toFixed(2)}₾</span>
          </div>

          {/* VIP Package Selection */}
          <div>
            <Label className="text-base font-medium">აირჩიეთ VIP პაკეტი</Label>
            <RadioGroup value={selectedVipType} onValueChange={onVipTypeChange} className="mt-3">
              <div className="grid grid-cols-2 gap-4">
                {/* Show hardcoded free option only if database free service price is 0 */}
                {freeServicePrice === 0 && (
                  <Card 
                    className={`cursor-pointer transition-all min-h-[120px] ${
                      selectedVipType === 'free' ? `ring-2 ring-offset-2 ${SERVICE_COLORS.free.split(' ').pop()}` : 'hover:shadow-md'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onVipTypeChange('free');
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="free" id="free" onClick={(e) => e.stopPropagation()} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Crown className={`h-5 w-5 ${selectedVipType === 'free' ? SERVICE_COLORS.free.split(' ')[0] : 'text-gray-400'}`} />
                              <Badge variant="outline" className={`text-base font-medium ${selectedVipType === 'free' ? SERVICE_COLORS.free : ''}`}>
                                {SERVICE_LABELS.free}
                              </Badge>
                            </div>
                            <span className="font-semibold text-lg">უფასო</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">სტანდარტული ხილვადობა</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* VIP Options - including database free service if it has a price > 0 */}
                {vipPricing.map((pricing) => {
                  const colorClass = SERVICE_COLORS[pricing.vipType as keyof typeof SERVICE_COLORS];
                  const label = SERVICE_LABELS[pricing.vipType as keyof typeof SERVICE_LABELS];
                  const IconComponent = SERVICE_ICONS[pricing.vipType as keyof typeof SERVICE_ICONS];
                  const isSelected = selectedVipType === pricing.vipType;
                  
                  return (
                    <Card 
                      key={pricing.id} 
                      className={`cursor-pointer transition-all min-h-[120px] ${
                        isSelected ? `ring-2 ring-offset-2 ${colorClass ? colorClass.split(' ').pop() : 'ring-blue-300'}` : 'hover:shadow-md'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        onVipTypeChange(pricing.vipType);
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={pricing.vipType} id={pricing.vipType} onClick={(e) => e.stopPropagation()} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <IconComponent className={`h-5 w-5 ${isSelected ? (colorClass ? colorClass.split(' ')[0] : 'text-blue-600') : 'text-gray-400'}`} />
                                <Badge variant="outline" className={`text-base font-medium ${isSelected ? (colorClass || '') : ''}`}>
                                  {label}
                                </Badge>
                              </div>
                              <span className="font-semibold text-lg">{pricing.pricePerDay.toFixed(2)}₾/დღე</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              {pricing.vipType === 'vip' && 'პრიორიტეტული ჩვენება VIP ნიშნით'}
                              {pricing.vipType === 'vip_plus' && 'გაუმჯობესებული VIP მაღალი პრიორიტეტით'}
                              {pricing.vipType === 'super_vip' && 'უმაღლესი დონის VIP პრემიუმ ადგილით'}
                            </p>
                            
                            {/* Day Selection for selected VIP */}
                            {isSelected && (
                              <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                                <Label className="text-sm font-medium">რამდენი დღით?</Label>
                                <Select 
                                  value={selectedVipDays.toString()} 
                                  onValueChange={(value) => onVipDaysChange(parseInt(value))}
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
            <Label className="text-base font-medium">დამატებითი სერვისები (არჩევითი)</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {additionalServices.map((service) => {
                const colorClass = SERVICE_COLORS[service.serviceType as keyof typeof SERVICE_COLORS];
                const label = SERVICE_LABELS[service.serviceType as keyof typeof SERVICE_LABELS];
                const IconComponent = SERVICE_ICONS[service.serviceType as keyof typeof SERVICE_ICONS];
                const isSelected = selectedServices.some(s => s.serviceType === service.serviceType);
                const selectedService = selectedServices.find(s => s.serviceType === service.serviceType);
                
                return (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all min-h-[120px] ${
                      isSelected ? `ring-2 ring-offset-2 ${colorClass ? colorClass.split(' ').pop() : 'ring-green-300'}` : 'hover:shadow-md'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isSelected) {
                        onServicesChange(selectedServices.filter(s => s.serviceType !== service.serviceType));
                      } else {
                        onServicesChange([...selectedServices, { serviceType: service.serviceType, days: 7 }]);
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id={service.serviceType}
                          checked={isSelected}
                          onChange={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className={`h-5 w-5 ${isSelected ? (colorClass ? colorClass.split(' ')[0] : 'text-green-600') : 'text-gray-400'}`} />
                              <Badge variant="outline" className={`text-base font-medium ${isSelected ? (colorClass || '') : ''}`}>
                                {label}
                              </Badge>
                            </div>
                            <span className="font-semibold text-lg">{service.pricePerDay.toFixed(2)}₾/დღე</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">
                            {service.serviceType === 'auto_renew' && 'ყოველდღიური ავტომატური განახლება'}
                            {service.serviceType === 'color_separation' && 'ფერადი ბორდერით გამოყოფა'}
                          </p>
                          
                          {/* Day Selection for selected service */}
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                              <Label className="text-sm font-medium">რამდენი დღით?</Label>
                              <Select 
                                value={(selectedService?.days || 7).toString()} 
                                onValueChange={(value) => {
                                  const updatedServices = selectedServices.map(s => 
                                    s.serviceType === service.serviceType 
                                      ? { ...s, days: parseInt(value) }
                                      : s
                                  );
                                  onServicesChange(updatedServices);
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
                        <span>{SERVICE_LABELS[selectedPricing.vipType as keyof typeof SERVICE_LABELS]}</span>
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
                  
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>სულ:</span>
                    <span className={!canAfford ? 'text-red-600' : 'text-green-600'}>
                      {totalCost.toFixed(2)}₾
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insufficient Balance Warning */}
          {!canAfford && totalCost > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">
                არასაკმარისი ბალანსი. საჭიროა ბალანსის შევსება.
              </span>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};