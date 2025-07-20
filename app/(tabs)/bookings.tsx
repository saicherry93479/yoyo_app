import React, { useState, useLayoutEffect } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native"
import { Svg, Path } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { router } from "expo-router"
import { useBookings } from '@/hooks/useBookings'
import { BookingCardSkeleton } from '@/components/ui/SkeletonLoader'

// Plus Icon Component
const PlusIcon = ({ size = 24, color = "#FF5A5F" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
)

export default function MyTripsApp() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const navigation = useNavigation()
  
  const { bookings, loading, error, refresh, getUpcomingBookings, getPastBookings } = useBookings()
  
  // Get filtered bookings based on active tab
  const getFilteredBookings = () => {
    if (activeTab === 'upcoming') {
      return getUpcomingBookings();
    } else {
      return getPastBookings();
    }
  };
  
  const filteredBookings = getFilteredBookings();

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-2xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Bookings</Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const renderBookingCard = (booking: any) => {
    const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
    
    return (
      <TouchableOpacity
        key={booking.id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
        onPress={() => router.push(`/booking-details/${booking.id}`)}
      >
        <View className="relative">
          {/* You'll need to get hotel image from hotel details API */}
          <Image
            source={{ 
              uri: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800" 
            }}
            className="w-full h-48"
            style={{ resizeMode: 'cover' }}
          />
          <View className={`absolute top-3 right-3 px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {booking.status}
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* You'll need to fetch hotel details to get name and location */}
          <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Hotel Booking #{booking.id.slice(-8)}
          </Text>
          <Text className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Hotel ID: {booking.hotelId}
          </Text>

          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Check-in
              </Text>
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {formatDate(booking.checkInDate)}
              </Text>
            </View>
            <View className="w-8 h-px bg-gray-300" />
            <View>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Check-out
              </Text>
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {formatDate(booking.checkOutDate)}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Guests
              </Text>
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {booking.guests}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View>
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Total amount
              </Text>
              <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                ₹{booking.totalAmount.toLocaleString()}
              </Text>
            </View>
            <View className="bg-gray-50 px-3 py-1 rounded">
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                {nights} nights
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 text-center py-3 ${activeTab === 'upcoming' ? 'border-b-2 border-[#FF5A5F]' : ''}`}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`text-center ${activeTab === 'upcoming' ? 'text-[#FF5A5F]' : 'text-gray-500'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 text-center py-3 ${activeTab === 'past' ? 'border-b-2 border-[#FF5A5F]' : ''}`}
            onPress={() => setActiveTab('past')}
          >
            <Text className={`text-center ${activeTab === 'past' ? 'text-[#FF5A5F]' : 'text-gray-500'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-gray-50 p-4">
        {loading ? (
          <View>
            {Array.from({ length: 3 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))}
          </View>
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
        ) : filteredBookings.length === 0 ? (
          <View className="flex-col items-center justify-center text-center p-6">
            {/* Luggage Illustration */}
            <View className="mb-6">
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=300"
                }}
                className="w-48 h-48"
                style={{ resizeMode: 'contain' }}
              />
            </View>

            {/* Title */}
            <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
            </Text>

            {/* Description */}
            <Text className="text-gray-600 max-w-xs mx-auto mb-8 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {activeTab === 'upcoming'
                ? "It looks like you haven't booked anything yet. Let's find your next destination!"
                : "You haven't completed any trips yet. Start exploring to create amazing memories!"
              }
            </Text>

            {/* CTA Button */}
            <TouchableOpacity
              className="w-full max-w-xs items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#FF5A5F] shadow-lg"
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Start Exploring
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredBookings.map(renderBookingCard)
        )}
      </ScrollView>
    </SafeAreaView>
  )
}