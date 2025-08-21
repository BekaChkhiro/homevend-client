import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, AlertCircle } from 'lucide-react';
import { vipApi, balanceApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface VipPricing {
  id: number;
  vipType: string;
  pricePerDay: number;
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
}

const VIP_COLORS = {
  vip: 'text-blue-600 bg-blue-50 border-blue-200 ring-blue-300',
  vip_plus: 'text-purple-600 bg-purple-50 border-purple-200 ring-purple-300', 
  super_vip: 'text-yellow-600 bg-yellow-50 border-yellow-200 ring-yellow-300'
};

const VIP_LABELS = {
  vip: 'VIP',
  vip_plus: 'VIP+',
  super_vip: 'SUPER VIP'
};

export const VipPurchaseModal: React.FC<VipPurchaseModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onSuccess
}) => {
  const [vipPricing, setVipPricing] = useState<VipPricing[]>([]);
  const [selectedVipType, setSelectedVipType] = useState<string>('');
  const [days, setDays] = useState<string>('7');
  const [loading, setLoading] = useState(false);
  const [fetchingPricing, setFetchingPricing] = useState(true);
  const [userBalance, setUserBalance] = useState<number>(0);
  const { toast } = useToast();

  const selectedPricing = vipPricing.find(p => p.vipType === selectedVipType);
  const totalCost = selectedPricing ? selectedPricing.pricePerDay * parseInt(days || '1') : 0;
  const canAfford = userBalance >= totalCost;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setFetchingPricing(true);
      const [pricingData, balanceData] = await Promise.all([
        vipApi.getPricing(),
        balanceApi.getBalance()
      ]);
      
      setVipPricing(pricingData.filter((p: VipPricing) => p.vipType !== 'none'));
      setUserBalance(balanceData.balance);
      
      if (pricingData.length > 0) {
        setSelectedVipType(pricingData[0].vipType);
      }
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
    if (!propertyId || !selectedVipType || !days) {
      toast({
        title: "შეცდომა", 
        description: "გთხოვთ აირჩიოთ ყველა ველი",
        variant: "destructive",
      });
      return;
    }

    const daysNum = parseInt(days);
    if (daysNum < 1 || daysNum > 30) {
      toast({
        title: "შეცდომა",
        description: "დღეების რაოდენობა უნდა იყოს 1-დან 30-მდე",
        variant: "destructive",
      });
      return;
    }

    if (!canAfford) {
      toast({
        title: "არასაკმარისი ბალანსი",
        description: `საჭიროა ${totalCost.toFixed(2)}₾, ხელმისაწვდომია ${userBalance.toFixed(2)}₾`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await vipApi.purchaseVipStatus(propertyId, selectedVipType, daysNum);
      
      toast({
        title: "წარმატება!",
        description: `VIP სტატუსი წარმატებით შეძენილია ${daysNum} დღით`,
      });

      onSuccess?.(result);
      onClose();
    } catch (error: any) {
      console.error('VIP purchase error:', error);
      const errorMessage = error.response?.data?.message || 'VIP სტატუსის შეძენა ვერ მოხერხდა';
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
              <RadioGroup value={selectedVipType} onValueChange={setSelectedVipType} className="mt-2">
                <div className="grid gap-3">
                  {vipPricing.map((pricing) => {
                    const colorClass = VIP_COLORS[pricing.vipType as keyof typeof VIP_COLORS];
                    const label = VIP_LABELS[pricing.vipType as keyof typeof VIP_LABELS];
                    const isSelected = selectedVipType === pricing.vipType;
                    
                    return (
                      <Card 
                        key={pricing.id} 
                        className={`cursor-pointer transition-all ${
                          isSelected ? `ring-2 ring-offset-2 ${colorClass.split(' ').pop()}` : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedVipType(pricing.vipType)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={pricing.vipType} id={pricing.vipType} className="mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Crown className={`h-4 w-4 ${isSelected ? colorClass.split(' ')[0] : 'text-gray-400'}`} />
                                <Badge variant="outline" className={`text-xs ${isSelected ? colorClass : ''}`}>
                                  {label}
                                </Badge>
                                <span className="font-semibold">{pricing.pricePerDay.toFixed(2)}₾/დღე</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pricing.descriptionKa}</p>
                              {pricing.features && pricing.features.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {pricing.features.slice(0, 3).map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs py-0 px-1">
                                      {feature}
                                    </Badge>
                                  ))}
                                  {pricing.features.length > 3 && (
                                    <Badge variant="secondary" className="text-xs py-0 px-1">+{pricing.features.length - 3}</Badge>
                                  )}
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

            {/* Duration Selection */}
            <div>
              <Label htmlFor="days" className="text-sm font-medium">
                რამდენი დღით გსურთ VIP სტატუსი?
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-24"
                  placeholder="დღე"
                />
                <span className="text-xs text-gray-500">მინ: 1, მაქს: 30 დღე</span>
              </div>
            </div>

            {/* Cost Summary */}
            {selectedPricing && days && (
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>VIP პაკეტი:</span>
                      <span>{VIP_LABELS[selectedPricing.vipType as keyof typeof VIP_LABELS]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ფასი დღეში:</span>
                      <span>{selectedPricing.pricePerDay.toFixed(2)}₾</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>დღეების რაოდენობა:</span>
                      <span>{days} დღე</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-semibold">
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
              <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 text-xs">
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
                disabled={loading || !canAfford || !selectedVipType || !days}
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