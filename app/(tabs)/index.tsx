import React, { useState, useLayoutEffect, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Pressable, Image, RefreshControl, Alert, Animated } from "react-native"
import { Svg, Path, Line, Circle } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { router } from "expo-router"
import { SheetManager } from "react-native-actions-sheet"
import { Search, Star, Heart, MapPin, Clock, Users } from "lucide-react-native"
import * as Location from 'expo-location'
import { useNearbyHotels, useLatestHotels, useOffersHotels } from '@/hooks/useHotels'
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon } from '@/components/ui/HeartIcon'
import { useBookings } from '@/hooks/useBookings'
import { SafeAreaView } from "react-native-safe-area-context"

// SVG Icons as components
const MagnifyingGlassIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </Svg>
)

const LocationIcon = ({ size = 20, color = "currentColor" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
)

interface LocationState {
  coordinates: { lat: number; lng: number } | null
  hasPermission: boolean
  permissionDenied: boolean
  loading: boolean
  error: string | null
}

const cityData = [
  {
    id: 'nearby',
    name: 'Nearby',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=200',
    icon: '📍'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    image: 'https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

const quickPicksData = [
  { id: 'recommended', label: 'Recommended', active: true },
  { id: 'company', label: 'Company-Serviced', active: false },
  { id: 'super', label: 'Super OYO', active: false },
];

export default function HotelBookingApp() {
  const [activeQuickPick, setActiveQuickPick] = useState('recommended')
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    hasPermission: false,
    permissionDenied: false,
    loading: false,
    error: null
  })
  const navigation = useNavigation()
  const scrollY = useRef(new Animated.Value(0)).current
  const { addToWishlist, removeFromWishlistByHotelId, isInWishlist, forceRefresh } = useWishlist()
  const { getUpcomingBookings } = useBookings()

  // Get upcoming bookings
  const upcomingBookings = getUpcomingBookings()
  const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null

  // Use hooks for hotel data
  const nearbyData = useNearbyHotels(location.coordinates)
  const latestData = useLatestHotels()
  const offersData = useOffersHotels()

  // Get current data based on active quick pick
  const getCurrentData = () => {
    switch (activeQuickPick) {
      case 'recommended':
        return nearbyData
      case 'company':
        return latestData
      case 'super':
        return offersData
      default:
        return nearbyData
    }
  }

  const currentData = getCurrentData()

  // Wishlist handlers
  const handleWishlistToggle = async (hotel: any) => {
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

  // Location permission and fetching logic
  const requestLocationPermission = async () => {
    try {
      setLocation(prev => ({ ...prev, loading: true, error: null }))

      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setLocation(prev => ({
          ...prev,
          hasPermission: false,
          permissionDenied: true,
          loading: false,
          error: 'Location permission denied'
        }))
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setLocation({
        coordinates: {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        },
        hasPermission: true,
        permissionDenied: false,
        loading: false,
        error: null
      })
    } catch (error) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to get location'
      }))
    }
  }

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync()

      if (status === 'granted') {
        await requestLocationPermission()
      } else {
        setLocation(prev => ({
          ...prev,
          hasPermission: false,
          permissionDenied: status === 'denied'
        }))
      }
    } catch (error) {
      setLocation(prev => ({
        ...prev,
        error: 'Failed to check location permission'
      }))
    }
  }

  // Initialize location on component mount
  useEffect(() => {
    checkLocationPermission()
  }, [])

  const handleSearchFromSheet = (searchData: any) => {

    router.push({
      pathname: '/(tabs)/search',
      params: {
        searchData: JSON.stringify(searchData)
      }
    });
  };



  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
                width: '100%'
              }}
              onPress={() =>
                SheetManager.show('search', { payload: { onSearch: handleSearchFromSheet } })
              }
            >
              <Search size={18} color="#6B7280" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold', color: '#111827' }}>
                  Bangalore
                </Text>
                <Text style={{ fontFamily: 'PlusJakartaSans-Regular', color: '#6B7280', fontSize: 12 }}>
                  26 Jul - 27 Jul • 1 guest
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
    })
  }, [navigation])
  const handleRefresh = () => {
    if (!location.hasPermission) {
      requestLocationPermission()
    } else {
      currentData.refresh()
    }
  }

  const renderHotelCard = (hotel: any) => (
    <Pressable
      onPress={() => {
        const searchParams = new URLSearchParams();
        searchParams.append('guests', '2');
  
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 1);
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 3);
  
        searchParams.append('checkIn', checkIn.toISOString());
        searchParams.append('checkOut', checkOut.toISOString());
  
        router.push(`/hotels/${hotel.id}?${searchParams.toString()}`);
      }}
      key={hotel.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <View className="relative">
        <Image
          source={{ uri: hotel.images[0] }}
          className="w-full h-56"
          style={{ resizeMode: 'cover' }}
        />
  
        {/* Pay at Hotel Badge */}
        <View className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full">
          <Text className="text-xs text-black" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Pay at hotel
          </Text>
        </View>
  
        {/* Offer Badge */}
        {hotel.offer && (
          <View className="absolute top-3 right-12 bg-black px-2 py-1 rounded">
            <Text className="text-white text-xs" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.offer}
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
        {/* Main Details Section */}
        <View className="flex-row justify-between items-start mb-4">
          {/* Left Side - Name and Address */}
          <View className="flex-1 pr-4">
            <Text className="text-lg text-black mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.name}
            </Text>
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {hotel.location}
            </Text>
          </View>
  
          {/* Right Side - Price Per Night */}
          <View className="items-end">
            <View className="flex-row items-baseline">
              <Text className="text-xl text-black" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                ₹{hotel.price.toLocaleString()}
              </Text>
              
            </View>
            <Text className="text-xs text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              per night
            </Text>
            {/* {hotel.originalPrice && (
              <View className="items-end mt-1">
                <Text className="text-sm text-gray-400 line-through" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  ₹{hotel.originalPrice.toLocaleString()}
                </Text>
                <Text className="text-xs text-black" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}% OFF
                </Text>
              </View>
            )} */}
          </View>
        </View>
  
        {/* Hourly Pricing Boxes */}
        <View className="flex-row gap-2">
          <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
            <Text className="text-xs text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              3hrs
            </Text>
            <Text className="text-sm text-black text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              ₹{Math.round(hotel.price * 0.3).toLocaleString()}
            </Text>
          </View>
          
          <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
            <Text className="text-xs text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              6hrs
            </Text>
            <Text className="text-sm text-black text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              ₹{Math.round(hotel.price * 0.5).toLocaleString()}
            </Text>
          </View>
          
          <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
            <Text className="text-xs text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              9hrs
            </Text>
            <Text className="text-sm text-black text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              ₹{Math.round(hotel.price * 0.7).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderNextTrip = () => {
    if (!nextBooking) return null;

    const checkInDate = new Date(nextBooking.checkInDate);
    const checkOutDate = new Date(nextBooking.checkOutDate);
    
    return (
      <TouchableOpacity
        className="bg-black rounded-2xl p-4 mx-4 mb-6"
        onPress={() => router.push(`/booking-details/${nextBooking.id}`)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-2 h-2 bg-green-400 rounded-full"></View>
            <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Your next trip
            </Text>
            <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {checkInDate.toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric' 
              })} - {checkOutDate.toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
            <View className="flex-row items-center gap-1">
              <Users size={12} color="#ffffff" />
              <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {nextBooking.guests} guests
              </Text>
            </View>
          </View>
          <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            ₹{nextBooking.totalAmount.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  const renderBanner = () => (
    <View className="mx-4 mb-6">
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
        }}
        className="h-32 rounded-2xl overflow-hidden"
        style={{ resizeMode: 'cover' }}
      >
        <View className="flex-1 bg-black/40 justify-center px-6">
          <Text className="text-white text-xl mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            New User Offer - 1st Stay at ₹799
          </Text>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-lg self-start">
            <Text className="text-[#FF5A5F] text-sm" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  return (

    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={currentData.refreshing}
          onRefresh={handleRefresh}
          colors={['#000000']}
          tintColor="#FF5A5F"
        />
      }
    >
      {/* Cities Section */}
      <View className="px-4 mb-6 hidden">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4">
            {cityData.map((city) => (
              <TouchableOpacity key={city.id} className="items-center">
                <View className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
                  {city.icon ? (
                    <View className="w-full h-full bg-black items-center justify-center">
                      <Text className="text-2xl">{city.icon}</Text>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: city.image }}
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  )}
                </View>
                <Text className="text-sm text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  {city.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Banner */}
      {renderBanner()}

      {/* Next Trip */}
      {renderNextTrip()}

      {/* Quick Picks */}
      <View className="px-4 mb-4">
        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Quick picks for you
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {quickPicksData.map((pick) => (
              <TouchableOpacity
                key={pick.id}
                className={`px-4 py-2 rounded-full border ${activeQuickPick === pick.id
                  ? 'bg-black border-black'
                  : 'bg-white border-gray-300'
                  }`}
                onPress={() => setActiveQuickPick(pick.id)}
              >
                <Text
                  className={`text-sm ${activeQuickPick === pick.id ? 'text-white' : 'text-gray-700'
                    }`}
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  {pick.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Hotel Listings */}
      <View className="px-4">
        {currentData.loading ? (
          <View className="gap-6">
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </View>
        ) : currentData.error ? (
          <View className="flex-1 items-center justify-center py-12 px-6">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-xl text-gray-900 text-center mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Something went wrong
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {currentData.error}
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
        ) : currentData.hotels.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12 px-6">
            <Text className="text-6xl mb-4">🏨</Text>
            <Text className="text-xl text-gray-900 text-center mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              No hotels found
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Try refreshing or check back later.
            </Text>
            <TouchableOpacity
              className="bg-[#FF5A5F] px-6 py-3 rounded-lg"
              onPress={() => SheetManager.show('search', {
                payload: {
                  onSearch: handleSearchFromSheet
                }
              })}
            >
              <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Search Hotels
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {currentData.hotels.map(renderHotelCard)}
          </View>
        )}
      </View>

      {/* Continue Your Search */}
      <View className="px-4 mb-6 hidden">
        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Continue your search
        </Text>
        <TouchableOpacity
          className="bg-white rounded-xl border border-gray-200 p-4"
          onPress={() => SheetManager.show('search', {
            payload: {
              onSearch: handleSearchFromSheet
            }
          })}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Bangalore
              </Text>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Today - Tomorrow
              </Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View className="h-8" />
    </ScrollView>

  )
}