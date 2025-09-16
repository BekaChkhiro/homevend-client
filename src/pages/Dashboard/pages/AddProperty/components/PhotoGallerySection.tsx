import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UniversalImageUpload } from "@/components/UniversalImageUpload";
import { Camera, Info, Upload, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhotoGallerySectionProps {
  propertyId?: number;
  projectId?: number;
  entityType?: "property" | "project";
  onImagesChange?: (images: any[]) => void;
  onPendingImagesChange?: (files: File[]) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ 
  propertyId,
  projectId,
  entityType = "property",
  onImagesChange,
  onPendingImagesChange
}) => {
  const { t } = useTranslation(['userDashboard', 'admin', 'imageUpload']);
  const [pendingImages, setPendingImages] = useState<File[]>([]);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
      file.size <= 15 * 1024 * 1024 // 15MB
    );
    
    const newPendingImages = [...pendingImages, ...validFiles].slice(0, 15);
    setPendingImages(newPendingImages);
    onPendingImagesChange?.(newPendingImages);
  };

  const removePendingImage = (index: number) => {
    const newPendingImages = pendingImages.filter((_, i) => i !== index);
    setPendingImages(newPendingImages);
    onPendingImagesChange?.(newPendingImages);
  };

  // Get the actual entity ID and type
  const entityId = entityType === "project" ? projectId : propertyId;
  
  // If no entity ID, show temporary image selection
  if (!entityId) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-2 border-b pb-3 mb-2">
          <Camera className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('imageUpload:photoGallery.title')}</h3>
        </div>

        <div className="rounded-md border border-border p-5 space-y-6">
          {/* Temporary Image Upload */}
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('imageUpload:photoGallery.selectImages')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('imageUpload:photoGallery.supportedFormats')}
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {/* Preview Selected Images */}
            {pendingImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pendingImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePendingImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingImages.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('imageUpload:photoGallery.imagesSelected', { 
                    count: pendingImages.length, 
                    plural: pendingImages.length !== 1 ? 's' : '' 
                  })}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium mb-2">{t('imageUpload:photoGallery.recommendations')}:</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('imageUpload:photoGallery.rec1')}</li>
            <li>• {t('imageUpload:photoGallery.rec2')}</li>
            <li>• {t('imageUpload:photoGallery.rec3')}</li>
            <li>• {t('imageUpload:photoGallery.rec4')}</li>
            <li>• {t('imageUpload:photoGallery.rec5')}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('imageUpload:photoGallery.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5 space-y-6">
        {/* AWS S3 Universal Image Upload Component */}
        <UniversalImageUpload
          entityType={entityType}
          entityId={entityId}
          purpose={`${entityType}_gallery`}
          maxFiles={15}
          maxSize={15}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          showPrimary={true}
          onImagesChange={(images) => {
            console.log(`${entityType} images uploaded:`, images);
            onImagesChange?.(images);
          }}
        />

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium mb-2">{t('imageUpload:photoGallery.recommendations')}:</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('imageUpload:photoGallery.rec1')}</li>
            <li>• {t('imageUpload:photoGallery.rec2')}</li>
            <li>• {t('imageUpload:photoGallery.rec3')}</li>
            <li>• {t('imageUpload:photoGallery.rec4')}</li>
            <li>• {t('imageUpload:photoGallery.rec5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};