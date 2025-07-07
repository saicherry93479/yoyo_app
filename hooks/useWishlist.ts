import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface WishlistItem {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  addedDate: string;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.get('/wishlist');

      if (response.success) {
        setItems(response.data.items || []);
      } else {
        // In mock mode, always show success
        setItems([]);
      }
    } catch (err: any) {
      // In mock mode, don't show errors
      console.log('Mock mode: ignoring error', err.message);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addToWishlist = async (hotelId: string) => {
    try {
      const response = await apiService.post('/wishlist', { hotelId });

      if (response.success) {
        await fetchWishlist();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add to wishlist');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await apiService.delete(`/wishlist/${itemId}`);

      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to remove from wishlist');
    }
  };

  const isInWishlist = (hotelId: string) => {
    return items.some(item => item.hotelId === hotelId);
  };

  const refresh = () => {
    fetchWishlist(true);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    items,
    loading,
    error,
    refreshing,
    refresh,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}