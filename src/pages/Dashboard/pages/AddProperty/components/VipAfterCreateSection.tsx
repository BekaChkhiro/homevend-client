import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, CreditCard, Sparkles } from 'lucide-react';
import { VipPurchaseModal } from '@/components/VipPurchaseModal';
import { useBalanceRefresh } from '../../Dashboard';

interface VipAfterCreateSectionProps {
  propertyId?: number;
  propertyTitle?: string;
  onVipPurchased?: () => void;
}

export const VipAfterCreateSection: React.FC<VipAfterCreateSectionProps> = ({
  propertyId,
  propertyTitle,
  onVipPurchased
}) => {
  const [showVipModal, setShowVipModal] = useState(false);
  const refreshBalance = useBalanceRefresh();

  if (!propertyId) return null;

  const handleVipSuccess = () => {
    setShowVipModal(false);
    onVipPurchased?.();
  };

  const handleSkip = () => {
    onVipPurchased?.();
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">გაზარდეთ თქვენი განცხადების ხილვადობა</h3>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              VIP სტატუსი და დამატებითი სერვისები
            </CardTitle>
            <CardDescription>
              განცხადება: {propertyTitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {/* VIP Benefits */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  VIP უპირატესობები:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-6">
                  <li>• პრიორიტეტული ჩვენება ძებნის შედეგებში</li>
                  <li>• VIP ნიშნით გამოყოფა</li>
                  <li>• მეტი ნახვა და კონტაქტი</li>
                </ul>
              </div>

              {/* Additional Services */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  დამატებითი სერვისები:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-6">
                  <li>• ავტო განახლება - ყოველდღიური ავტომატური განახლება</li>
                  <li>• ფერადი გამოყოფა - ფერადი ბორდერით გამოყოფა</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                უფასო სტატუსით გაგრძელება
              </Button>
              <Button 
                onClick={() => setShowVipModal(true)}
                className="flex-1"
              >
                <Crown className="h-4 w-4 mr-2" />
                სერვისების არჩევა
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VIP Purchase Modal */}
      <VipPurchaseModal
        isOpen={showVipModal}
        onClose={() => setShowVipModal(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        onSuccess={handleVipSuccess}
        onBalanceChange={refreshBalance}
      />
    </>
  );
};