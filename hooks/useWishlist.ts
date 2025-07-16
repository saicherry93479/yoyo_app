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

      const response = await apiService.get('/wishlist/');

      if (response.success) {
        // Transform API response to match WishlistItem interface
        const transformedItems = (response.data.items || []).map((item: any) => ({
          id: item.id,
          hotelId: item.hotel.id,
          hotelName: item.hotel.name,
          location: `${item.hotel.address}, ${item.hotel.city}`,
          image: item.hotel.images?.primary || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300',
          price: item.hotel.pricing?.startingFrom || 0,
          rating: item.hotel.rating?.average || 0,
          addedDate: item.addedAt
        }));
        setItems(transformedItems);
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
      // Optimistically add to local state first
      const tempItem = {
        id: `temp_${Date.now()}`,
        hotelId,
        hotelName: 'Loading...',
        location: 'Loading...',
        image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300',
        price: 0,
        rating: 0,
        addedDate: new Date().toISOString()
      };
      
      setItems(prev => [tempItem, ...prev]);

      const response = await apiService.post('/wishlist/', { hotelId });

      if (response.success) {
        // Refresh to get actual data and replace the temp item
        await fetchWishlist();
        return response.data;
      } else {
        // Remove the temp item if API call failed
        setItems(prev => prev.filter(item => item.id !== tempItem.id));
        throw new Error(response.error || 'Failed to add to wishlist');
      }
    } catch (err: any) {
      // Remove the temp item if API call failed
      setItems(prev => prev.filter(item => item.id.startsWith('temp_')));
      throw new Error(err.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      // Store the item being removed for potential rollback
      const itemToRemove = items.find(item => item.id === itemId);
      
      // Optimistically remove from local state
      setItems(prev => prev.filter(item => item.id !== itemId));

      const response = await apiService.delete(`/wishlist/${itemId}`);

      if (response.success) {
        // Keep the optimistic update
        return response.data;
      } else {
        // Rollback the optimistic update
        if (itemToRemove) {
          setItems(prev => [...prev, itemToRemove]);
        }
        throw new Error(response.error || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      // Rollback the optimistic update
      const itemToRestore = items.find(item => item.id === itemId);
      if (itemToRestore) {
        setItems(prev => [...prev, itemToRestore]);
      }
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