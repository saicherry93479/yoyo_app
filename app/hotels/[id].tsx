import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { MockHotel } from '@/services/mockData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const HotelDetails = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation()
    const [hotel, setHotel] = useState<MockHotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      fetchHotelDetails();
    }, [id]);

    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get(`/hotels/${id}`);
        
        if (response.success) {
          setHotel(response.data.hotel);
        } else {
          setError(response.error || 'Failed to fetch hotel details');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShadowVisible: false,
          headerTitle: () => (
            <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Details</Text>
          ),
          headerTitleAlign: 'center',
        });
      }, [navigation]);
    
  if (loading) {
    return <LoadingSpinner fullScreen text="Loading hotel details..." />;
  }

  if (error || !hotel) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-500 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {error || 'Hotel not found'}
        </Text>
        <TouchableOpacity 
          className="bg-[#FF5A5F] px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Header with Background Image */}
      
      <ScrollView className="flex-1">
      <View className="relative">
        <Image
          source={{
            uri: hotel.images[currentImageIndex]
          }}
          className="w-full h-80"
          style={{ resizeMode: 'cover' }}
        />
        
        {/* Overlay */}
        <View className="absolute inset-0 bg-black/40" />
    
        
        {/* Image Indicators */}
        <View className="absolute bottom-5 left-0 right-0 flex-row justify-center gap-2">
          {hotel.images.map((_, index) => (
            <View key={index} className={`h-2 rounded-full ${index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />
          ))}
        </View>
      </View>

        {/* Hotel Info */}
        <View className="p-5 pb-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                {hotel.name}
              </Text>
              <Text className="mt-1 text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {hotel.address}
              </Text>
            </View>
            
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={20} color="#facc15" />
              <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{hotel.rating}</Text>
            </View>
          </View>
        </View>

        <View className="border-t border-b border-stone-200 p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Amenities</Text>
          
          <View className="mt-4 flex-row flex-wrap">
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="wifi" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Free Wi-Fi</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="water" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Swimming Pool</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="fitness" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Fitness Center</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="leaf" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Spa</Text>
              </View>
            </View>
          </View>
          
          {/* <TouchableOpacity className="mt-5 flex-row items-center justify-between"> */}
            <TouchableOpacity 
              className="flex-row items-center justify-between w-full"
              onPress={() => SheetManager.show('amenities')}
            >
              <Text className="text-base text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                View All Amenities
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        {/* </View> */}

        {/* Reviews */}
        <View className="border-b border-stone-200 p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Reviews</Text>
          
          <View className="mt-4 flex-row items-center gap-8">
            <View className="items-center gap-1">
              <Text className="text-5xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{hotel.rating}</Text>
              <View className="flex-row gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Ionicons 
                    key={index}
                    name={index < Math.floor(hotel.rating) ? "star" : "star-outline"} 
                    size={16} 
                    color={index < Math.floor(hotel.rating) ? "#facc15" : "#d6d3d1"} 
                  />
                ))}
              </View>
              <Text className="text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{hotel.reviewCount} reviews</Text>
            </View>
            
            <View className="flex-1">
              {[
                { rating: 5, percentage: 70 },
                { rating: 4, percentage: 20 },
                { rating: 3, percentage: 5 },
                { rating: 2, percentage: 3 },
                { rating: 1, percentage: 2 },
              ].map((item) => (
                <View key={item.rating} className="flex-row items-center gap-3 mb-2">
                  <Text className="text-sm text-stone-700 w-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{item.rating}</Text>
                  <View className="flex-1 h-1.5 bg-stone-200 rounded-full">
                    <View
                      className="h-1.5 bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>
                  <Text className="text-sm text-stone-500 w-8" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity  onPress={() => SheetManager.show('reviews')} className="mt-5 flex-row items-center justify-between">
            <Text className="text-base text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              View All Reviews
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Room Upgrades */}
        <View className="p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Room Upgrades</Text>
          
          <View className="mt-4 gap-4">
            <View className="flex-row items-center gap-4 p-4 border border-stone-200 rounded-xl">
              <Image
                source={{
                  uri: hotel.rooms[0]?.images[0] || hotel.images[0]
                }}
                className="w-24 h-24 rounded-lg"
                style={{ resizeMode: 'cover' }}
              />
              <View className="flex-1">
                <Text className="text-sm text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Upgrade Available
                </Text>
                <Text className="mt-0.5 text-base text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {hotel.rooms[0]?.type || 'Premium Room'}
                </Text>
                <Text className="mt-1 text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {hotel.rooms[0]?.description || 'Upgraded accommodation with premium amenities'}
                </Text>
                <TouchableOpacity onPressIn={() => SheetManager.show('upgraderoom')} className="mt-2 flex-row items-center gap-1">
                  <Text className="text-sm text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Upgrade</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1c1917" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="flex-row items-center gap-4 p-4 border border-stone-200 rounded-xl">
              <Image
                source={{
                  uri: hotel.rooms[1]?.images[0] || hotel.images[1]
                }}
                className="w-24 h-24 rounded-lg"
                style={{ resizeMode: 'cover' }}
              />
              <View className="flex-1">
                <Text className="text-sm text-stone-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Room Available
                </Text>
                <Text className="mt-0.5 text-base text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {hotel.rooms[1]?.type || 'Standard Room'}
                </Text>
                <Text className="mt-1 text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {hotel.rooms[1]?.description || 'Comfortable accommodation with essential amenities'}
                </Text>
                <TouchableOpacity onPressIn={() => SheetManager.show('upgraderoom')} className="mt-2 flex-row items-center gap-1">
                  <Text className="text-sm text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Book</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1c1917" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View className="bg-white p-4 shadow-lg border-t border-stone-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>₹{hotel.price.toLocaleString()}</Text>
            <Text className="text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>/night</Text>
          </View>
          
          <TouchableOpacity  onPressIn={()=>router.push('checkout')} className="bg-red-600 px-6 py-3 rounded-full">
            <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HotelDetails;