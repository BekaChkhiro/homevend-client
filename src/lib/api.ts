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
  
  register: async (userData: { fullName: string; email: string; password: string }) => {
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
    status?: string;
  }) => {
    const response = await publicApiClient.get('/properties', { params });
    return response.data.data;
  },
  
  getPropertyById: async (id: string) => {
    const response = await publicApiClient.get(`/properties/${id}`);
    return response.data.data;
  },
  
  getUserProperties: async () => {
    const response = await apiClient.get('/properties/user/my-properties');
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
  },
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

export default apiClient;