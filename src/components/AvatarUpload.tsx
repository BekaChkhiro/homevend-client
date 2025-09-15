import React, { useEffect } from 'react';
import { UniversalImageUpload } from './UniversalImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useUniversalImageUpload } from '@/hooks/useUniversalImageUpload';

interface AvatarUploadProps {
  userId: number;
  currentAvatarUrl?: string;
  onAvatarChange?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40',
};

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentAvatarUrl,
  onAvatarChange,
  size = 'lg',
}) => {
  const { images, uploadImages, deleteImage, fetchImages } = useUniversalImageUpload({
    entityType: 'user',
    entityId: userId,
    purpose: 'user_avatar',
    maxFiles: 1,
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    onSuccess: (uploaded) => {
      if (uploaded[0]) {
        onAvatarChange?.(uploaded[0].urls.medium || uploaded[0].urls.original);
      }
    },
  });

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadImages(Array.from(files));
    }
  };

  const handleDelete = async () => {
    if (images[0] && confirm('Remove profile picture?')) {
      await deleteImage(images[0].id);
      onAvatarChange?.('');
    }
  };

  const avatarUrl = images[0]?.urls.medium || currentAvatarUrl;

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <Camera className="h-8 w-8 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute bottom-0 right-0 flex space-x-1">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full p-2"
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
        
        {avatarUrl && (
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full p-2"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};