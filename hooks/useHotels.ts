import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Hotel, SearchFilters } from '@/types/hotel';

export function useHotels(filters?: SearchFilters) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHotels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.get('/hotels', {
        params: filters,
      });

      if (response.success) {
        setHotels(response.data.hotels || []);
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

      const response = await apiService.get('/hotels/search', {
        params: searchFilters,
      });

      if (response.success) {
        setHotels(response.data.hotels || []);
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
    loading,
    error,
    refreshing,
    refresh,
    searchHotels,
  };
}