import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, RefreshControl } from 'react-native';
import { useNavigation, router, useLocalSearchParams } from 'expo-router';
import { Search, MapPin, Star, ListFilter as Filter, Heart } from 'lucide-react-native';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { SheetManager } from 'react-native-actions-sheet';
import { apiService } from '@/services/api';
import { useWishlist } from '@/contexts/WishlistContext';
import { HeartIcon } from '@/components/ui/HeartIcon';

interface SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  propertyType?: string[];
  sortBy?: string;
}

interface Hotel {
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
  offers?: Array<{
    title: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    code: string;
    validUntil?: string;
  }>;
  images: {
    primary: string | null;
    gallery?: string[];
  };
  paymentOptions: {
    onlineEnabled: boolean;
    offlineEnabled: boolean;
  };
}

export default function SearchScreen() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentSearchData, setCurrentSearchData] = useState<any>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'recommended'
  });
  
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { addToWishlist, removeFromWishlistByHotelId, isInWishlist } = useWishlist();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="flex-1">
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Explore Hotels
          </Text>
          {total > 0 && (
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {total} properties found
            </Text>
          )}
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, total]);

  // Wishlist handlers
  const handleWishlistToggle = async (hotel: Hotel) => {
    try {
      const isCurrentlyInWishlist = isInWishlist(hotel.id)
      
      if (isCurrentlyInWishlist) {
        await removeFromWishlistByHotelId(hotel.id)
      } else {
        await addToWishlist(hotel.id)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      Alert.alert('Error', 'Failed to update wishlist. Please try again.')
    }
  }

  // Parse search data from params
  useEffect(() => {
    if (params.searchData) {
      try {
        const searchData = JSON.parse(params.searchData as string);
        setCurrentSearchData(searchData);
        performSearch(searchData, filters);
      } catch (error) {
        console.error('Error parsing search data:', error);
      }
    }
  }, [params.searchData]);

  const performSearch = async (searchData: any, searchFilters: SearchFilters = {}) => {
    if (!searchData) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare request body according to API specification
      const requestBody = {
        coordinates: searchData.location?.coordinates || { lat: 0, lng: 0 },
        city: searchData.location?.name || '',
        radius: 50,
        dateRange: {
          startDate: searchData.dateRange?.startDate || new Date().toISOString(),
          endDate: searchData.dateRange?.endDate || new Date().toISOString(),
        },
        guests: searchData.guests || { adults: 1, children: 0, infants: 0 },
        priceRange: searchFilters.priceRange || { min: 0, max: 999999 },
        starRating: searchFilters.rating || 0,
        amenities: searchFilters.amenities || [],
        sortBy: searchFilters.sortBy || 'recommended',
        page: 1,
        limit: 20
      };

      console.log('Search request body:', JSON.stringify(requestBody, null, 2));

      const response = await apiService.post('/search/search', requestBody);

      console.log('Search response:', JSON.stringify(response, null, 2));

      if (response.success) {
        setHotels(response.data.hotels || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.error || 'Search failed');
        setHotels([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
      setHotels([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (currentSearchData) {
      performSearch(currentSearchData, updatedFilters);
    }
  };

  const handleSearch = (searchData: any) => {
    setCurrentSearchData(searchData);
    performSearch(searchData, filters);
  };

  const handleRefresh = () => {
    if (currentSearchData) {
      setRefreshing(true);
      performSearch(currentSearchData, filters).finally(() => setRefreshing(false));
    }
  };

  const renderHotelCard = (hotel: Hotel) => (
    <TouchableOpacity 
      key={hotel.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      onPress={() => {
        const searchParams = new URLSearchParams();
        if (currentSearchData?.guests) {
          const totalGuests = (currentSearchData.guests.adults || 0) + (currentSearchData.guests.children || 0) + (currentSearchData.guests.infants || 0);
          searchParams.append('guests', totalGuests.toString());
        }
        if (currentSearchData?.dateRange?.startDate) {
          searchParams.append('checkIn', currentSearchData.dateRange.startDate);
        }
        if (currentSearchData?.dateRange?.endDate) {
          searchParams.append('checkOut', currentSearchData.dateRange.endDate);
        }
        
        const queryString = searchParams.toString();
        const url = queryString ? `/hotels/${hotel.id}?${queryString}` : `/hotels/${hotel.id}`;
        router.push(url);
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: hotel.images.primary || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          className="w-full h-48"
          style={{ resizeMode: 'cover' }}
        />
        {hotel.offers && hotel.offers.length > 0 && (
          <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded">
            <Text className="text-white text-xs" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.offers[0].title}
            </Text>
          </View>
        )}
        <HeartIcon
          isInWishlist={isInWishlist(hotel.id)}
          onPress={() => handleWishlistToggle(hotel)}
          size={18}
        />
      </View>
      
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={14} color="#6B7280" />
              <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {hotel.address}, {hotel.city}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-sm text-gray-900 ml-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {hotel.rating.average.toFixed(1)}
            </Text>
            <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              ({hotel.rating.count})
            </Text>
          </View>
        </View>
        
        {hotel.distance && (
          <Text className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {hotel.distance.toFixed(1)} km away
          </Text>
        )}
        
        <View className="flex-row flex-wrap gap-2 mb-3">
          {hotel.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <View key={index} className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                {amenity}
              </Text>
            </View>
          ))}
          {hotel.amenities.length > 3 && (
            <View className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                +{hotel.amenities.length - 3} more
              </Text>
            </View>
          )}
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-baseline">
            <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              ₹{hotel.pricing?.startingFrom.toLocaleString() || 0}
            </Text>
            {hotel.pricing?.range?.max && hotel.pricing.range.max > hotel.pricing.startingFrom && (
              <Text className="text-sm text-gray-500 line-through ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{hotel.pricing.range.max.toLocaleString()}
              </Text>
            )}
            <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              /night
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20 px-6">
      <Text className="text-6xl mb-6">🔍</Text>
      <Text className="text-2xl text-gray-900 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
        Start Exploring
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Search for your perfect destination and discover amazing hotels with great deals and reviews.
      </Text>
      <TouchableOpacity
        className="bg-[#FF5A5F] px-8 py-4 rounded-xl shadow-lg"
        onPress={() => SheetManager.show('search', {
          payload: {
            onSearch: handleSearch
          }
        })}
      >
        <View className="flex-row items-center gap-2">
          <Search size={20} color="white" />
          <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Search Hotels
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderNoResultsState = () => (
    <View className="flex-1 items-center justify-center py-20 px-6">
      <Text className="text-6xl mb-6">😔</Text>
      <Text className="text-2xl text-gray-900 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
        No Hotels Found
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        We couldn't find any hotels matching your search criteria. Try adjusting your filters or search for a different location.
      </Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="bg-gray-100 px-6 py-3 rounded-lg"
          onPress={() => SheetManager.show('filters', {
            payload: {
              currentFilters: filters,
              onApplyFilters: handleFilterChange
            }
          })}
        >
          <Text className="text-gray-700 text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Adjust Filters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black px-6 py-3 rounded-lg"
          onPress={() => SheetManager.show('search', {
            payload: {
              onSearch: handleSearch
            }
          })}
        >
          <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            New Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center py-20 px-6">
      <Text className="text-6xl mb-6">⚠️</Text>
      <Text className="text-2xl text-gray-900 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
        Something went wrong
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        {/* {error} */}
      </Text>
      <TouchableOpacity
        className="bg-[#FF5A5F] px-6 py-3 rounded-lg"
        onPress={handleRefresh}
      >
        <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <TouchableOpacity 
          className="flex-row items-center bg-gray-100 rounded-full px-4 py-3"
          onPress={() => SheetManager.show('search', {
            payload: {
              onSearch: handleSearch
            }
          })}
        >
          <Search size={20} color="#6B7280" />
          <Text className="text-gray-600 ml-3 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {currentSearchData?.location?.name || 'Search destinations, hotels...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar - Only show if we have results */}
      {!loading && !error && hotels.length > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
                onPress={() => SheetManager.show('filters', {
                  payload: {
                    currentFilters: filters,
                    onApplyFilters: handleFilterChange
                  }
                })}
              >
                <Filter size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Filters
                </Text>
              </TouchableOpacity>
              
              {[
                { id: 'price', label: 'Price' },
                { id: 'rating', label: 'Rating' },
                { id: 'distance', label: 'Distance' },
                { id: 'amenities', label: 'Amenities' }
              ].map((filter) => (
                <TouchableOpacity 
                  key={filter.id}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                  onPress={() => {
                    const quickFilters: any = {};
                    if (filter.id === 'price') quickFilters.sortBy = 'price_low';
                    if (filter.id === 'rating') quickFilters.rating = 4;
                    handleFilterChange(quickFilters);
                  }}
                >
                  <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <ScrollView 
        className="flex-1 px-4 py-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF5A5F']}
            tintColor="#FF5A5F"
          />
        }
      >
        {loading ? (
          <View>
            {Array.from({ length: 4 }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
          </View>
        ) : error ? (
          renderErrorState()
        ) : hotels.length === 0 ? (
          currentSearchData ? renderNoResultsState() : renderEmptyState()
        ) : (
          <View>
            {hotels.map(renderHotelCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}