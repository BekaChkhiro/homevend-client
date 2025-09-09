import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X, Image } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PhotoGallerySectionProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  images,
  onImagesChange,
}) => {
  const { t } = useTranslation(['projectForm', 'common']);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      onImagesChange([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('projectForm.photoGallery.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5 space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">{t('projectForm.photoGallery.uploadTitle')}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t('projectForm.photoGallery.uploadDescription')}
              </p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="project-photo-upload"
              />
              <Label htmlFor="project-photo-upload" asChild>
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('projectForm.photoGallery.selectPhotos')}
                </Button>
              </Label>
            </div>
          </div>
        </div>

        {/* Uploaded Images Preview */}
        {images.length > 0 && (
          <div className="space-y-4">
            <Label className="font-medium flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span>{t('projectForm.photoGallery.uploadedPhotos')} ({images.length})</span>
            </Label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img
                      src={getImagePreview(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="mt-2 text-xs text-muted-foreground truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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