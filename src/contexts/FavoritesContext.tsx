import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { favoritesApi } from '@/lib/api';

interface FavoritesContextType {
  favorites: Set<number>;
  loading: boolean;
  toggleFavorite: (propertyId: number) => Promise<boolean>;
  isFavorite: (propertyId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();

    // Add window focus listener to refresh favorites when user returns to tab
    const handleWindowFocus = () => {
      loadFavorites();
    };

    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesApi.getFavorites();
      const favoriteIds = response.favorites.map((fav: any) => fav.id);
      setFavorites(new Set(favoriteIds));
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Don't show error toast here as user might not be logged in
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: number): Promise<boolean> => {
    const isCurrentlyFavorite = favorites.has(propertyId);
    
    try {
      if (isCurrentlyFavorite) {
        await favoritesApi.removeFromFavorites(propertyId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
        return false;
      } else {
        await favoritesApi.addToFavorites(propertyId);
        setFavorites(prev => new Set([...prev, propertyId]));
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.has(propertyId);
  };

  const refreshFavorites = async (): Promise<void> => {
    await loadFavorites();
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};