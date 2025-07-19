import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
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

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  addToWishlist: (hotelId: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  removeFromWishlistByHotelId: (hotelId: string) => Promise<void>;
  isInWishlist: (hotelId: string) => boolean;
  refresh: () => void;
  forceRefresh: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
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
        setItems([]);
      }
    } catch (err: any) {
      console.log('Wishlist fetch error:', err.message);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addToWishlist = async (hotelId: string) => {
    try {
      const response = await apiService.post('/wishlist/', { hotelId });

      if (response.success) {
        // Refresh to get actual data
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
        // Remove from local state immediately
        setItems(prev => prev.filter(item => item.id !== itemId));
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      // Refresh on error to ensure consistency
      await fetchWishlist();
      throw new Error(err.message || 'Failed to remove from wishlist');
    }
  };

  const removeFromWishlistByHotelId = async (hotelId: string) => {
    try {
      const item = items.find(item => item.hotelId === hotelId);
      if (item) {
        await removeFromWishlist(item.id);
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

  const forceRefresh = () => {
    fetchWishlist(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const value: WishlistContextType = {
    items,
    loading,
    error,
    refreshing,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByHotelId,
    isInWishlist,
    refresh,
    forceRefresh,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};