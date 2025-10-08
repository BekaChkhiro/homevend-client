import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { uploadApi } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Upload, X, Plus, AlertCircle, Image as ImageIcon, Trash2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  type: 'banner' | 'sidebar' | 'popup' | 'footer';
  dimensions: string;
  status: 'active' | 'inactive';
  price: number;
}

interface AddAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adData: any) => void;
  availablePlacements: AdPlacement[];
  selectedPlacementId?: string;
}

interface FormData {
  title: string;
  description: string;
  advertiser: string;
  placementId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  imageUrl: string;
  targetUrl: string;
}

export const AddAdvertisementModal = ({
  isOpen,
  onClose,
  onSubmit,
  availablePlacements,
  selectedPlacementId
}: AddAdvertisementModalProps) => {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    advertiser: '',
    placementId: selectedPlacementId || '',
    startDate: undefined,
    endDate: undefined,
    imageUrl: '',
    targetUrl: ''
  });

  // Update placementId when selectedPlacementId changes
  useEffect(() => {
    if (selectedPlacementId) {
      setFormData(prev => ({ ...prev, placementId: selectedPlacementId }));
    }
  }, [selectedPlacementId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const selectedPlacement = availablePlacements.find(p => p.id === formData.placementId);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image size must be less than 5MB' }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, imageUrl: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed' }));
      return;
    }

    setUploadedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.imageUrl) {
      setErrors(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageFile(null);
    setImagePreview('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t('addAdvertisementModal.validation.titleRequired');
    if (!formData.advertiser.trim()) newErrors.advertiser = t('addAdvertisementModal.validation.advertiserRequired');
    if (!formData.placementId) newErrors.placementId = t('addAdvertisementModal.validation.placementRequired');
    if (!formData.startDate) newErrors.startDate = t('addAdvertisementModal.validation.startDateRequired');
    if (!formData.endDate) newErrors.endDate = t('addAdvertisementModal.validation.endDateRequired');
    if (!uploadedImageFile && !imagePreview) newErrors.imageUrl = t('addAdvertisementModal.validation.imageRequired');
    if (!formData.targetUrl.trim()) newErrors.targetUrl = t('addAdvertisementModal.validation.targetUrlRequired');

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = t('addAdvertisementModal.validation.endDateAfterStart');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!uploadedImageFile) return;

    setIsSubmitting(true);
    setUploading(true);
    try {
      // Step 1: Create advertisement without imageUrl first (we'll add temporary URL)
      const adData = {
        title: formData.title,
        description: formData.description,
        advertiser: formData.advertiser,
        placementId: formData.placementId,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        imageUrl: 'temp', // Temporary value, will be updated after upload
        targetUrl: formData.targetUrl,
      };

      // This will call the parent's onSubmit which creates the ad and returns it
      const createdAd = await onSubmit(adData);

      // Step 2: Upload image with the real advertisement ID
      if (createdAd && createdAd.id) {
        const uploadResult = await uploadApi.uploadImages(
          'advertisement',
          createdAd.id,
          [uploadedImageFile],
          'ad_banner'
        );

        // The image is now uploaded and linked to the advertisement
        console.log('Image uploaded successfully:', uploadResult);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        advertiser: '',
        placementId: '',
        startDate: undefined,
        endDate: undefined,
        imageUrl: '',
        targetUrl: ''
      });
      handleRemoveImage();
      onClose();
    } catch (error) {
      console.error('Error submitting ad:', error);
      setErrors(prev => ({ ...prev, imageUrl: 'Failed to upload image' }));
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      advertiser: '',
      placementId: selectedPlacementId || '',
      startDate: undefined,
      endDate: undefined,
      imageUrl: '',
      targetUrl: ''
    });
    setErrors({});
    handleRemoveImage();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('addAdvertisementModal.title')}</DialogTitle>
          <DialogDescription>
            {t('addAdvertisementModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('addAdvertisementModal.fields.title')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('addAdvertisementModal.placeholders.title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="advertiser">{t('addAdvertisementModal.fields.advertiser')} *</Label>
              <Input
                id="advertiser"
                value={formData.advertiser}
                onChange={(e) => handleInputChange('advertiser', e.target.value)}
                placeholder={t('addAdvertisementModal.placeholders.advertiser')}
                className={errors.advertiser ? 'border-red-500' : ''}
              />
              {errors.advertiser && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.advertiser}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('addAdvertisementModal.fields.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('addAdvertisementModal.placeholders.description')}
              rows={3}
            />
          </div>

          {/* Placement Information - Read-only display when pre-selected */}
          {selectedPlacementId ? (
            <div className="space-y-2">
              <Label>{t('addAdvertisementModal.fields.placement')} *</Label>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-3">
                  <div className="text-white rounded-lg p-2 bg-blue-600">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">
                      {selectedPlacement?.name}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {selectedPlacement?.location}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {t('addAdvertisementModal.labels.dimensions')}: {selectedPlacement?.dimensions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>{t('addAdvertisementModal.fields.placement')} *</Label>
              <Select
                value={formData.placementId}
                onValueChange={(value) => handleInputChange('placementId', value)}
              >
                <SelectTrigger className={errors.placementId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('addAdvertisementModal.placeholders.placement')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePlacements.map((placement) => (
                    <SelectItem key={placement.id} value={placement.id}>
                      <div className="flex items-center w-full">
                        <span className="font-medium">{placement.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({placement.dimensions})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.placementId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.placementId}
                </p>
              )}
              {selectedPlacement && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>{t('addAdvertisementModal.labels.selectedPlacement')}:</strong> {selectedPlacement.location}
                  </p>
                  <p className="text-sm text-blue-600">
                    {t('addAdvertisementModal.labels.dimensions')}: {selectedPlacement.dimensions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('addAdvertisementModal.fields.startDate')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "dd MMMM yyyy", { locale: ka }) : t('addAdvertisementModal.placeholders.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleInputChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('addAdvertisementModal.fields.endDate')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "dd MMMM yyyy", { locale: ka }) : t('addAdvertisementModal.placeholders.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleInputChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>{t('addAdvertisementModal.fields.imageUrl')} *</Label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Advertisement Preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={uploading || isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Upload Area */}
            {!imagePreview && (
              <div className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors",
                errors.imageUrl && "border-red-500"
              )}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading || isSubmitting}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP, GIF up to 5MB
                  </p>
                </label>
              </div>
            )}

            {/* Upload Progress - shown during submission */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4 animate-pulse" />
                  <span>Uploading image...</span>
                </div>
              </div>
            )}

            {/* Form Validation Error */}
            {errors.imageUrl && !imagePreview && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.imageUrl}
              </p>
            )}
          </div>

          {/* Target URL */}
          <div className="space-y-2">
            <Label htmlFor="targetUrl">{t('addAdvertisementModal.fields.targetUrl')} *</Label>
            <Input
                id="targetUrl"
                value={formData.targetUrl}
                onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                placeholder="https://example.com"
                className={errors.targetUrl ? 'border-red-500' : ''}
              />
            {errors.targetUrl && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.targetUrl}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('addAdvertisementModal.buttons.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};