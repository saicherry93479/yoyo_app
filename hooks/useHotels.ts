import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { MockHotel } from '@/services/mockData';

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  sortBy?: string;
  query?: string;
}

export function useHotels(filters?: SearchFilters) {
  const [hotels, setHotels] = useState<MockHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchHotels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Always use mock data
      let response;
      if (filters?.query || filters?.location) {
        response = await apiService.get('/hotels/search', { params: filters });
      } else {
        response = await apiService.get('/hotels', { params: filters });
      }

      if (response.success) {
        setHotels(response.data.hotels || []);
        setTotal(response.data.total || 0);
      } else {
        // In mock mode, always show success
        setHotels([]);
        setTotal(0);
      }
    } catch (err: any) {
      // In mock mode, don't show errors
      console.log('Mock mode: ignoring error', err.message);
      setHotels([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchHotels = async (searchFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get('/hotels/search', { params: searchFilters });

      if (response.success) {
        setHotels(response.data.hotels || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchHotels(true);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return {
    hotels,
    total,
    loading,
    error,
    refreshing,
    refresh,
    searchHotels,
  };
}