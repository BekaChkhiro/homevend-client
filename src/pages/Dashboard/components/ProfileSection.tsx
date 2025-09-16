import React, { useState, useEffect } from "react";
import { User } from "@/contexts/AuthContext";

interface ProfileSectionProps {
  user: User;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);

  useEffect(() => {
    loadUserLogo();
  }, [user.id, user.role]);

  const loadUserLogo = async () => {
    try {
      setIsLoadingLogo(true);

      // Determine entity type and purpose based on user role
      let entityType = 'user';
      let purpose = 'user_logo';

      if (user.role === 'developer') {
        entityType = 'developer';
        purpose = 'developer_logo';
      } else if (user.role === 'agency') {
        entityType = 'agency';
        purpose = 'agency_logo';
      }

      // Try to load logo from S3 image system
      const url = `/api/upload/${entityType}/${user.id}/images?purpose=${purpose}`;
      const imagesResponse = await fetch(url);

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        if (imagesData.images && imagesData.images.length > 0) {
          const latestImage = imagesData.images[0];
          const logoUrl = latestImage.urls?.small || latestImage.urls?.medium || latestImage.urls?.original;
          setLogoUrl(logoUrl);
        }
      }
    } catch (error) {
      console.log('ProfileSection: Error loading logo:', error);
    } finally {
      setIsLoadingLogo(false);
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-center mb-2">
        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${user.fullName} logo`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            !isLoadingLogo && user.fullName.substring(0, 1).toUpperCase()
          )}
          {isLoadingLogo && (
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
          )}
        </div>
      </div>
      <div className="text-center mb-1">
        <h3 className="font-medium">{user.fullName}</h3>
        <p className="text-xs text-gray-500">ID: {user.id}/2023</p>
      </div>
    </div>
  );
};
