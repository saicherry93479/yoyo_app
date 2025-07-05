import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://hotel-booking-api.example.com/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    await AsyncStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
    }

    return accessToken;
  }

  private async clearTokens() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userProfile']);
  }

  // Generic request method with mock fallback
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      // For development, use mock data
      if (__DEV__) {
        return this.getMockResponse<T>(config);
      }

      const response = await this.axiosInstance(config);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      // Fallback to mock in development
      if (__DEV__) {
        return this.getMockResponse<T>(config);
      }

      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'An error occurred',
      };
    }
  }

  private async getMockResponse<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const url = config.url || '';
    const method = config.method?.toUpperCase() || 'GET';

    // Mock responses based on endpoint
    if (url.includes('/auth/login')) {
      return {
        success: true,
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
            hasOnboarded: true,
          }
        } as T,
        message: 'Login successful'
      };
    }

    if (url.includes('/auth/register')) {
      return {
        success: true,
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          user: {
            id: '2',
            name: 'New User',
            email: 'newuser@example.com',
            phone: '+919876543210',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
            hasOnboarded: false,
          }
        } as T,
        message: 'Registration successful'
      };
    }

    if (url.includes('/hotels')) {
      return {
        success: true,
        data: {
          hotels: [
            {
              id: '1',
              name: 'Grand Palace Hotel',
              location: 'New York, NY',
              rating: 4.8,
              price: 299,
              image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
              amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
              description: 'Luxury hotel in the heart of Manhattan'
            },
            {
              id: '2',
              name: 'Ocean View Resort',
              location: 'Miami, FL',
              rating: 4.6,
              price: 199,
              image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
              amenities: ['Beach Access', 'Pool', 'Restaurant', 'Bar'],
              description: 'Beautiful beachfront resort with stunning ocean views'
            },
            {
              id: '3',
              name: 'Mountain Lodge Retreat',
              location: 'Aspen, CO',
              rating: 4.9,
              price: 399,
              image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600',
              amenities: ['Ski Access', 'Fireplace', 'Hot Tub', 'Restaurant'],
              description: 'Cozy mountain retreat with breathtaking alpine views'
            },
            {
              id: '4',
              name: 'City Center Boutique',
              location: 'San Francisco, CA',
              rating: 4.7,
              price: 249,
              image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600',
              amenities: ['WiFi', 'Gym', 'Business Center', 'Rooftop Bar'],
              description: 'Modern boutique hotel in the heart of downtown'
            }
          ]
        } as T,
        message: 'Hotels fetched successfully'
      };
    }

    if (url.includes('/bookings')) {
      return {
        success: true,
        data: {
          bookings: [
            {
              id: '1',
              hotelName: 'Grand Palace Hotel',
              checkIn: '2024-02-15',
              checkOut: '2024-02-18',
              guests: 2,
              status: 'confirmed',
              totalAmount: 897,
              image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300'
            }
          ]
        } as T,
        message: 'Bookings fetched successfully'
      };
    }

    // Default mock response
    return {
      success: true,
      data: {} as T,
      message: 'Mock response'
    };
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }
}

export const apiService = new ApiService();