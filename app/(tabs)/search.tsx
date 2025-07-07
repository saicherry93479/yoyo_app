import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Search, MapPin, Star, ListFilter as Filter } from 'lucide-react-native';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { SheetManager } from 'react-native-actions-sheet';

// Mock search results data
const mockSearchResults = [
  {
    id: '1',
    name: 'The Oberoi Mumbai',
    location: 'Nariman Point, Mumbai',
    rating: 4.8,
    reviewCount: 1247,
    price: 15000,
    originalPrice: 18000,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
    distance: '2.1 km from city center',
    offer: '20% OFF'
  },
  {
    id: '2',
    name: 'Taj Mahal Palace',
    location: 'Colaba, Mumbai',
    rating: 4.9,
    reviewCount: 2156,
    price: 25000,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
    distance: '1.5 km from city center'
  },
  {
    id: '3',
    name: 'ITC Grand Central',
    location: 'Parel, Mumbai',
    rating: 4.7,
    reviewCount: 892,
    price: 12000,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600',
    amenities: ['Free WiFi', 'Pool', 'Business Center'],
    distance: '3.2 km from city center'
  },
  {
    id: '4',
    name: 'The St. Regis Mumbai',
    location: 'Lower Parel, Mumbai',
    rating: 4.8,
    reviewCount: 1543,
    price: 22000,
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar'],
    distance: '2.8 km from city center'
  }
];

export default function SearchScreen() {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState(mockSearchResults);
  const [sortBy, setSortBy] = useState('recommended');
  const navigation = useNavigation();

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="flex-1">
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Mumbai • Mar 15-20 • 2 guests
          </Text>
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {hotels.length} properties found
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, hotels.length]);

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
          resizeMode="cover"
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
                {hotel.location}
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
                    console.log('Applied filters:', filters);
                    // Here you would typically update the search results based on filters
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
                  // Quick filter actions
                  console.log('Quick filter:', filter.id);
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
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
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