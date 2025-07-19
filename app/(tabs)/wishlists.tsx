import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useWishlist } from '@/contexts/WishlistContext';
import { BookingCardSkeleton } from '@/components/ui/SkeletonLoader';
import { router } from 'expo-router';
import { HeartIcon } from '@/components/ui/HeartIcon';

// Add Circle Outline Icon
const AddCircleOutlineIcon = ({ size = 24, color = "#6B7280" }) => (
const WishlistScreen = () => {

    const navigation = useNavigation()
    const { items, loading, error, removeFromWishlistByHotelId, refresh } = useWishlist()

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShadowVisible: false,
          headerTitle: () => (
            <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>WhishLists</Text>
          ),
          headerTitleAlign: 'center',
        });
      }, [navigation]);

  const handleRemoveFromWishlist = async (hotelId: string) => {
    try {
      await removeFromWishlistByHotelId(hotelId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (
  
      <ScrollView className="flex-1 bg-white">
        {/* Wishlist Items */}
        <View className="px-4 gap-4 ">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))
          ) : error ? (
            <View className="p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                {error}
              </Text>
              <TouchableOpacity onPress={refresh} className="mt-2">
                <Text className="text-red-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <View className="mb-6">
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=300"
                  }}
                  className="w-48 h-48"
                  style={{ resizeMode: 'contain' }}
                />
              </View>
              <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                No saved hotels yet
              </Text>
              <Text className="text-gray-600 text-center mb-8" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Start exploring and save your favorite hotels to your wishlist
              </Text>
              <TouchableOpacity 
                className="bg-[#FF5A5F] px-6 py-3 rounded-lg"
                onPress={() => router.push('/(tabs)/search')}
              >
                <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Explore Hotels
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row items-start bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                onPress={() => router.push(`/hotels/${item.hotelId}`)}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-24 h-24 rounded-lg"
                  style={{ resizeMode: 'cover' }}
                />
                
                <View className="flex-1 ml-4 justify-center">
                  <Text 
                    className="text-gray-900 text-lg leading-tight mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    {item.hotelName}
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    {item.location}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-yellow-500">★</Text>
                    <Text 
                      className="text-gray-600 text-sm ml-1"
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      {item.rating}
                    </Text>
                  </View>
                  <View className="flex-row items-baseline mt-1">
                    <Text 
                      className="text-gray-900 text-base"
                      style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                      ₹{item.price.toLocaleString()}
                    </Text>
                    <Text 
                      className="text-gray-900 text-base ml-1"
                      style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    >
                      /night
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
              <HeartIcon
                isInWishlist={true}
                onPress={() => handleRemoveFromWishlist(item.hotelId)}
                size={24}
                className="p-2"
              />
            ))
          )}
        </View>
      </ScrollView>

  );
};

export default WishlistScreen;