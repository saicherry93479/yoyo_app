import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

// Types based on your API documentation
export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBookings = async (isRefresh = false, status?: string) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (status) {
        params.append('status', status);
      }
      params.append('limit', '50'); // Get more items at once
      
      const queryString = params.toString();
      const endpoint = `/bookings/user/me${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get(endpoint);

      console.log('trips response ',JSON.stringify(response.data.bookings))

      if (response.success) {
        setBookings(response.data.bookings || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.error || 'Failed to fetch bookings');
        setBookings([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      // Assuming you have a create booking endpoint
      const response = await apiService.post('/api/v1/bookings', bookingData);

      if (response.success) {
        // Refresh bookings list
        await fetchBookings();
        return response.data;
      } else {
        throw new Error(response.error || 'Booking failed');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Booking failed');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      // Assuming you have a cancel booking endpoint
      const response = await apiService.patch(`/api/v1/bookings/${bookingId}/cancel`);

      if (response.success) {
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        return response.data;
      } else {
        throw new Error(response.error || 'Cancellation failed');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Cancellation failed');
    }
  };

  const refresh = () => {
    fetchBookings(true);
  };

  // Helper methods to get bookings by status
  const getUpcomingBookings = () => {
    return bookings.filter(booking => 
      booking.status === 'confirmed' || booking.status === 'pending'
    );
  };

  const getPastBookings = () => {
    return bookings.filter(booking => 
      booking.status === 'completed' || booking.status === 'cancelled'
    );
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    total,
    loading,
    error,
    refreshing,
    refresh,
    createBooking,
    cancelBooking,
    getUpcomingBookings,
    getPastBookings,
    fetchBookings, // Expose for manual fetching with filters
  };
}