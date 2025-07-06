import React, { useState, useLayoutEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView, Pressable } from "react-native"
import { Svg, Path, Line, Circle } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { router } from "expo-router"
import { SheetManager } from "react-native-actions-sheet"

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

const StarIcon = ({ size = 16, color = "#EAB308" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Svg>
)

export default function HotelBookingApp() {
  const [activeTab, setActiveTab] = useState('nearby')
  const navigation = useNavigation()

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (


        <Pressable onPressIn={()=>SheetManager.show('search')} className="flex-row items-center justify-between rounded-full border border-gray-200 bg-white p-2 w-full">
          <View className="flex-row items-center gap-2">
            <View className="text-red-500">
              <MagnifyingGlassIcon size={24} color="#EF4444" />
            </View>
            <View className="flex-col">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>Where to?</Text>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Anywhere • Any week • Add guests</Text>
            </View>
          </View>
          <TouchableOpacity className="rounded-full border border-gray-300 p-2">
            <FilterIcon />
          </TouchableOpacity>
        </Pressable>


      ),
      headerTitleAlign: 'left',

    });
  }, [navigation]);

  const nearbyHotels = [
    {
      id: 1,
      name: "Cozy Inn, New York",
      location: "1.2 miles away",
      rating: 4.8,
      price: 120,
      originalPrice: 150,
      offer: "20% OFF Summer Special",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhcsD7EmnPc6ROcNp90satGseTUmu271XK4BavLgJoNulbsMfRRScec78pWz1jSXU-SShwBJO7sL306T4pmb6yaUmG_oJWUpPRQzsmuRPDkOFvunVfZHzhmRFEdLO9v8-Xfc0qk8S86fHUIhtQ49PlhLCvRHNpsbnQwi634a2tARuxrsyE1G2PcbN_zr0_WVYHAtQFOAWTMQTixfYu7g8kyT3GL5ROeaslDwvn0e65B6mX5BirCWJLLcCdpxTPpN7fCnibl3V95w"
    },
    {
      id: 2,
      name: "Boutique Hotel, Brooklyn",
      location: "2.5 miles away",
      rating: 4.6,
      price: 95,
      originalPrice: null,
      offer: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiqHPvealkHwyJl8DZoUNobsVrB5lLptZOaeJf8URhB0lpKPI70bVXSDo7nM4mBNOr98BTS3Z-jOz5STq52tBXmQ_-brLeeqDYHxCTYAGO9eCPpe91EWCcxqw54lObixXyIedacK_dj4PU1EXiwoVcbRR9eIbhinBR1q5euJ535TuVXgkbK0NwVbQDVZnuiHaJfUkr9D8EEuahiNGI2532kWeJLpphixKEj2RTU4Y4myaGcJ8SWbu9PWda4Uh2D9CvOvUHtdpK3Q"
    }
  ]

  const latestHotels = [
    {
      id: 3,
      name: "Grand Plaza, Paris",
      location: "Center of the city",
      rating: 4.9,
      price: 250,
      originalPrice: null,
      offer: "Limited Time Offer: Free Breakfast",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiqHPvealkHwyJl8DZoUNobsVrB5lLptZOaeJf8URhB0lpKPI70bVXSDo7nM4mBNOr98BTS3Z-jOz5STq52tBXmQ_-brLeeqDYHxCTYAGO9eCPpe91EWCcxqw54lObixXyIedacK_dj4PU1EXiwoVcbRR9eIbhinBR1q5euJ535TuVXgkbK0NwVbQDVZnuiHaJfUkr9D8EEuahiNGI2532kWeJLpphixKEj2RTU4Y4myaGcJ8SWbu9PWda4Uh2D9CvOvUHtdpK3Q"
    },
    {
      id: 4,
      name: "Modern Suites, London",
      location: "Thames District",
      rating: 4.7,
      price: 180,
      originalPrice: null,
      offer: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhcsD7EmnPc6ROcNp90satGseTUmu271XK4BavLgJoNulbsMfRRScec78pWz1jSXU-SShwBJO7sL306T4pmb6yaUmG_oJWUpPRQzsmuRPDkOFvunVfZHzhmRFEdLO9v8-Xfc0qk8S86fHUIhtQ49PlhLCvRHNpsbnQwi634a2tARuxrsyE1G2PcbN_zr0_WVYHAtQFOAWTMQTixfYu7g8kyT3GL5ROeaslDwvn0e65B6mX5BirCWJLLcCdpxTPpN7fCnibl3V95w"
    }
  ]

  const offerHotels = [
    {
      id: 5,
      name: "Luxury Resort, Maldives",
      location: "Beachfront Paradise",
      rating: 4.9,
      price: 299,
      originalPrice: 399,
      offer: "25% OFF Early Bird Special",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1uDq5Yc4tqP576GVTNZ2-I4zrkBJgbBPzsB6JiUruj8-j06sjA2CcJUjEs29Cu3oMJZjs0WsU49YTBRskY2UWQZzGHt0KTBjz9zqi4HMO2bSVaTxALB_tSiCMsdPGQboWfeme7jmpP6DYHBCUNFUlpHl5UAWLc_s8-uN_N9gzbV1wJi2JfT5oYkfprUyuSmslOhYU4EahEIEACNKjmS8KoE6yqsnf7AjyAPCA_zncEKdX2QaEIDlsnHtbwRnVFeL93D19FJ963w"
    },
    {
      id: 6,
      name: "Spa Hotel, Bali",
      location: "Tropical Gardens",
      rating: 4.8,
      price: 150,
      originalPrice: 200,
      offer: "Free Spa Treatment Included",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhcsD7EmnPc6ROcNp90satGseTUmu271XK4BavLgJoNulbsMfRRScec78pWz1jSXU-SShwBJO7sL306T4pmb6yaUmG_oJWUpPRQzsmuRPDkOFvunVfZHzhmRFEdLO9v8-Xfc0qk8S86fHUIhtQ49PlhLCvRHNpsbnQwi634a2tARuxrsyE1G2PcbN_zr0_WVYHAtQFOAWTMQTixfYu7g8kyT3GL5ROeaslDwvn0e65B6mX5BirCWJLLcCdpxTPpN7fCnibl3V95w"
    }
  ]

  const getCurrentHotels = () => {
    switch (activeTab) {
      case 'nearby':
        return nearbyHotels
      case 'latest':
        return latestHotels
      case 'offers':
        return offerHotels
      default:
        return nearbyHotels
    }
  }

  const renderHotelCard = (hotel) => (
    <Pressable onPress={() => router.push('/hotels/1')} key={hotel.id} className="flex-col gap-3">
      <View className="relative w-full overflow-hidden rounded-xl">
        <ImageBackground
          source={{ uri: hotel.image }}
          className="w-full h-72 rounded-xl"
          resizeMode="cover"
        >
          <TouchableOpacity className="absolute top-3 right-3 rounded-full bg-white/80 p-2">
            <HeartIcon size={18} />
          </TouchableOpacity>
          {hotel.offer && (
            <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-xl">
              <Text className="text-white text-sm " style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>{hotel.offer}</Text>
            </View>
          )}
        </ImageBackground>
      </View>
      <View>
        <View className="flex-row items-start justify-between">
          <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>{hotel.name}</Text>
          <View className="flex-row items-center gap-1">
            <StarIcon size={14} />
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{hotel.rating}</Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{hotel.location}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-base text-gray-800" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>${hotel.price} </Text>
          {hotel.originalPrice && (
            <Text className="text-sm text-gray-500 line-through" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>${hotel.originalPrice}</Text>
          )}
          <Text className="text-sm text-gray-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}> / night</Text>
        </View>
      </View>
    </Pressable>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Custom Header with Search Bar */}
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


      <ScrollView className="flex-1"  // Makes the tabs sticky
        showsVerticalScrollIndicator={false}>



        {/* Hotel Listings */}
        <View className="px-4 py-4">
          <View className="gap-6">
            {getCurrentHotels().map(renderHotelCard)}
          </View>
        </View>

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
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1uDq5Yc4tqP576GVTNZ2-I4zrkBJgbBPzsB6JiUruj8-j06sjA2CcJUjEs29Cu3oMJZjs0WsU49YTBRskY2UWQZzGHt0KTBjz9zqi4HMO2bSVaTxALB_tSiCMsdPGQboWfeme7jmpP6DYHBCUNFUlpHl5UAWLc_s8-uN_N9gzbV1wJi2JfT5oYkfprUyuSmslOhYU4EahEIEACNKjmS8KoE6yqsnf7AjyAPCA_zncEKdX2QaEIDlsnHtbwRnVFeL93D19FJ963w",
              }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  )
}