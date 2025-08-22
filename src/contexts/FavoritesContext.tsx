import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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

// Global variables to prevent multiple simultaneous requests and implement strict rate limiting
let isLoadingGlobal = false;
let lastFetchTimeGlobal = 0;
let pendingRequestsCount = 0;

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const mountedRef = useRef(true);
  const lastSuccessRef = useRef(0);

  // Rate limiting: only fetch favorites at most once every 60 seconds (increased from 30)
  const FETCH_COOLDOWN = 60000; // 60 seconds
  const RATE_LIMIT_COOLDOWN = 300000; // 5 minutes for 429 errors

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Only load on mount, remove window focus listener entirely to prevent spam
    const timer = setTimeout(() => {
      loadFavorites();
    }, 1000); // Delay initial load by 1 second

    return () => clearTimeout(timer);
  }, []); // Remove lastFetchTime dependency

  const loadFavorites = async () => {
    // Check if user is authenticated by looking for token
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Enhanced rate limiting checks
    const now = Date.now();
    
    // Check if we're already loading, have too many pending requests, or are within cooldown
    if (isLoadingGlobal || 
        pendingRequestsCount > 2 ||
        (now - lastFetchTimeGlobal < FETCH_COOLDOWN) ||
        isRateLimited) {
      console.log('Favorites load skipped due to rate limiting or concurrent requests');
      setLoading(false);
      return;
    }

    try {
      isLoadingGlobal = true;
      pendingRequestsCount++;
      setLoading(true);
      
      const response = await favoritesApi.getFavorites();
      const favoriteIds = response.favorites.map((fav: any) => fav.id);
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setFavorites(new Set(favoriteIds));
        setIsRateLimited(false); // Clear rate limit flag on success
        lastSuccessRef.current = now;
      }
      
      lastFetchTimeGlobal = now;
      
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      
      // Handle 429 (Too Many Requests) specifically
      if (error.response?.status === 429) {
        console.warn('Favorites API rate limited. Backing off for 5 minutes...');
        if (mountedRef.current) {
          setIsRateLimited(true);
          
          // Clear rate limit after cooldown
          setTimeout(() => {
            if (mountedRef.current) {
              setIsRateLimited(false);
            }
          }, RATE_LIMIT_COOLDOWN);
        }
      }
      
    } finally {
      isLoadingGlobal = false;
      pendingRequestsCount = Math.max(0, pendingRequestsCount - 1);
      if (mountedRef.current) {
        setLoading(false);
      }
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
    if (!mountedRef.current) return;
    
    const now = Date.now();
    // Only refresh if enough time has passed since last fetch and not rate limited
    if (!isRateLimited && (now - lastFetchTimeGlobal > FETCH_COOLDOWN) && pendingRequestsCount === 0) {
      await loadFavorites();
    } else {
      console.log('Refresh favorites skipped due to rate limiting or pending requests');
    }
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