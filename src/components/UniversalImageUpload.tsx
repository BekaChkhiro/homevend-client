import React, { useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useUniversalImageUpload,
  EntityType,
} from '@/hooks/useUniversalImageUpload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import {
  X,
  Upload,
  Star,
  GripVertical,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversalImageUploadProps {
  entityType: EntityType;
  entityId: number;
  purpose?: string;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  showPrimary?: boolean;
  showCaptions?: boolean;
  onImagesChange?: (images: any[]) => void;
}

// Sortable Image Item Component
const SortableImageItem: React.FC<{
  image: any;
  onDelete: () => void;
  onSetPrimary: () => void;
  showPrimary: boolean;
}> = ({ image, onDelete, onSetPrimary, showPrimary }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border bg-white"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
      >
        <div className="bg-white rounded p-1 shadow-lg">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Primary Badge */}
      {showPrimary && image.isPrimary && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Primary
          </div>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-gray-100">
        <img
          src={image.urls.thumbnail || image.urls.medium || image.urls.original}
          alt={image.altText || ''}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
        {showPrimary && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onSetPrimary}
            disabled={image.isPrimary}
          >
            <Star className={cn('h-4 w-4', image.isPrimary && 'fill-current')} />
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const UniversalImageUpload: React.FC<UniversalImageUploadProps> = ({
  entityType,
  entityId,
  purpose = 'gallery',
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  disabled = false,
  showPrimary = true,
  showCaptions = false,
  onImagesChange,
}) => {
  const {
    images,
    uploading,
    uploadProgress,
    errors,
    uploadImages,
    deleteImage,
    reorderImages,
    setPrimaryImage,
    fetchImages,
    clearErrors,
  } = useUniversalImageUpload({
    entityType,
    entityId,
    purpose,
    maxFiles,
    maxSize,
    acceptedTypes,
    onSuccess: onImagesChange,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await uploadImages(acceptedFiles);
    },
    [uploadImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - images.length,
    disabled: disabled || uploading || images.length >= maxFiles,
  });

  const handleDelete = async (imageId: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      console.log('Attempting to delete image with ID:', imageId);
      console.log('Entity type:', entityType, 'Entity ID:', entityId);
      const success = await deleteImage(imageId);
      if (success) {
        console.log('Image deleted successfully');
        // Trigger callback to parent component
        const remainingImages = images.filter(img => img.id !== imageId);
        onImagesChange?.(remainingImages);
      } else {
        console.error('Failed to delete image');
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        await reorderImages(newImages.map((img) => img.id));
      }
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
            isDragActive && 'border-primary bg-primary/5',
            (uploading || disabled) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400 mb-4" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          )}
          
          {isDragActive ? (
            <p className="text-lg">Drop the files here...</p>
          ) : (
            <>
              <p className="text-lg mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                {maxFiles - images.length} of {maxFiles} slots available
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Max {maxSize}MB per file
              </p>
            </>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="truncate max-w-xs">{fileName}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </Card>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-1">Upload Errors</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearErrors}
                className="mt-2"
              >
                Clear errors
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">
            Uploaded Files ({images.length}/{maxFiles})
          </h4>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <SortableImageItem
                    key={image.id}
                    image={image}
                    onDelete={() => handleDelete(image.id)}
                    onSetPrimary={() => setPrimaryImage(image.id)}
                    showPrimary={showPrimary}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <Card className="p-8 text-center text-gray-500">
          <ImageIcon className="mx-auto h-12 w-12 mb-4 text-gray-300" />
          <p>No files uploaded yet</p>
        </Card>
      )}
    </div>
  );
};