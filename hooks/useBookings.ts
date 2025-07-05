import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Booking } from '@/types/hotel';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.get('/bookings');

      if (response.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.error || 'Failed to fetch bookings');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const response = await apiService.post('/bookings', bookingData);

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
      const response = await apiService.patch(`/bookings/${bookingId}/cancel`);

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

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refreshing,
    refresh,
    createBooking,
    cancelBooking,
  };
}