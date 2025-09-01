import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Exponential backoff retry utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      // Only retry on rate limit errors
      if (error.response?.status === 429 && attempt < maxRetries) {
        const retryAfter = error.response?.data?.retryAfter || 
                          parseInt(error.response?.headers?.['retry-after']) || 
                          Math.pow(2, attempt - 1);
        
        const delay = Math.max(retryAfter * 1000, baseDelay * Math.pow(2, attempt - 1));
        console.warn(`Rate limited. Retrying after ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} retries`);
};


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
    cityId?: number;
    city?: string;
    propertyType?: string | string[];
    dealType?: string;
    dailyRentalSubcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    areaId?: number;
    rooms?: string | string[];
    bedrooms?: string | string[];
    bathrooms?: string | string[];
    totalFloors?: string;
    buildingStatus?: string;
    constructionYearMin?: string;
    constructionYearMax?: string;
    condition?: string;
    projectType?: string;
    ceilingHeightMin?: number;
    ceilingHeightMax?: number;
    heating?: string;
    parking?: string;
    hotWater?: string;
    buildingMaterial?: string;
    hasBalcony?: boolean;
    hasPool?: boolean;
    hasLivingRoom?: boolean;
    hasLoggia?: boolean;
    hasVeranda?: boolean;
    hasYard?: boolean;
    hasStorage?: boolean;
    search?: string;
    location?: string;
    features?: string[];
    advantages?: string[];
    furnitureAppliances?: string[];
    isFeatured?: boolean;
    sort?: string;
  }) => {
    // Clean up params - convert arrays to comma-separated strings for query params
    const cleanParams: any = { ...params };
    
    // Convert array parameters to comma-separated strings
    if (Array.isArray(cleanParams.propertyType)) {
      cleanParams.propertyType = cleanParams.propertyType.join(',');
    }
    if (Array.isArray(cleanParams.rooms)) {
      cleanParams.rooms = cleanParams.rooms.join(',');
    }
    if (Array.isArray(cleanParams.bedrooms)) {
      cleanParams.bedrooms = cleanParams.bedrooms.join(',');
    }
    if (Array.isArray(cleanParams.bathrooms)) {
      cleanParams.bathrooms = cleanParams.bathrooms.join(',');
    }
    if (Array.isArray(cleanParams.features)) {
      cleanParams.features = cleanParams.features.join(',');
    }
    if (Array.isArray(cleanParams.advantages)) {
      cleanParams.advantages = cleanParams.advantages.join(',');
    }
    if (Array.isArray(cleanParams.furnitureAppliances)) {
      cleanParams.furnitureAppliances = cleanParams.furnitureAppliances.join(',');
    }
    
    // Convert boolean to string
    if (typeof cleanParams.hasBalcony === 'boolean') {
      cleanParams.hasBalcony = cleanParams.hasBalcony ? 'true' : undefined;
    }
    if (typeof cleanParams.hasPool === 'boolean') {
      cleanParams.hasPool = cleanParams.hasPool ? 'true' : undefined;
    }
    if (typeof cleanParams.hasLivingRoom === 'boolean') {
      cleanParams.hasLivingRoom = cleanParams.hasLivingRoom ? 'true' : undefined;
    }
    if (typeof cleanParams.hasLoggia === 'boolean') {
      cleanParams.hasLoggia = cleanParams.hasLoggia ? 'true' : undefined;
    }
    if (typeof cleanParams.hasVeranda === 'boolean') {
      cleanParams.hasVeranda = cleanParams.hasVeranda ? 'true' : undefined;
    }
    if (typeof cleanParams.hasYard === 'boolean') {
      cleanParams.hasYard = cleanParams.hasYard ? 'true' : undefined;
    }
    if (typeof cleanParams.hasStorage === 'boolean') {
      cleanParams.hasStorage = cleanParams.hasStorage ? 'true' : undefined;
    }
    if (typeof cleanParams.isFeatured === 'boolean') {
      cleanParams.isFeatured = cleanParams.isFeatured ? 'true' : undefined;
    }

    // Remove undefined values
    Object.keys(cleanParams).forEach(key => {
      if (cleanParams[key] === undefined || cleanParams[key] === '' || cleanParams[key] === 'all') {
        delete cleanParams[key];
      }
    });

    console.log('🚀 Sending API request with params:', cleanParams);
    
    return retryWithExponentialBackoff(async () => {
      const response = await publicApiClient.get('/properties', { params: cleanParams });
      return response.data.data;
    });
  },
  
  getPropertyById: async (id: string) => {
    return retryWithExponentialBackoff(async () => {
      const response = await publicApiClient.get(`/properties/${id}`);
      return response.data.data;
    });
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
  },
  
  getAllProperties: async (params?: { page?: number; limit?: number; developerId?: number }) => {
    const response = await apiClient.get('/admin/properties', { params });
    return response.data.data;
  },

  // Districts management
  getDistricts: async () => {
    const response = await apiClient.get('/districts');
    return response.data.data;
  },

  createDistrict: async (districtData: any) => {
    const response = await apiClient.post('/districts', districtData);
    return response.data.data;
  },

  updateDistrict: async (id: string, districtData: any) => {
    const response = await apiClient.put(`/districts/${id}`, districtData);
    return response.data.data;
  },

  deleteDistrict: async (id: string) => {
    const response = await apiClient.delete(`/districts/${id}`);
    return response.data;
  },

  // Service pricing
  getServicePricing: async () => {
    const response = await apiClient.get('/admin/service-pricing');
    return response.data.data;
  },

  updateServicePricing: async (id: string, pricingData: any) => {
    const response = await apiClient.put(`/admin/service-pricing/${id}`, pricingData);
    return response.data.data;
  },

  // Projects management
  getProjects: async (params?: any) => {
    const response = await apiClient.get('/admin/projects', { params });
    return response.data.data;
  },

  createProject: async (projectData: any) => {
    const response = await apiClient.post('/admin/projects', projectData);
    return response.data.data;
  },

  updateProject: async (id: string, projectData: any) => {
    const response = await apiClient.put(`/admin/projects/${id}`, projectData);
    return response.data.data;
  },

  deleteProject: async (id: string) => {
    const response = await apiClient.delete(`/admin/projects/${id}`);
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
  getAgencies: async (params?: { page?: number; limit?: number; search?: string; city?: string; isVerified?: boolean; role?: string }) => {
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

// Developer API
export const developerApi = {
  getDevelopers: async (params?: { page?: number; limit?: number; search?: string; city?: string; isVerified?: boolean }) => {
    const response = await publicApiClient.get('/developers', { params });
    return response.data.data;
  },
  
  getDeveloperById: async (id: string) => {
    const response = await publicApiClient.get(`/developers/${id}`);
    return response.data.data;
  },

  createDeveloper: async (data: any) => {
    const response = await apiClient.post('/developers', data);
    return response.data.data;
  },

  updateDeveloper: async (id: string, data: any) => {
    const response = await apiClient.put(`/developers/${id}`, data);
    return response.data.data;
  },

  getMyDeveloper: async () => {
    const response = await apiClient.get('/developers/my/profile');
    return response.data.data;
  }
};

// Balance API
export const balanceApi = {
  getBalance: async () => {
    const response = await apiClient.get('/balance');
    return response.data.data;
  },
  
  getPaymentProviders: async () => {
    const response = await apiClient.get('/balance/providers');
    return response.data.data;
  },
  
  initiateTopUp: async (amount: number, provider: string = 'test') => {
    const response = await apiClient.post('/balance/initiate', {
      amount,
      provider
    });
    return response.data;
  },
  
  // Legacy method for backward compatibility
  topUp: async (amount: number, paymentMethod: string = 'test') => {
    const response = await apiClient.post('/balance/top-up', {
      amount,
      paymentMethod
    });
    return response.data.data;
  },
  
  getTransactionHistory: async (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
    const response = await apiClient.get('/balance/transactions', { params });
    return response.data.data;
  }
};

// Services API (VIP + Additional Services)
export const servicesApi = {
  getServicePricing: async () => {
    const response = await publicApiClient.get('/services/pricing');
    return response.data.data;
  },
  
  purchaseServices: async (propertyId: number, services: Array<{serviceType: string, days: number, colorCode?: string}>) => {
    const response = await apiClient.post('/services/purchase', {
      propertyId,
      services
    });
    return response.data.data;
  },
  
  getPropertyServices: async (propertyId: number) => {
    const response = await apiClient.get(`/services/property/${propertyId}`);
    return response.data.data;
  },
  
  getServiceTransactionHistory: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/services/transactions', { params });
    return response.data.data;
  }
};

// VIP API (Legacy - for backward compatibility)
export const vipApi = {
  getPricing: async () => {
    const pricing = await servicesApi.getServicePricing();
    // Return only VIP services for compatibility
    return pricing.vipServices || [];
  },
  
  purchaseVipServices: async (propertyId: number, services: Array<{vipType: string, days: number, colorCode?: string}>) => {
    // Convert vipType to serviceType for new API
    const convertedServices = services.map(s => ({
      serviceType: s.vipType,
      days: s.days,
      colorCode: s.colorCode
    }));
    return servicesApi.purchaseServices(propertyId, convertedServices);
  },
  
  // Legacy method for backward compatibility
  purchaseVipStatus: async (propertyId: number, vipType: string, days: number) => {
    return servicesApi.purchaseServices(propertyId, [{serviceType: vipType, days}]);
  },
  
  getPropertyVipStatus: async (propertyId: number) => {
    const services = await servicesApi.getPropertyServices(propertyId);
    // Filter only VIP services for compatibility
    const vipServices = services.services?.filter((s: any) => 
      ['vip', 'vip_plus', 'super_vip'].includes(s.serviceType)
    ) || [];
    
    return {
      propertyId: services.propertyId,
      hasActiveServices: vipServices.length > 0,
      services: vipServices
    };
  }
};

// Admin VIP API
export const adminVipApi = {
  getAllVipPricing: async () => {
    const response = await apiClient.get('/admin/vip-pricing');
    return response.data.data;
  },
  
  updateVipPricing: async (id: number, data: {
    pricePerDay?: number;
    descriptionKa?: string;
    descriptionEn?: string;
    features?: string[];
    isActive?: boolean;
  }) => {
    const response = await apiClient.put(`/admin/vip-pricing/${id}`, data);
    return response.data.data;
  }
};

// Project API
export const projectApi = {
  getProjects: async (params?: { 
    page?: number; 
    limit?: number; 
    city?: string; 
    area?: string; 
    projectType?: string; 
    deliveryStatus?: string 
  }) => {
    const response = await publicApiClient.get('/projects', { params });
    return response.data;
  },
  
  getProjectById: async (id: string) => {
    const response = await publicApiClient.get(`/projects/${id}`);
    return response.data.data;
  },
  
  createProject: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data.data;
  },
  
  updateProject: async (id: string, projectData: any) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data.data;
  },
  
  deleteProject: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }
};

export default apiClient;
export { publicApiClient };