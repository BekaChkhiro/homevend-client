import React, { useState, useEffect } from "react";
import { FavoritePropertyCard } from "./FavoritePropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { favoritesApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface FavoriteProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  district: string;
  street: string;
  area: string;
  totalPrice: string;
  bedrooms: string;
  bathrooms: string;
  photos: string[];
  contactPhone: string;
  status: string;
  createdAt: string;
  favoriteAddedAt: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleFavorite } = useFavorites();
  const { t, i18n } = useTranslation('userDashboard');
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [i18n.language]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoritesApi.getFavorites({ lang: i18n.language });
      setFavorites(response.favorites);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      setError(t('favorites.loadError'));
      toast({
        title: t('common.error'),
        description: t('favorites.loadError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (propertyId: number) => {
    try {
      // Use the FavoritesContext to remove - this will update global state
      await toggleFavorite(propertyId);
      // Update local state to remove from the list immediately
      setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
      toast({
        title: t('common.success'),
        description: t('favorites.removeSuccess'),
      });
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast({
        title: t('common.error'), 
        description: t('favorites.removeError'),
        variant: "destructive",
      });
    }
  };

  const translatePropertyType = (type: string) => {
    return t(`favorites.propertyTypes.${type}`) || type;
  };

  const translateDealType = (type: string) => {
    return t(`favorites.dealTypes.${type}`) || type;
  };

  const formatAddress = (property: FavoriteProperty) => {
    let address = property.street;
    if (property.district) {
      address += `, ${property.district}`;
    }
    if (property.city) {
      address += `, ${property.city}`;
    }
    return address;
  };

  if (loading) {
    return (
      <>
        <h2 className="text-xl font-medium mb-4">{t('favorites.title')}</h2>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('favorites.loading')}</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h2 className="text-xl font-medium mb-4">{t('favorites.title')}</h2>
        <div className="bg-white p-8 rounded-lg border text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchFavorites}>
            {t('common.tryAgain')}
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <>
      <h2 className="text-lg md:text-xl font-medium mb-4">{t('favorites.title')}</h2>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {favorites.map((property) => {
            const transformedProperty = {
              id: property.id,
              title: property.title,
              price: parseInt(property.totalPrice) || 0,
              address: formatAddress(property),
              city: property.city,
              district: property.district,
              cityData: property.cityData,
              areaData: property.areaData,
              bedrooms: parseInt(property.bedrooms) || 0,
              bathrooms: parseInt(property.bathrooms) || 0,
              area: parseInt(property.area) || 0,
              type: translatePropertyType(property.propertyType),
              transactionType: translateDealType(property.dealType),
              image: property.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
              featured: false, // You could add logic to determine this
              addedDate: new Date(property.favoriteAddedAt).toLocaleDateString('ka-GE'),
              ownerName: property.user.fullName,
              ownerPhone: property.contactPhone,
              onRemoveFromFavorites: () => handleRemoveFromFavorites(property.id)
            };

            return (
              <FavoritePropertyCard
                key={property.id}
                {...transformedProperty}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-4 md:p-8 rounded-lg border text-center">
          <div className="max-w-xs mx-auto">
            <Heart className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2">{t('favorites.noFavorites')}</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              {t('favorites.noFavoritesDesc')}
            </p>
            <Button 
              className="flex items-center mx-auto text-sm"
              onClick={() => navigate(getLanguageUrl('/properties', i18n.language))}
            >
              <Search className="h-4 w-4 mr-1" />
              {t('favorites.searchProperties')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
