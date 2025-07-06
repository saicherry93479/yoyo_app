import React, { useState, useLayoutEffect } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native"
import { Svg, Path } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { router } from "expo-router"

// Plus Icon Component
const PlusIcon = ({ size = 24, color = "#FF5A5F" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
)

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    hotelName: 'The Oberoi Mumbai',
    location: 'Nariman Point, Mumbai',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    guests: 2,
    status: 'confirmed',
    totalAmount: 45000,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2024-02-10',
    roomType: 'Deluxe Ocean View',
    nights: 3
  },
  {
    id: '2',
    hotelName: 'Taj Mahal Palace',
    location: 'Colaba, Mumbai',
    checkIn: '2024-04-20',
    checkOut: '2024-04-23',
    guests: 2,
    status: 'upcoming',
    totalAmount: 75000,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2024-02-15',
    roomType: 'Heritage Suite',
    nights: 3
  },
  {
    id: '3',
    hotelName: 'Grand Hyatt Goa',
    location: 'Bambolim, Goa',
    checkIn: '2024-01-10',
    checkOut: '2024-01-14',
    guests: 4,
    status: 'completed',
    totalAmount: 32000,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2023-12-20',
    roomType: 'Family Suite',
    nights: 4
  }
];

export default function MyTripsApp() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const navigation = useNavigation()

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="flex-row items-center justify-between p-4">
          <View className="w-8"></View>
          <Text className="text-xl text-center flex-1 text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>My Trips</Text>
          <TouchableOpacity 
            className="flex items-center justify-center w-8 h-8 rounded-full"
            onPress={() => router.push('/(tabs)/search')}
          >
            <PlusIcon size={24} color="#FF5A5F" />
          </TouchableOpacity>
        </View>
      )
    })
  }, [navigation])

  const getFilteredBookings = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return mockBookings.filter(booking => {
      if (activeTab === 'upcoming') {
        return booking.checkIn >= today;
      } else {
        return booking.checkIn < today;
      }
    });
  };

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
      case 'upcoming':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderBookingCard = (booking: any) => (
    <TouchableOpacity
      key={booking.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      onPress={() => router.push(`/booking-details/${booking.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: booking.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className={`absolute top-3 right-3 px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
          <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {booking.status}
          </Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          {booking.hotelName}
        </Text>
        <Text className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {booking.location}
        </Text>
        
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Check-in
            </Text>
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {formatDate(booking.checkIn)}
            </Text>
          </View>
          <View className="w-8 h-px bg-gray-300" />
          <View>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Check-out
            </Text>
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {formatDate(booking.checkOut)}
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
              {booking.nights} nights
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredBookings = getFilteredBookings();

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
      {filteredBookings.length === 0 ? (
        <View className="flex-1 bg-gray-50 p-6">
          <View className="flex-1 flex-col items-center justify-center text-center">
            {/* Luggage Illustration */}
            <View className="mb-6">
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=300"
                }}
                className="w-48 h-48"
                resizeMode="contain"
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
        </View>
      ) : (
        <ScrollView className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
          {filteredBookings.map(renderBookingCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}