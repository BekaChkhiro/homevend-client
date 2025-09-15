import { useState, useCallback } from 'react';
import axios, { AxiosProgressEvent } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export type EntityType = 
  | 'property' 
  | 'user' 
  | 'agency' 
  | 'project' 
  | 'advertisement' 
  | 'district'
  | 'developer';

export interface UploadConfig {
  entityType: EntityType;
  entityId: number;
  purpose?: string;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  onSuccess?: (images: any[]) => void;
  onError?: (error: string) => void;
}

export interface UploadedImage {
  id: number;
  urls: {
    original: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
    [key: string]: string | undefined;
  };
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  altText?: string;
  caption?: string;
  tags: string[];
  isPrimary: boolean;
  sortOrder: number;
  fileName: string;
  originalName: string;
}

export const useUniversalImageUpload = (config: UploadConfig) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Create axios instance with auth header
  const createAxiosInstance = () => {
    const token = localStorage.getItem('token'); // Fixed: use same key as main API
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  };

  // Fetch existing images
  const fetchImages = useCallback(async () => {
    try {
      const api = createAxiosInstance();
      const response = await api.get(
        `/upload/${config.entityType}/${config.entityId}/images`,
        {
          params: { purpose: config.purpose },
        }
      );
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  }, [config.entityType, config.entityId, config.purpose]);

  // Upload images
  const uploadImages = useCallback(
    async (files: File[]) => {
      setUploading(true);
      setErrors([]);
      const progress: Record<string, number> = {};

      // Validate files
      const validFiles = files.filter((file) => {
        // Size check
        if (config.maxSize && file.size > config.maxSize * 1024 * 1024) {
          setErrors((prev) => [
            ...prev,
            `${file.name} exceeds ${config.maxSize}MB limit`,
          ]);
          return false;
        }

        // Type check
        if (
          config.acceptedTypes &&
          !config.acceptedTypes.includes(file.type)
        ) {
          setErrors((prev) => [
            ...prev,
            `${file.name} has invalid type`,
          ]);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        setUploading(false);
        return [];
      }

      // Check max files limit
      if (config.maxFiles && images.length + validFiles.length > config.maxFiles) {
        setErrors([`Maximum ${config.maxFiles} files allowed`]);
        setUploading(false);
        return [];
      }

      try {
        const api = createAxiosInstance();
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append('images', file);
          progress[file.name] = 0;
        });
        
        if (config.purpose) {
          formData.append('purpose', config.purpose);
        }

        setUploadProgress(progress);

        const response = await api.post(
          `/upload/${config.entityType}/${config.entityId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (event: AxiosProgressEvent) => {
              if (event.total) {
                const percentCompleted = Math.round(
                  (event.loaded * 100) / event.total
                );
                
                // Update progress for all files proportionally
                const newProgress: Record<string, number> = {};
                Object.keys(progress).forEach((fileName) => {
                  newProgress[fileName] = percentCompleted;
                });
                setUploadProgress(newProgress);
              }
            },
          }
        );

        const uploadedImages = response.data.images;
        setImages((prev) => [...prev, ...uploadedImages]);
        
        config.onSuccess?.(uploadedImages);
        
        return uploadedImages;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Upload failed';
        setErrors([errorMessage]);
        config.onError?.(errorMessage);
        return [];
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress({}), 2000);
      }
    },
    [config, images]
  );

  // Delete image
  const deleteImage = useCallback(
    async (imageId: number) => {
      try {
        console.log('Deleting image with ID:', imageId);
        const api = createAxiosInstance();
        const response = await api.delete(`/upload/image/${imageId}`);
        console.log('Delete response:', response.status, response.data);
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        return true;
      } catch (error: any) {
        console.error('Failed to delete image:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete image';
        setErrors([errorMessage]);
        return false;
      }
    },
    []
  );

  // Reorder images
  const reorderImages = useCallback(
    async (imageIds: number[]) => {
      try {
        const api = createAxiosInstance();
        const imageOrders = imageIds.map((id, index) => ({
          imageId: id,
          sortOrder: index,
        }));

        await api.put(
          `/upload/${config.entityType}/${config.entityId}/reorder`,
          {
            purpose: config.purpose,
            imageOrders,
          }
        );

        // Update local state
        const reordered = imageIds
          .map((id) => images.find((img) => img.id === id))
          .filter(Boolean) as UploadedImage[];
        
        setImages(reordered);
        return true;
      } catch (error) {
        console.error('Failed to reorder images:', error);
        setErrors(['Failed to reorder images']);
        return false;
      }
    },
    [config, images]
  );

  // Set primary image
  const setPrimaryImage = useCallback(
    async (imageId: number) => {
      try {
        const api = createAxiosInstance();
        await api.put(`/upload/image/${imageId}/set-primary`);
        
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        );
        
        return true;
      } catch (error) {
        console.error('Failed to set primary image:', error);
        setErrors(['Failed to set primary image']);
        return false;
      }
    },
    []
  );

  return {
    images,
    uploading,
    uploadProgress,
    errors,
    uploadImages,
    deleteImage,
    reorderImages,
    setPrimaryImage,
    fetchImages,
    clearErrors: () => setErrors([]),
  };
};