import axios from 'axios';
import type { ApiResponse, AuthResponse, Vehicle, VehicleFilters, PaginatedResponse, VehicleFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', {
      username,
      password,
    });
    return response.data.data!;
  },

  createAdmin: async (username: string, password: string): Promise<void> => {
    await api.post('/api/auth/create-admin', {
      username,
      password,
    });
  },
};

export const vehicleAPI = {
  getVehicles: async (filters: VehicleFilters = {}): Promise<PaginatedResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>('/api/vehicles', {
      params: {
        ...filters,
        _t: Date.now(), // Cache busting
      },
    });
    return response.data.data!;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await api.get<ApiResponse<Vehicle>>(`/api/vehicles/${id}`);
    return response.data.data!;
  },

  createVehicle: async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    const formData = new FormData();

    // Add vehicle data
    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => formData.append('images', file));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post<ApiResponse<Vehicle>>('/api/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  updateVehicle: async (id: string, vehicleData: Partial<VehicleFormData>): Promise<Vehicle> => {
    const formData = new FormData();

    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => formData.append('images', file));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/api/vehicles/${id}`);
  },

  uploadImages: async (images: File[]): Promise<string[]> => {
    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    const response = await api.post<ApiResponse<{ filenames: string[] }>>('/api/vehicles/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!.filenames;
  },
};

export const aiAPI = {
  generateDescription: async (vehicleData: Omit<VehicleFormData, 'images'>): Promise<string> => {
    const response = await api.post<ApiResponse<{ description: string }>>('/api/ai/generate-description', vehicleData);
    return response.data.data!.description;
  },

  regenerateDescription: async (vehicleId: string): Promise<string> => {
    const response = await api.post<ApiResponse<{ description: string }>>(`/api/ai/regenerate-description/${vehicleId}`);
    return response.data.data!.description;
  },
};

export const getImageUrl = (filename: string): string => {
  return `${API_BASE_URL}/uploads/${filename}`;
};

export default api;