import React, { useState, useLayoutEffect, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView, Pressable, Image, RefreshControl, Alert } from "react-native"
import { Svg, Path, Line, Circle } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { router } from "expo-router"
import { SheetManager } from "react-native-actions-sheet"
import { Search, Star } from "lucide-react-native"
import * as Location from 'expo-location'
import { useNearbyHotels, useLatestHotels, useOffersHotels } from '@/hooks/useHotels'
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useWishlist } from '@/hooks/useWishlist'

// SVG Icons as components
const MagnifyingGlassIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </Svg>
)

const FilterIcon = ({ size = 16, color = "#374151" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1="4" y1="21" x2="4" y2="14" />
    <Line x1="4" y1="10" x2="4" y2="3" />
    <Line x1="12" y1="21" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12" y2="3" />
    <Line x1="20" y1="21" x2="20" y2="16" />
    <Line x1="20" y1="12" x2="20" y2="3" />
    <Line x1="1" y1="14" x2="7" y2="14" />
    <Line x1="9" y1="8" x2="15" y2="8" />
    <Line x1="17" y1="16" x2="23" y2="16" />
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

const ArrowUpDownIcon = ({ size = 20, color = "currentColor" }) => (
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
    <Path d="M12 2v8" />
    <Path d="m16 6-4 4-4-4" />
    <Path d="M12 14v8" />
    <Path d="m16 20-4-4-4 4" />
  </Svg>
)

const OffersIcon = ({ size = 20, color = "currentColor" }) => (
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
    <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </Svg>
)

const HeartIcon = ({ size = 20, color = "currentColor" }) => (
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
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Svg>
)

interface LocationState {
  coordinates: { lat: number; lng: number } | null
  hasPermission: boolean
  permissionDenied: boolean
  loading: boolean
  error: string | null
}

export default function HotelBookingApp() {
  const [activeTab, setActiveTab] = useState('nearby')
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    hasPermission: false,
    permissionDenied: false,
    loading: false,
    error: null
  })
  const navigation = useNavigation()
  const { addToWishlist, removeFromWishlist, isInWishlist, items: wishlistItems, refresh: refreshWishlist } = useWishlist()
  
  // Wishlist handlers
  const handleWishlistToggle = async (hotel: any) => {
    try {
      const isCurrentlyInWishlist = isInWishlist(hotel.id)
      
      if (isCurrentlyInWishlist) {
        // Find the wishlist item to get its ID for deletion
        const wishlistItem = wishlistItems.find(item => item.hotelId === hotel.id)
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id)
        }
      } else {
        await addToWishlist(hotel.id)
      }
      
      // Force refresh to ensure UI is in sync
      setTimeout(() => refreshWishlist(), 100);
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
    if (activeTab === 'nearby') {
      checkLocationPermission()
    }
  }, [activeTab])

  // Use different hooks based on active tab
  const nearbyData = useNearbyHotels(location.coordinates)
  const latestData = useLatestHotels()
  const offersData = useOffersHotels()

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'nearby':
        return nearbyData
      case 'latest':
        return latestData
      case 'offers':
        return offersData
      default:
        return nearbyData
    }
  }

  const currentData = getCurrentData()

  // console.log('current data is ',currentData)

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="bg-white flex-row items-center w-full px-4 py-3 ">
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 rounded-full px-4 py-3"
            onPress={() => SheetManager.show('search')}
          >
            <Search size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-3 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Anywhere • Any week • Add guests
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  const handleRefresh = () => {
    if (activeTab === 'nearby' && !location.hasPermission) {
      requestLocationPermission()
    } else {
      currentData.refresh()
    }
  }

  const renderLocationPermissionScreen = () => (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Text className="text-6xl mb-4">📍</Text>
      <Text className="text-xl text-gray-900 text-center mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
        Location Access Required
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Please allow location access to see nearby hotels in your area
      </Text>
      <TouchableOpacity
        className="bg-[#FF5A5F] px-6 py-3 rounded-lg mb-3"
        onPress={requestLocationPermission}
        disabled={location.loading}
      >
        <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          {location.loading ? 'Getting Location...' : 'Enable Location'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-6 py-3"
        onPress={() => SheetManager.show('search')}
      >
        <Text className="text-gray-600 text-base" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Search Manually Instead
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderHotelCard = (hotel: any) => (
    <Pressable onPress={() => router.push(`/hotels/${hotel.id}`)} key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      <View className="relative">
        <Image
          source={{ uri: hotel.images[0] }}
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
        <TouchableOpacity 
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full items-center justify-center"
          onPress={() => handleWishlistToggle(hotel)}
        >
          <HeartIcon size={18} color={isInWishlist(hotel.id) ? "#EF4444" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {hotel.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {hotel.location}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-sm text-gray-900 ml-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {hotel.rating}
            </Text>
            {hotel.reviewCount && (
              <Text className="text-sm text-gray-500 ml-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ({hotel.reviewCount})
              </Text>
            )}
          </View>
        </View>

        {hotel.distance && (
          <Text className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {hotel.distance}
          </Text>
        )}

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
    </Pressable>
  );

  const renderCompactHotelCard = (hotel: any) => (
    <Pressable onPress={() => router.push(`/hotels/${hotel.id}`)} key={hotel.id} className="flex-col gap-3 w-72 mr-4">
      <View className="relative w-full overflow-hidden rounded-xl">
        <Image
          source={{ uri: hotel.images[0] }}
          className="w-full h-48 rounded-xl"
          style={{ resizeMode: 'cover' }}
        />
        <TouchableOpacity 
          className="absolute top-3 right-3 rounded-full bg-white/80 p-2"
          onPress={() => handleWishlistToggle(hotel)}
        >
          <HeartIcon size={18} color={isInWishlist(hotel.id) ? "#EF4444" : "#6B7280"} />
        </TouchableOpacity>
        {hotel.offer && (
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-xl">
            <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>{hotel.offer}</Text>
          </View>
        )}
      </View>
      <View>
        <View className="flex-row items-start justify-between">
          <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>{hotel.name}</Text>
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{hotel.rating}</Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{hotel.location}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-base text-gray-800" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>₹{hotel.price.toLocaleString()} </Text>
          {hotel.originalPrice && (
            <Text className="text-sm text-gray-500 line-through" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>₹{hotel.originalPrice.toLocaleString()}</Text>
          )}
          <Text className="text-sm text-gray-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}> / night</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => {
    const getEmptyStateContent = () => {
      switch (activeTab) {
        case 'nearby':
          return {
            title: 'No nearby hotels found',
            subtitle: 'We couldn\'t find any hotels in your area. Try searching in a different location.',
            icon: '📍'
          }
        case 'latest':
          return {
            title: 'No latest hotels available',
            subtitle: 'Check back later for newly added hotels and accommodations.',
            icon: '🆕'
          }
        case 'offers':
          return {
            title: 'No offers available',
            subtitle: 'There are currently no special offers. Check back soon for great deals!',
            icon: '🎉'
          }
        default:
          return {
            title: 'No hotels found',
            subtitle: 'Try refreshing or check back later.',
            icon: '🏨'
          }
      }
    }

    const content = getEmptyStateContent()

    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Text className="text-6xl mb-4">{content.icon}</Text>
        <Text className="text-xl text-gray-900 text-center mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          {content.title}
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {content.subtitle}
        </Text>
        <TouchableOpacity
          className="bg-[#FF5A5F] px-6 py-3 rounded-lg"
          onPress={() => SheetManager.show('search')}
        >
          <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Search Hotels
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderErrorState = () => (
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
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Navigation Tabs */}
      <View className="px-4 pt-3 bg-white">
        <View className="flex-row justify-between border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center gap-2 border-b-2 ${activeTab === 'nearby' ? 'border-red-500' : 'border-transparent'} py-3`}
            onPress={() => setActiveTab('nearby')}
          >
            <LocationIcon size={18} color={activeTab === 'nearby' ? '#EF4444' : '#6B7280'} />
            <Text className={`text-sm ${activeTab === 'nearby' ? 'text-red-500' : 'text-gray-500'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center gap-2 border-b-2 ${activeTab === 'latest' ? 'border-red-500' : 'border-transparent'} py-3`}
            onPress={() => setActiveTab('latest')}
          >
            <ArrowUpDownIcon size={18} color={activeTab === 'latest' ? '#EF4444' : '#6B7280'} />
            <Text className={`text-sm ${activeTab === 'latest' ? 'text-red-500' : 'text-gray-500'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center gap-2 border-b-2 ${activeTab === 'offers' ? 'border-red-500' : 'border-transparent'} py-3`}
            onPress={() => setActiveTab('offers')}
          >
            <OffersIcon size={18} color={activeTab === 'offers' ? '#EF4444' : '#6B7280'} />
            <Text className={`text-sm ${activeTab === 'offers' ? 'text-red-500' : 'text-gray-500'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>Offers</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === 'nearby' ? location.loading || currentData.refreshing : currentData.refreshing}
            onRefresh={handleRefresh}
            colors={['#FF5A5F']}
            tintColor="#FF5A5F"
          />
        }
      >
        {/* Show location permission screen for nearby tab if permission is needed */}
        {activeTab === 'nearby' && !location.hasPermission && !location.loading && (
          renderLocationPermissionScreen()
        )}

        {/* Show loading state for location */}
        {activeTab === 'nearby' && location.loading && (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Getting your location...
            </Text>
          </View>
        )}

        {/* Hotel Listings - only show if we have location permission for nearby tab or other tabs */}
        {(activeTab !== 'nearby' || location.hasPermission) && (
          <View className="px-4 py-4">
            {currentData.loading ? (
              <View className="gap-6">
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
              </View>
            ) : currentData.error ? (
              renderErrorState()
            ) : currentData.hotels.length === 0 ? (
              renderEmptyState()
            ) : (
              <View className="gap-6">
                {currentData.hotels.map(renderHotelCard)}
              </View>
            )}
          </View>
        )}

        {/* Only show additional sections if we have hotels and not in loading/error state */}
        {(activeTab !== 'nearby' || location.hasPermission) && !currentData.loading && !currentData.error && currentData.hotels.length > 0 && (
          <>
            {/* Deals & Coupons */}
            <View className="px-4 flex-col gap-4 mt-4">
              <Text className="text-gray-900 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Deals & Coupons</Text>
              <View className="bg-white p-4 rounded-xl flex-row items-center justify-between gap-4 border border-gray-100">
                <View className="flex-col gap-2 flex-1">
                  <Text className="text-gray-900 text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Last Minute Deals</Text>
                  <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Up to 30% off on select hotels</Text>
                  <TouchableOpacity className="bg-red-500 rounded-lg h-10 px-4 justify-center items-center mt-2 self-start">
                    <Text className="text-white text-sm" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>View Deals</Text>
                  </TouchableOpacity>
                </View>
                <ImageBackground
                  source={{
                    uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"
                  }}
                  className="w-20 h-20 rounded-lg"
                  style={{ resizeMode: 'cover' }}
                />
              </View>
            </View>

            {/* Featured Hotels Section */}
            <View className="px-4 flex-col gap-4 mt-4">
              <Text className="text-gray-900 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Featured Hotels</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
                <View className="flex-row">
                  {currentData.hotels.slice(0, 3).map(renderCompactHotelCard)}
                </View>
              </ScrollView>
            </View>
          </>
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  )
}