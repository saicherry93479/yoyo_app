import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Search, MapPin, Star, ListFilter as Filter } from 'lucide-react-native';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { SheetManager } from 'react-native-actions-sheet';
import { useHotels } from '@/hooks/useHotels';

export default function SearchScreen() {
  const [sortBy, setSortBy] = useState('recommended');
  const [searchFilters, setSearchFilters] = useState({
    location: 'Mumbai',
    sortBy: 'recommended'
  });
  const navigation = useNavigation();
  const { hotels, loading, error, total, searchHotels } = useHotels(searchFilters);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="flex-1">
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Mumbai • Mar 15-20 • 2 guests
          </Text>
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {total} properties found
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, total]);

  const handleFilterChange = (newFilters: any) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  };

  const renderHotelCard = (hotel: any) => (
    <TouchableOpacity 
      key={hotel.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      onPress={() => router.push(`/hotels/${hotel.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: hotel.image }}
          className="w-full h-48"
          style={{ resizeMode: 'cover' }}
        />
        {hotel.offer && (
          <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded">
            <Text className="text-white text-xs" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.offer}
            </Text>
          </View>
        )}
        <TouchableOpacity className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full items-center justify-center">
          <Text className="text-red-500 text-lg">♡</Text>
        </TouchableOpacity>
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
                {hotel.address || hotel.location}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-sm text-gray-900 ml-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {hotel.rating}
            </Text>
            <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              ({hotel.reviewCount})
            </Text>
          </View>
        </View>
        
        <Text className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {hotel.distance}
        </Text>
        
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
              ₹{hotel.price.toLocaleString()}
            </Text>
            {hotel.originalPrice && (
              <Text className="text-sm text-gray-500 line-through ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{hotel.originalPrice.toLocaleString()}
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <TouchableOpacity 
          className="flex-row items-center bg-gray-100 rounded-full px-4 py-3"
          onPress={
            // Navigate back to search or open search sheet
            ()=>SheetManager.show('search')
          }
        >
          <Search size={20} color="#6B7280" />
          <Text className="text-gray-600 ml-3 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Mumbai • Mar 15-20 • 2 guests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            <TouchableOpacity 
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
              onPress={() => SheetManager.show('filters', {
                payload: {
                  currentFilters: {
                    priceRange: { min: 0, max: 999999 },
                    rating: 0,
                    amenities: [],
                    propertyType: [],
                    sortBy: 'recommended'
                  },
                  onApplyFilters: (filters) => {
                    handleFilterChange(filters);
                  }
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

      {/* Results */}
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View>
            {Array.from({ length: 4 }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
          </View>
        ) : error ? (
          <View className="p-4 bg-red-50 rounded-lg">
            <Text className="text-red-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              {error}
            </Text>
          </View>
        ) : (
          <View>
            {hotels.map(renderHotelCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}