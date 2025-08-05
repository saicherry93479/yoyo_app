import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, Dimensions } from 'react-native';
import { useNavigation, router, useLocalSearchParams } from 'expo-router';
import { Search, MapPin, Star, ListFilter as Filter, Heart, ArrowLeft, X, ArrowUpDown, ChevronDown, Tag, Map } from 'lucide-react-native';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { SheetManager } from 'react-native-actions-sheet';
import { apiService } from '@/services/api';
import { useWishlist } from '@/contexts/WishlistContext';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { TimeRangePicker } from '@/components/ui/TimeRangePicker';

interface SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  propertyType?: string[];
  sortBy?: string;
  offers?: string[];
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

export default function SearchGlobalScreen() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentSearchData, setCurrentSearchData] = useState<any>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'recommended'
  });
  const [showMapView, setShowMapView] = useState(false);
  const [selectedMapHotel, setSelectedMapHotel] = useState<Hotel | null>(null);
  const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<Hotel | null>(null);
  const [timeRange, setTimeRange] = useState({
    selectedDate: null,
    startDateTime: null,
    endDateTime: null,
    startTime: null,
    endTime: null
  });

  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { addToWishlist, removeFromWishlistByHotelId, isInWishlist } = useWishlist();

  // Format search display text
  const getSearchDisplayText = () => {
    if (!currentSearchData) return 'Search destinations, hotels...';

    const location = currentSearchData.location?.name || '';
    const bookingType = currentSearchData.bookingType || 'daily';

    if (bookingType === 'hourly') {
      const timeRange = currentSearchData.timeRange;
      if (timeRange?.startTime && timeRange?.endTime) {
        const formatTime = (time: string) => {
          const hour = parseInt(time.split(':')[0]);
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${displayHour}:00 ${period}`;
        };
        return `${location} • Hourly • ${formatTime(timeRange.startTime)} - ${formatTime(timeRange.endTime)}`;
      }
      return `${location} • Hourly`;
    } else {
      const dateRange = currentSearchData.dateRange;
      if (dateRange?.startDate && dateRange?.endDate) {
        const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        };
        return `${location} • Daily • ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
      }
      return `${location} • Daily`;
    }
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 999999)) count++;
    if (filters.rating && filters.rating > 0) count++;
    if (filters.amenities && filters.amenities.length > 0) count++;
    if (filters.offers && filters.offers.length > 0) count++;
    if (filters.sortBy && filters.sortBy !== 'recommended') count++;
    return count;
  };

  // Clear specific filter
  const clearFilter = (filterType: string) => {
    const newFilters = { ...filters };
    switch (filterType) {
      case 'price':
        delete newFilters.priceRange;
        break;
      case 'rating':
        delete newFilters.rating;
        break;
      case 'amenities':
        delete newFilters.amenities;
        break;
      case 'offers':
        delete newFilters.offers;
        break;
      case 'sort':
        newFilters.sortBy = 'recommended';
        break;
    }
    setFilters(newFilters);
    if (currentSearchData) {
      performSearch(currentSearchData, newFilters);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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

  function getTodayAtNoonISO() {
    const date = new Date();
    date.setHours(12, 0, 0, 0);  // 12:00 PM local time
    return date.toISOString().split('T')[0] + 'T12:00:00';
  }

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
        dateRange: searchData.bookingType === 'daily'
          ? {
            startDate: searchData.dateRange?.startDate || getTodayAtNoonISO(),
            endDate: searchData.dateRange?.endDate || getTodayAtNoonISO(),
          }
          : {
            startDate: searchData.timeRange?.startDateTime || getTodayAtNoonISO(),
            endDate: searchData.timeRange?.endDateTime || getTodayAtNoonISO(),
          },

        guests: searchData.guests || { adults: 1, children: 0, infants: 0 },
        bookingType: searchData.bookingType || 'daily',
        priceRange: searchFilters.priceRange || { min: 0, max: 999999 },
        starRating: searchFilters.rating || 0,
        amenities: searchFilters.amenities || [],
        sortBy: searchFilters.sortBy || 'recommended',
        page: 1,
        limit: 20
      };



      const response = await apiService.post('/search/search', requestBody);

      console.log('response from search is ', JSON.stringify(response))

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

  const handleRefresh = () => {
    if (currentSearchData) {
      setRefreshing(true);
      performSearch(currentSearchData, filters).finally(() => setRefreshing(false));
    }
  };

  const handleTimeRangeSelect = (selectedTimeRange: any) => {
    setTimeRange(selectedTimeRange);
    setShowTimeRangePicker(false);
  };

  const getUniqueAmenities = (hotels: Hotel[]) => {
    const allAmenities = hotels.flatMap(hotel => hotel.amenities || []);
    console.log('allAmenities ', allAmenities)
    const uniqueAmenities = [...new Set(allAmenities)].sort();
    return uniqueAmenities;
  };

  const renderFilterTag = (
    label: string,
    isActive: boolean,
    onPress: () => void,
    onClear?: () => void,
    icon?: React.ReactNode,
    isSort?: boolean,
    shouldNotReopenOnClear?: boolean
  ) => (
    <View className="flex-row items-center">
      <TouchableOpacity
        className={`px-4 py-2 rounded-full flex-row items-center border ${isActive
          ? isSort
            ? 'bg-gray-100 border-black'
            : 'bg-black border-black'
          : 'bg-white border-gray-200'
          }`}
        onPress={() => {
          // If filter is active and has a clear function, clear it instead of opening
          if (isActive && onClear && !isSort) {
            onClear();
          } else {
            // Otherwise open the action sheet
            onPress();
          }
        }}
      >
        {icon && (
          <View className="mr-2">
            {icon}
          </View>
        )}
        <Text
          className={`${isActive ? (isSort ? 'text-black' : 'text-white') : 'text-gray-700'}`}
          style={{ fontFamily: 'PlusJakartaSans-Medium' }}
        >
          {label}
        </Text>

        {/* Show X icon when active (except for sort), otherwise show chevron */}
        {isActive && onClear && !isSort ? (
          <View className="ml-2">
            <X size={14} color="white" />
          </View>
        ) : (
          <View className="ml-2">
            <ChevronDown size={14} color={isActive ? (isSort ? "black" : "white") : "#6B7280"} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

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
        if (currentSearchData.bookingType === 'hourly') {
          if (currentSearchData.timeRange?.startDateTime) {
            searchParams.append('checkIn', currentSearchData.timeRange?.startDateTime);
          }
          if (currentSearchData.timeRange?.endDateTime) {
            searchParams.append('checkOut', currentSearchData.timeRange?.endDateTime);
          }
        } else {
          if (currentSearchData?.dateRange?.startDate) {
            searchParams.append('checkIn', currentSearchData.dateRange.startDate);
          }
          if (currentSearchData?.dateRange?.endDate) {
            searchParams.append('checkOut', currentSearchData.dateRange.endDate);
          }
        }
        searchParams.append('bookingType', currentSearchData.bookingType)

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
          <View className="absolute top-3 left-3 bg-gray-500 px-2 py-1 rounded">
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
              /{currentSearchData?.bookingType === 'hourly' ? 'hour' : 'night'}
            </Text>
          </View>
        </View>

        {/* Hourly Stays Option - Only show for daily search */}
        {currentSearchData?.bookingType === 'daily' && (
          // <View className="mt-3 pt-3 border-t border-gray-100">

          <View className="flex-row gap-2">
            {
              hotel.hourlyStays && hotel.hourlyStays.length >= 3 &&
              hotel.hourlyStays.slice(0, 3).map((h) => <TouchableOpacity
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 active:bg-gray-100"
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedHotelForBooking(hotel);
                  setShowTimeRangePicker(true);
                }}
              >
                <Text className="text-xs text-gray-800 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {h.hours}
                </Text>
                <Text className="text-sm text-black text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  ₹{Math.round(hotel.minPrice * 0.3).toLocaleString()}
                </Text>
              </TouchableOpacity>)

            }
          </View>

          // </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
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
          onPress={() => router.back()}
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
        className="bg-black px-6 py-3 rounded-lg"
        onPress={handleRefresh}
      >
        <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Sticky filter bar component
  const renderStickyFilterBar = () => {
    const activeFiltersCount = getActiveFiltersCount();
    const isPriceActive = filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 999999);
    const isRatingActive = filters.rating && filters.rating > 0;
    const isAmenitiesActive = filters.amenities && filters.amenities.length > 0;
    const isOffersActive = filters.offers && filters.offers.length > 0;
    const isSortActive = filters.sortBy && filters.sortBy !== 'recommended';

    // Get display text for offers
    const getOffersDisplayText = () => {
      if (!isOffersActive || !filters.offers || filters.offers.length === 0) return 'Offers';
      if (filters.offers.length === 1) return filters.offers[0];
      return `${filters.offers.length} offers`;
    };

    return (
      <View className="bg-white "
      //  style={{ elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
      >
        <View className="flex-row items-center px-4">
          {/* Scrollable filter tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1 py-3"
            contentContainerStyle={{ paddingRight: 6 }}
          >
            <View className="flex-row gap-3">
              {renderFilterTag(
                'Sort',
                isSortActive,
                () => SheetManager.show('sort-options', {
                  payload: {
                    currentSort: filters.sortBy || 'recommended',
                    onSortSelect: (sortBy: string) => handleFilterChange({ sortBy })
                  }
                }),
                undefined, // No clear function for sort
                <ArrowUpDown size={14} color={isSortActive ? "black" : "#6B7280"} />,
                true // isSort flag
              )}

              {renderFilterTag(
                'Price',
                isPriceActive,
                () => SheetManager.show('price-filter', {
                  payload: {
                    currentPriceRange: filters.priceRange,
                    onPriceSelect: (priceRange: any) => handleFilterChange({ priceRange })
                  }
                }),
                isPriceActive ? () => clearFilter('price') : undefined,
                <Text className={`text-sm ${isPriceActive ? 'text-white' : 'text-gray-600'}`}>₹</Text>,
                false,
                true // shouldNotReopenOnClear
              )}

              {renderFilterTag(
                'Rating',
                isRatingActive,
                () => SheetManager.show('rating-filter', {
                  payload: {
                    currentRating: filters.rating || 0,
                    onRatingSelect: (rating: number) => handleFilterChange({ rating })
                  }
                }),
                isRatingActive ? () => clearFilter('rating') : undefined,
                <Star size={14} color={isRatingActive ? "white" : "#6B7280"} />,
                false,
                true // shouldNotReopenOnClear
              )}

              {renderFilterTag(
                'Amenities',
                isAmenitiesActive,
                () => {
                  const availableAmenities = getUniqueAmenities(hotels);
                  SheetManager.show('amenities-filter', {
                    payload: {
                      currentAmenities: filters.amenities || [],
                      availableAmenities: availableAmenities, // Pass the extracted amenities
                      onAmenitiesSelect: (amenities: string[]) => handleFilterChange({ amenities })
                    }
                  });
                },
                isAmenitiesActive ? () => clearFilter('amenities') : undefined,
                <Filter size={14} color={isAmenitiesActive ? "white" : "#6B7280"} />,
                false,
                true // shouldNotReopenOnClear
              )}



              {/* {renderFilterTag(
                getOffersDisplayText(),
                isOffersActive,
                () => SheetManager.show('offers-filter', {
                  payload: {
                    currentOffers: filters.offers || [],
                    onOffersSelect: (offers: string[]) => handleFilterChange({ offers })
                  }
                }),
                isOffersActive ? () => clearFilter('offers') : undefined,
                <Tag size={14} color={isOffersActive ? "white" : "#6B7280"} />,
                false,
                true // shouldNotReopenOnClear
              )} */}
            </View>
          </ScrollView>

          {/* Fixed filter icon on the right */}
          <View className="right-0 top-0 bottom-0 bg-white flex-row items-center">
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full relative"
              onPress={() => {
                const availableAmenities = getUniqueAmenities(hotels);
                SheetManager.show('filters', {
                  payload: {
                    currentFilters: filters,
                    availableAmenities: availableAmenities, // Add this line
                    onApplyFilters: handleFilterChange
                  }
                });
              }}
            >
              <Filter size={16} color="#6B7280" />
              {activeFiltersCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-black rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Custom Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-1"
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>

          <View className="flex-1 ">
            <TouchableOpacity
              className="flex flex-row items-center  bg-gray-100 rounded-full px-3 py-4"
              onPress={() => router.back()}
            >
              <Search size={16} color="#6B7280" />
              <Text
                className="text-gray-600 ml-2 flex-1"
                style={{ fontFamily: 'PlusJakartaSans-Regular', fontSize: 14 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getSearchDisplayText()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Toggle Button */}
          <TouchableOpacity
            onPress={() => setShowMapView(!showMapView)}
            className="ml-3 p-2 bg-white rounded-full border border-gray-200 hidden"
          >
            <Map size={20} color={showMapView ? "#000" : "#6B7280"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky Filter Bar - Always visible when there's search data */}
      {currentSearchData && renderStickyFilterBar()}

      {/* Results */}
      {showMapView ? (
        <View className="flex-1 relative">
          {/* Close Map Button */}
          <TouchableOpacity
            onPress={() => setShowMapView(false)}
            className="absolute top-4 left-4 z-10 bg-white rounded-full p-3 shadow-lg"
          >
            <X size={20} color="#000" />
          </TouchableOpacity>

          <MapView
            provider={PROVIDER_GOOGLE}
            className="flex-1"
            initialRegion={{
              latitude: hotels.length > 0 ? hotels[0].coordinates.lat : 19.0760,
              longitude: hotels.length > 0 ? hotels[0].coordinates.lng : 72.8777,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {hotels.map((hotel) => (
              <Marker
                key={hotel.id}
                coordinate={{
                  latitude: hotel.coordinates.lat,
                  longitude: hotel.coordinates.lng,
                }}
                title={hotel.name}
                description={`₹${hotel.pricing?.startingFrom || 0}/night`}
                onPress={() => setSelectedMapHotel(hotel)}
              >
                <View className="bg-black px-3 py-2 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    ₹{hotel.pricing?.startingFrom || 0}
                  </Text>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Hotel Details Action Sheet */}
          {selectedMapHotel && (
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg">
              <View className="p-4">
                <View className="flex-row">
                  <Image
                    source={{ uri: selectedMapHotel.images.primary || 'https://via.placeholder.com/100x100' }}
                    className="w-20 h-20 rounded-lg"
                    style={{ resizeMode: 'cover' }}
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                      {selectedMapHotel.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={12} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                        {selectedMapHotel.address}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Star size={12} color="#FCD34D" fill="#FCD34D" />
                      <Text className="text-sm text-gray-900 ml-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                        {selectedMapHotel.rating.average.toFixed(1)}
                      </Text>
                      <Text className="text-lg text-gray-900 ml-auto" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        ₹{selectedMapHotel.pricing?.startingFrom || 0}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={() => setSelectedMapHotel(null)}
                    className="flex-1 bg-gray-100 py-3 rounded-lg items-center"
                  >
                    <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const searchParams = new URLSearchParams();
                      if (currentSearchData?.guests) {
                        const totalGuests = (currentSearchData.guests.adults || 0) + (currentSearchData.guests.children || 0) + (currentSearchData.guests.infants || 0);
                        searchParams.append('guests', totalGuests.toString());
                      }
                      if (currentSearchData.bookingType === 'hourly') {
                        if (currentSearchData.timeRange?.startDateTime) {
                          searchParams.append('checkIn', currentSearchData.timeRange?.startDateTime);
                        }
                        if (currentSearchData.timeRange?.endDateTime) {
                          searchParams.append('checkOut', currentSearchData.timeRange?.endDateTime);
                        }
                      } else {
                        if (currentSearchData?.dateRange?.startDate) {
                          searchParams.append('checkIn', currentSearchData.dateRange.startDate);
                        }
                        if (currentSearchData?.dateRange?.endDate) {
                          searchParams.append('checkOut', currentSearchData.dateRange.endDate);
                        }
                      }
                      searchParams.append('bookingType', currentSearchData.bookingType);
                      const queryString = searchParams.toString();
                      const url = queryString ? `/hotels/${selectedMapHotel.id}?${queryString}` : `/hotels/${selectedMapHotel.id}`;
                      router.push(url);
                    }}
                    className="flex-1 bg-black py-3 rounded-lg items-center"
                  >
                    <Text className="text-white" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                      Open
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#000000']}
              tintColor="#000000"
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
          ) : hotels.length === 0 && currentSearchData ? (
            renderEmptyState()
          ) : (
            <View>
              {hotels.map(renderHotelCard)}
            </View>
          )}
        </ScrollView>
      )}

      {/* TimeRangePicker Modal */}
      <TimeRangePicker
        value={timeRange}
        onTimeRangeSelect={(selectedTimeRange) => {
          handleTimeRangeSelect(selectedTimeRange);
          // Navigate to hotel details with the selected time range
          if (selectedTimeRange.startDateTime && selectedTimeRange.endDateTime && selectedHotelForBooking) {
            const searchParams = new URLSearchParams();
            if (currentSearchData?.guests) {
              const totalGuests = (currentSearchData.guests.adults || 0) + (currentSearchData.guests.children || 0) + (currentSearchData.guests.infants || 0);
              searchParams.append('guests', totalGuests.toString());
            }
            searchParams.append('checkIn', selectedTimeRange.startDateTime);
            searchParams.append('checkOut', selectedTimeRange.endDateTime);
            searchParams.append('bookingType', 'hourly');

            const url = `/hotels/${selectedHotelForBooking.id}?${searchParams.toString()}`;
            router.push(url);
            setSelectedHotelForBooking(null);
          }
        }}
        placeholder="Select check-in & check-out"
        visible={showTimeRangePicker}
        onClose={() => {
          setShowTimeRangePicker(false);
          setSelectedHotelForBooking(null);
        }}
        showButton={false}
      />
    </SafeAreaView>
  );
}