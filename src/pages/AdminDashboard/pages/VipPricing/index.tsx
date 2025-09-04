import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Crown, Save, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminVipApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface VipPricing {
  id: number;
  vipType: string;
  pricePerDay: number;
  descriptionKa: string;
  descriptionEn: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const VIP_COLORS = {
  vip: 'text-blue-600 bg-blue-50 border-blue-200',
  vip_plus: 'text-purple-600 bg-purple-50 border-purple-200',
  super_vip: 'text-yellow-600 bg-yellow-50 border-yellow-200'
};

const VIP_LABELS = {
  vip: 'VIP',
  vip_plus: 'VIP+',
  super_vip: 'SUPER VIP'
};

export const VipPricingPage = () => {
  const { t } = useTranslation();
  const [vipPricing, setVipPricing] = useState<VipPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<number, Partial<VipPricing>>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchVipPricing();
  }, []);

  const fetchVipPricing = async () => {
    try {
      setLoading(true);
      const data = await adminVipApi.getAllVipPricing();
      setVipPricing(data.filter((p: VipPricing) => p.vipType !== 'none'));
    } catch (error) {
      console.error('Error fetching VIP pricing:', error);
      toast({
        title: t('common.error'),
        description: t('vipPricing.messages.errorLoading'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (pricingId: number, field: keyof VipPricing, value: any) => {
    setEditData(prev => ({
      ...prev,
      [pricingId]: {
        ...prev[pricingId],
        [field]: value
      }
    }));
  };

  const handleFeaturesChange = (pricingId: number, featuresString: string) => {
    const features = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0);
    handleInputChange(pricingId, 'features', features);
  };

  const getCurrentValue = (pricing: VipPricing, field: keyof VipPricing) => {
    return editData[pricing.id]?.[field] !== undefined 
      ? editData[pricing.id][field] 
      : pricing[field];
  };

  const hasChanges = (pricingId: number) => {
    return editData[pricingId] && Object.keys(editData[pricingId]).length > 0;
  };

  const handleSave = async (pricing: VipPricing) => {
    if (!hasChanges(pricing.id)) return;

    setSaving(pricing.id);
    try {
      const changes = editData[pricing.id];
      const updatedPricing = await adminVipApi.updateVipPricing(pricing.id, changes);
      
      // Update local state
      setVipPricing(prev => prev.map(p => 
        p.id === pricing.id 
          ? { ...p, ...updatedPricing }
          : p
      ));
      
      // Clear edit data for this pricing
      setEditData(prev => {
        const newData = { ...prev };
        delete newData[pricing.id];
        return newData;
      });

      toast({
        title: t('common.success'),
        description: t('vipPricing.messages.updated'),
      });
    } catch (error: any) {
      console.error('Error saving VIP pricing:', error);
      const errorMessage = error.response?.data?.message || t('vipPricing.messages.errorUpdating');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleReset = (pricingId: number) => {
    setEditData(prev => {
      const newData = { ...prev };
      delete newData[pricingId];
      return newData;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('vipPricing.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('vipPricing.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {vipPricing.map((pricing) => {
          const colorClass = VIP_COLORS[pricing.vipType as keyof typeof VIP_COLORS];
          const label = VIP_LABELS[pricing.vipType as keyof typeof VIP_LABELS];
          const isEdited = hasChanges(pricing.id);
          const isSaving = saving === pricing.id;

          return (
            <Card key={pricing.id} className={`${isEdited ? 'ring-2 ring-blue-200' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className={`h-6 w-6 ${colorClass.split(' ')[0]}`} />
                    <CardTitle>{label}</CardTitle>
                    <Badge variant="outline" className={colorClass}>
                      {pricing.vipType}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={getCurrentValue(pricing, 'isActive') as boolean}
                      onCheckedChange={(checked) => handleInputChange(pricing.id, 'isActive', checked)}
                    />
                    <span className="text-sm text-gray-500">
                      {getCurrentValue(pricing, 'isActive') ? t('vipPricing.status.active') : t('vipPricing.status.inactive')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price */}
                <div>
                  <Label htmlFor={`price-${pricing.id}`}>{t('vipPricing.labels.pricePerDay')}</Label>
                  <Input
                    id={`price-${pricing.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={getCurrentValue(pricing, 'pricePerDay') as number}
                    onChange={(e) => handleInputChange(pricing.id, 'pricePerDay', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                {/* Georgian Description */}
                <div>
                  <Label htmlFor={`desc-ka-${pricing.id}`}>{t('vipPricing.labels.descriptionKa')}</Label>
                  <Textarea
                    id={`desc-ka-${pricing.id}`}
                    value={getCurrentValue(pricing, 'descriptionKa') as string || ''}
                    onChange={(e) => handleInputChange(pricing.id, 'descriptionKa', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                {/* English Description */}
                <div>
                  <Label htmlFor={`desc-en-${pricing.id}`}>{t('vipPricing.labels.descriptionEn')}</Label>
                  <Textarea
                    id={`desc-en-${pricing.id}`}
                    value={getCurrentValue(pricing, 'descriptionEn') as string || ''}
                    onChange={(e) => handleInputChange(pricing.id, 'descriptionEn', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                {/* Features */}
                <div>
                  <Label htmlFor={`features-${pricing.id}`}>{t('vipPricing.labels.features')}</Label>
                  <Input
                    id={`features-${pricing.id}`}
                    value={(getCurrentValue(pricing, 'features') as string[] || []).join(', ')}
                    onChange={(e) => handleFeaturesChange(pricing.id, e.target.value)}
                    className="mt-1"
                    placeholder={t('vipPricing.placeholders.features')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('vipPricing.labels.example')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  {isEdited && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReset(pricing.id)}
                        disabled={isSaving}
                      >
{t('common.cancel')}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(pricing)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
{t('common.save')}
                      </Button>
                    </>
                  )}
                </div>

                {/* Change Indicator */}
                {isEdited && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>{t('vipPricing.messages.unsaved')}</span>
                  </div>
                )}

                {/* Last Updated */}
                <div className="text-xs text-gray-500 border-t pt-2">
                  {t('vipPricing.labels.lastUpdated')}: {new Date(pricing.updatedAt).toLocaleString('ka-GE')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};