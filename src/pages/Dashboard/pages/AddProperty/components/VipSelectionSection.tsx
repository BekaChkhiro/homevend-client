import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Crown, AlertCircle } from 'lucide-react';

const VIP_COLORS = {
  free: 'text-gray-600 bg-gray-50 border-gray-200 ring-gray-300',
  vip: 'text-blue-600 bg-blue-50 border-blue-200 ring-blue-300',
  vip_plus: 'text-purple-600 bg-purple-50 border-purple-200 ring-purple-300', 
  super_vip: 'text-yellow-600 bg-yellow-50 border-yellow-200 ring-yellow-300'
};

const VIP_LABELS = {
  free: 'უფასო განცხადება',
  vip: 'VIP',
  vip_plus: 'VIP+',
  super_vip: 'SUPER VIP'
};

interface VipSelectionSectionProps {
  selectedVipType: string;
  selectedDays: string;
  onVipTypeChange: (vipType: string) => void;
  onDaysChange: (days: string) => void;
  userBalance: number;
  vipPricing: any[];
}

export const VipSelectionSection: React.FC<VipSelectionSectionProps> = ({
  selectedVipType,
  selectedDays,
  onVipTypeChange,
  onDaysChange,
  userBalance,
  vipPricing
}) => {
  const selectedPricing = vipPricing.find(p => p.vipType === selectedVipType);
  const totalCost = selectedPricing ? selectedPricing.pricePerDay * parseInt(selectedDays || '1') : 0;
  const canAfford = userBalance >= totalCost;

  return (
    <div className="space-y-2">
      <h3 className="text-base sm:text-lg font-medium">VIP სტატუსი</h3>
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg">VIP სტატუსის შერჩევა</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
          {/* Balance Display */}
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <span className="text-xs sm:text-sm text-gray-600">თქვენი ბალანსი:</span>
            <span className="font-semibold text-base sm:text-lg">{userBalance.toFixed(2)}₾</span>
          </div>

          {/* VIP Package Selection */}
          <div>
            <Label className="text-sm sm:text-base font-medium">აირჩიეთ VIP პაკეტი</Label>
            <RadioGroup value={selectedVipType} onValueChange={onVipTypeChange} className="mt-3">
              <div className="grid gap-2 sm:gap-3 md:gap-4">
                {/* Free Option */}
                <Card 
                  className={`cursor-pointer transition-all touch-manipulation ${
                    selectedVipType === 'free' ? `ring-2 ring-offset-2 ${VIP_COLORS.free.split(' ').pop()}` : 'hover:shadow-md'
                  }`}
                  onClick={() => onVipTypeChange('free')}
                >
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <RadioGroupItem value="free" id="free" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <Crown className={`h-5 w-5 ${selectedVipType === 'free' ? VIP_COLORS.free.split(' ')[0] : 'text-gray-400'}`} />
                          <Badge variant="outline" className={selectedVipType === 'free' ? VIP_COLORS.free : ''}>
                            {VIP_LABELS.free}
                          </Badge>
                          <span className="font-semibold text-lg">0₾</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">განცხადება იქნება გამოქვეყნებული სტანდარტული ხილვადობით</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* VIP Options */}
                {vipPricing.map((pricing) => {
                  const colorClass = VIP_COLORS[pricing.vipType as keyof typeof VIP_COLORS];
                  const label = VIP_LABELS[pricing.vipType as keyof typeof VIP_LABELS];
                  const isSelected = selectedVipType === pricing.vipType;
                  
                  return (
                    <Card 
                      key={pricing.id} 
                      className={`cursor-pointer transition-all touch-manipulation ${
                        isSelected ? `ring-2 ring-offset-2 ${colorClass.split(' ').pop()}` : 'hover:shadow-md'
                      }`}
                      onClick={() => onVipTypeChange(pricing.vipType)}
                    >
                      <CardContent className="p-2 sm:p-3 md:p-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <RadioGroupItem value={pricing.vipType} id={pricing.vipType} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <Crown className={`h-5 w-5 ${isSelected ? colorClass.split(' ')[0] : 'text-gray-400'}`} />
                              <Badge variant="outline" className={isSelected ? colorClass : ''}>
                                {label}
                              </Badge>
                              <span className="font-semibold text-lg">{pricing.pricePerDay.toFixed(2)}₾/დღე</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{pricing.descriptionKa}</p>
                            {pricing.features && pricing.features.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {pricing.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
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

          {/* Duration Selection - only show if not 'free' */}
          {selectedVipType !== 'free' && (
            <div>
              <Label htmlFor="days" className="text-sm sm:text-base font-medium">
                რამდენი დღით გსურთ VIP სტატუსი?
              </Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="30"
                value={selectedDays}
                onChange={(e) => onDaysChange(e.target.value)}
                className="mt-2 h-11 sm:h-12 text-sm sm:text-base"
                placeholder="მაქსიმუმ 30 დღე"
              />
              <p className="text-xs text-gray-500 mt-1">მინიმუმ 1 დღე, მაქსიმუმ 30 დღე</p>
            </div>
          )}

          {/* Cost Summary - only show if not 'free' */}
          {selectedPricing && selectedDays && selectedVipType !== 'free' && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>VIP პაკეტი:</span>
                    <span>{VIP_LABELS[selectedPricing.vipType as keyof typeof VIP_LABELS]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ფასი დღეში:</span>
                    <span>{selectedPricing.pricePerDay.toFixed(2)}₾</span>
                  </div>
                  <div className="flex justify-between">
                    <span>დღეების რაოდენობა:</span>
                    <span>{selectedDays} დღე</span>
                  </div>
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

          {/* Insufficient Balance Warning - only show if not 'free' */}
          {!canAfford && totalCost > 0 && selectedVipType !== 'free' && (
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