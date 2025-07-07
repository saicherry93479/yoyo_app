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

      const endpoint = filters?.query ? '/hotels/search' : '/hotels';
      const response = await apiService.get(endpoint, { params: filters });

      if (response.success) {
        setHotels(response.data.hotels || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.error || 'Failed to fetch hotels');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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