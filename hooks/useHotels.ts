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

export interface BackendHotel {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  starRating: number;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number | null;
  rating: {
    average: number;
    count: number;
  };
  pricing: {
    startingFrom: number;
    range: {
      min: number;
      max: number;
    };
    currency: string;
    totalPrice: number | null;
    perNight: boolean;
  } | null;
  offers: Array<{
    title: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    code: string;
    validUntil?: string;
  }>;
  images: {
    primary: string | null;
    gallery: string[];
  };
  paymentOptions: {
    onlineEnabled: boolean;
    offlineEnabled: boolean;
  };
}

// Transform backend hotel to frontend format
const transformHotel = (backendHotel: BackendHotel): MockHotel => {
  return {
    id: backendHotel.id,
    name: backendHotel.name,
    location: `${backendHotel.city}, ${backendHotel.address}`,
    address: backendHotel.address,
    rating: backendHotel.rating.average,
    reviewCount: backendHotel.rating.count,
    price: backendHotel.pricing?.startingFrom || 0,
    originalPrice: backendHotel.pricing?.range.max || undefined,
    images: [
      backendHotel.images.primary || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      ...backendHotel.images.gallery
    ],
    amenities: backendHotel.amenities,
    description: backendHotel.description || '',
    latitude: backendHotel.coordinates.lat,
    longitude: backendHotel.coordinates.lng,
    distance: backendHotel.distance ? `${backendHotel.distance.toFixed(1)} km away` : undefined,
    offer: backendHotel.offers.length > 0 ? backendHotel.offers[0].title : undefined,
    rooms: [], // Will be populated when needed
    reviews: [] // Will be populated when needed
  };
};

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

      let response;
      if (filters?.query || filters?.location) {
        response = await apiService.get('/hotels/search', { params: filters });
      } else {
        response = await apiService.get('/hotels', { params: filters });
      }

      if (response.success) {
        const transformedHotels = response.data.hotels?.map(transformHotel) || [];
        setHotels(transformedHotels);
        setTotal(response.data.total || transformedHotels.length);
      } else {
        setError(response.error || 'Failed to fetch hotels');
        setHotels([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching hotels');
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
        const transformedHotels = response.data.hotels?.map(transformHotel) || [];
        setHotels(transformedHotels);
        setTotal(response.data.total || transformedHotels.length);
      } else {
        setError(response.error || 'Search failed');
        setHotels([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setHotels([]);
      setTotal(0);
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

// Hook for nearby hotels
export function useNearbyHotels(coordinates?: { lat: number; lng: number }) {
  const [hotels, setHotels] = useState<MockHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNearbyHotels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params: any = { limit: 10 };
      if (coordinates) {
        params.coordinates = coordinates;
      }

      const response = await apiService.get('/search/nearby', { params });

      if (response.success) {
        const transformedHotels = response.data.hotels?.map(transformHotel) || [];
        setHotels(transformedHotels);
      } else {
        setError(response.error || 'Failed to fetch nearby hotels');
        setHotels([]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching nearby hotels');
      setHotels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    fetchNearbyHotels(true);
  };

  useEffect(() => {
    fetchNearbyHotels();
  }, [coordinates]);

  return {
    hotels,
    loading,
    error,
    refreshing,
    refresh,
  };
}

// Hook for latest hotels
export function useLatestHotels() {
  const [hotels, setHotels] = useState<MockHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLatestHotels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.get('/search/latest', { params: { limit: 10 } });

      if (response.success) {
        const transformedHotels = response.data.hotels?.map(transformHotel) || [];
        setHotels(transformedHotels);
      } else {
        setError(response.error || 'Failed to fetch latest hotels');
        setHotels([]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching latest hotels');
      setHotels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    fetchLatestHotels(true);
  };

  useEffect(() => {
    fetchLatestHotels();
  }, []);

  return {
    hotels,
    loading,
    error,
    refreshing,
    refresh,
  };
}

// Hook for offers
export function useOffersHotels() {
  const [hotels, setHotels] = useState<MockHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffersHotels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.get('/search/offers', { params: { limit: 10 } });

      if (response.success) {
        const transformedHotels = response.data.hotels?.map(transformHotel) || [];
        setHotels(transformedHotels);
      } else {
        setError(response.error || 'Failed to fetch offers');
        setHotels([]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching offers');
      setHotels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    fetchOffersHotels(true);
  };

  useEffect(() => {
    fetchOffersHotels();
  }, []);

  return {
    hotels,
    loading,
    error,
    refreshing,
    refresh,
  };
}