export interface User {
  id: number;
  username: string;
  role: 'admin';
}

export interface Vehicle {
  id: number;
  type: 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van';
  brand: string;
  model: string;
  color: string;
  engine_size: string;
  year: number;
  price: number;
  description?: string;
  ai_description?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData {
  type: 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van';
  brand: string;
  model: string;
  color: string;
  engine_size: string;
  year: number;
  price: number;
  description?: string;
  images?: File[];
}

export interface VehicleFilters {
  type?: string;
  brand?: string;
  model?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}