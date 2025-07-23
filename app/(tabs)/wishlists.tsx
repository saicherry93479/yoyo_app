import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useWishlist } from '@/hooks/useWishlist';
import { BookingCardSkeleton } from '@/components/ui/SkeletonLoader';
import { router } from 'expo-router';

// Add Circle Outline Icon
const AddCircleOutlineIcon = ({ size = 24, color = "#6B7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill={color} />
  </Svg>
);

// Heart/Favorite Icon
const FavoriteIcon = ({ size = 24, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
  </Svg>
);

const WishlistScreen = () => {

    const navigation = useNavigation()
    const { items, loading, error, removeFromWishlist, refresh } = useWishlist()

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShadowVisible: false,
          headerTitle: () => (
            <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>WhishLists</Text>
          ),
          headerTitleAlign: 'center',
        });
      }, [navigation]);

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (

      <ScrollView className="flex-1 bg-white ">
        {/* Wishlist Items */}
        <View className="px-4 gap-4 ">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))
          ) : error ? (
            <View className="p-4 bg-gray-50 rounded-lg">
              <Text className="text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                {error}
              </Text>
              <TouchableOpacity onPress={refresh} className="mt-2">
                <Text className="text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
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
                className="bg-black  px-6 py-3 rounded-lg"
                onPress={() => router.push('/(tabs)/search')}
              >
                <Text className="text-white  text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Explore Hotels
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row items-start bg-white  p-3 rounded-xl shadow-sm border border-gray-100 "
                onPress={() => router.push(`/hotels/${item.hotelId}`)}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-24 h-24 rounded-lg"
                  style={{ resizeMode: 'cover' }}
                />

                <View className="flex-1 ml-4 justify-center">
                  <Text 
                    className="text-black  text-lg leading-tight mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    {item.hotelName}
                  </Text>
                  <Text 
                    className="text-gray-500  text-sm"
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
                  className="p-2"
                  onPress={() => handleRemoveFromWishlist(item.id)}
                >
                  <FavoriteIcon size={24} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

  );
};

export default WishlistScreen;