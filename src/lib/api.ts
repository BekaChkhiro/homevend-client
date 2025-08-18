import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API client without authentication
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      
      if (refreshToken && userId) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            userId,
            refreshToken
          });
          
          const { accessToken } = response.data.data;
          localStorage.setItem('token', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, token, refreshToken } = response.data.data;
    
    // Store auth data
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);
    }
    
    return { user, token };
  },
  
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    const { user, token, refreshToken } = response.data.data;
    
    // Store auth data
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);
    }
    
    return { user, token };
  },
  
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
  },
  
  getMe: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  }
};

// Property API
export const propertyApi = {
  getProperties: async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    propertyType?: string;
    dealType?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await publicApiClient.get('/properties', { params });
    return response.data.data;
  },
  
  getPropertyById: async (id: string) => {
    const response = await publicApiClient.get(`/properties/${id}`);
    return response.data.data;
  },
  
  getPropertyByIdForEdit: async (id: string) => {
    const response = await apiClient.get(`/properties/${id}?edit=true`);
    return response.data.data;
  },
  
  getUserProperties: async () => {
    const response = await apiClient.get('/properties/my-properties');
    return response.data.data;
  },
  
  createProperty: async (propertyData: any) => {
    const response = await apiClient.post('/properties', propertyData);
    return response.data.data;
  },
  
  updateProperty: async (id: string, propertyData: any) => {
    const response = await apiClient.put(`/properties/${id}`, propertyData);
    return response.data.data;
  },
  
  deleteProperty: async (id: string) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  }
};

// Favorites API
export const favoritesApi = {
  getFavorites: async () => {
    const response = await apiClient.get('/favorites');
    return response.data.data;
  },
  
  addToFavorites: async (propertyId: number) => {
    const response = await apiClient.post('/favorites', { propertyId });
    return response.data.data;
  },
  
  removeFromFavorites: async (propertyId: number) => {
    const response = await apiClient.delete(`/favorites/${propertyId}`);
    return response.data;
  },
  
  isFavorite: async (propertyId: number) => {
    const response = await apiClient.get(`/favorites/check/${propertyId}`);
    return response.data.data.isFavorite;
  }
};

// Admin API
export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data;
  },
  
  getUsers: async (params?: { page?: number; limit?: number; role?: string }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data.data;
  },
  
  getUserById: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },
  
  updateUserRole: async (id: string, role: 'user' | 'admin') => {
    const response = await apiClient.patch(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  }
};

// Cities cache to prevent duplicate requests
let citiesCache: any = null;
let citiesCachePromise: Promise<any> | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cities API
export const citiesApi = {
  getAllCities: async (isActive?: boolean) => {
    const cacheKey = `cities_${isActive}`;
    const now = Date.now();
    
    // Use cache if available, valid, and request is for active cities
    if (isActive === true && citiesCache && (now - lastCacheTime < CACHE_DURATION)) {
      return citiesCache;
    }
    
    // If there's already a request in progress, wait for it
    if (citiesCachePromise) {
      try {
        return await citiesCachePromise;
      } catch (error) {
        // If the pending request failed, we'll make a new one below
        citiesCachePromise = null;
      }
    }
    
    // Make the request and cache the promise
    citiesCachePromise = (async () => {
      try {
        const params = isActive !== undefined ? { isActive } : {};
        const response = await publicApiClient.get('/cities', { params });
        const data = response.data.data;
        
        // Cache the result if it's for active cities
        if (isActive === true) {
          citiesCache = data;
          lastCacheTime = now;
        }
        
        return data;
      } catch (error) {
        // Don't cache failures, allow retry
        throw error;
      } finally {
        // Clear the promise cache after request completes (success or failure)
        citiesCachePromise = null;
      }
    })();
    
    return citiesCachePromise;
  },
  
  getCityById: async (id: number) => {
    const response = await publicApiClient.get(`/cities/${id}`);
    return response.data.data;
  },
  
  searchCities: async (query: string) => {
    const response = await publicApiClient.get(`/cities/search`, { 
      params: { q: query } 
    });
    return response.data.data;
  }
};

// Areas cache to prevent duplicate requests
const areasCache = new Map<number, any>();
const areasCachePromises = new Map<number, Promise<any>>();
const areasCacheTime = new Map<number, number>();
const AREAS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Areas API
export const areasApi = {
  getAllAreas: async (cityId?: number) => {
    const params = cityId ? { cityId } : {};
    const response = await publicApiClient.get('/areas', { params });
    return response.data.data;
  },
  
  getAreaById: async (id: number) => {
    const response = await publicApiClient.get(`/areas/${id}`);
    return response.data.data;
  },
  
  getAreasByCity: async (cityId: number) => {
    const now = Date.now();
    
    // Use cache if available and valid
    if (areasCache.has(cityId)) {
      const cacheTime = areasCacheTime.get(cityId) || 0;
      if (now - cacheTime < AREAS_CACHE_DURATION) {
        return areasCache.get(cityId);
      }
    }
    
    // If there's already a request in progress for this city, wait for it
    if (areasCachePromises.has(cityId)) {
      try {
        return await areasCachePromises.get(cityId);
      } catch (error) {
        // If the pending request failed, we'll make a new one below
        areasCachePromises.delete(cityId);
      }
    }
    
    // Make the request and cache the promise
    const promise = (async () => {
      try {
        const response = await publicApiClient.get(`/areas/city/${cityId}`);
        const data = response.data.data;
        
        // Cache the result
        areasCache.set(cityId, data);
        areasCacheTime.set(cityId, now);
        
        return data;
      } catch (error) {
        // Don't cache failures
        throw error;
      } finally {
        // Clear the promise cache after request completes
        areasCachePromises.delete(cityId);
      }
    })();
    
    areasCachePromises.set(cityId, promise);
    return promise;
  }
};

// Agency API
export const agencyApi = {
  getAgencies: async (params?: { page?: number; limit?: number; search?: string; city?: string; isVerified?: boolean }) => {
    const response = await publicApiClient.get('/agencies', { params });
    return response.data.data;
  },
  
  getAgencyById: async (id: string) => {
    const response = await publicApiClient.get(`/agencies/${id}`);
    return response.data.data;
  },
  
  getMyAgencyUsers: async () => {
    const response = await apiClient.get('/agencies/my/users');
    return response.data.data;
  },
  
  addUserToMyAgency: async (email: string) => {
    const response = await apiClient.post('/agencies/my/users', { email });
    return response.data;
  },
  
  removeUserFromMyAgency: async (userId: number) => {
    const response = await apiClient.delete(`/agencies/my/users/${userId}`);
    return response.data;
  }
};

export default apiClient;
export { publicApiClient };