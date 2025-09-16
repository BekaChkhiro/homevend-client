import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UniversalImageUpload } from "@/components/UniversalImageUpload";
import { Camera, Info, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhotoGallerySectionProps {
  projectId?: number;
  images?: File[]; // For local state before project is created  
  onImagesChange?: (images: any[]) => void;
  onPendingImagesChange?: (files: File[]) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ 
  projectId,
  images: localImages,
  onImagesChange,
  onPendingImagesChange
}) => {
  const { t } = useTranslation(['projectForm', 'common']);
  const [pendingImages, setPendingImages] = useState<File[]>(localImages || []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
      file.size <= 15 * 1024 * 1024 // 15MB
    );
    
    const newPendingImages = [...(localImages || pendingImages), ...validFiles].slice(0, 30);
    setPendingImages(newPendingImages);
    onPendingImagesChange?.(newPendingImages);
  };

  const removePendingImage = (index: number) => {
    const newPendingImages = (localImages || pendingImages).filter((_, i) => i !== index);
    setPendingImages(newPendingImages);
    onPendingImagesChange?.(newPendingImages);
  };

  // If no projectId, show temporary image selection
  if (!projectId) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-2 border-b pb-3 mb-2">
          <Camera className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('projectForm.photoGallery.title')}</h3>
        </div>

        <div className="rounded-md border border-border p-5 space-y-6">
          {/* Temporary Image Upload */}
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP up to 15MB each (max 15 files)
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
            {(localImages || pendingImages).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(localImages || pendingImages).map((file, index) => (
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

            {(localImages || pendingImages).length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {(localImages || pendingImages).length} image{(localImages || pendingImages).length !== 1 ? 's' : ''} selected. 
                  They will be uploaded when you save the project.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h5 className="font-medium mb-2">{t('projectForm.photoGallery.recommendations.title')}</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('projectForm.photoGallery.recommendations.highQuality')}</li>
              <li>• {t('projectForm.photoGallery.recommendations.differentAngles')}</li>
              <li>• {t('projectForm.photoGallery.recommendations.allBuildings')}</li>
              <li>• {t('projectForm.photoGallery.recommendations.maxFileSize')}</li>
              <li>• {t('projectForm.photoGallery.recommendations.supportedFormats')}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('projectForm.photoGallery.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5 space-y-6">
        {/* AWS S3 Universal Image Upload Component */}
        <UniversalImageUpload
          entityType="project"
          entityId={projectId}
          purpose="project_gallery"
          maxFiles={15}
          maxSize={15}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          showPrimary={true}
          onImagesChange={(images) => {
            console.log('Project images uploaded:', images);
            onImagesChange?.(images);
          }}
        />

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium mb-2">{t('projectForm.photoGallery.recommendations.title')}</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('projectForm.photoGallery.recommendations.highQuality')}</li>
            <li>• {t('projectForm.photoGallery.recommendations.differentAngles')}</li>
            <li>• {t('projectForm.photoGallery.recommendations.allBuildings')}</li>
            <li>• {t('projectForm.photoGallery.recommendations.maxFileSize')}</li>
            <li>• {t('projectForm.photoGallery.recommendations.supportedFormats')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};