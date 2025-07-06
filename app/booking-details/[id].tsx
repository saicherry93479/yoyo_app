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
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { Calendar, MapPin, Users, Phone, Mail, MessageCircle, Download, Share2 } from 'lucide-react-native';

// Mock booking data - in real app, this would come from API
const getBookingById = (id: string) => {
  const bookings = {
    '1': {
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
      nights: 3,
      bookingReference: 'OB2024001',
      hotelPhone: '+91 22 6632 5757',
      hotelEmail: 'reservations@oberoihotels.com',
      address: 'Nariman Point, Mumbai, Maharashtra 400021',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center'],
      cancellationPolicy: 'Free cancellation until 24 hours before check-in',
      priceBreakdown: {
        roomRate: 12000,
        nights: 3,
        subtotal: 36000,
        taxes: 6480,
        serviceFee: 2520,
        total: 45000
      }
    },
    '2': {
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
      nights: 3,
      bookingReference: 'TMP2024002',
      hotelPhone: '+91 22 6665 3366',
      hotelEmail: 'reservations.mumbai@tajhotels.com',
      address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
      cancellationPolicy: 'Free cancellation until 48 hours before check-in',
      priceBreakdown: {
        roomRate: 20000,
        nights: 3,
        subtotal: 60000,
        taxes: 10800,
        serviceFee: 4200,
        total: 75000
      }
    },
    '3': {
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
      nights: 4,
      bookingReference: 'GHG2024003',
      hotelPhone: '+91 832 2717 1234',
      hotelEmail: 'goa.grand@hyatt.com',
      address: 'P.O. Bambolim, Goa 403202',
      amenities: ['Free WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Kids Club'],
      cancellationPolicy: 'Non-refundable booking',
      priceBreakdown: {
        roomRate: 6500,
        nights: 4,
        subtotal: 26000,
        taxes: 4680,
        serviceFee: 1320,
        total: 32000
      }
    }
  };
  
  return bookings[id as keyof typeof bookings] || null;
};

const BookingDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const booking = getBookingById(id as string);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Booking Details
        </Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Booking not found
        </Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleContactHotel = () => {
    SheetManager.show('contact-hotel', {
      payload: {
        hotelName: booking.hotelName,
        phone: booking.hotelPhone,
        email: booking.hotelEmail
      }
    });
  };

  const handleModifyBooking = () => {
    SheetManager.show('modify-booking', {
      payload: {
        bookingId: booking.id,
        canCancel: booking.status === 'upcoming' || booking.status === 'confirmed',
        canModify: booking.status === 'upcoming' || booking.status === 'confirmed'
      }
    });
  };

  const handleShareBooking = () => {
    // Implement share functionality
    console.log('Share booking');
  };

  const handleDownloadReceipt = () => {
    // Implement download functionality
    console.log('Download receipt');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hotel Image and Status */}
        <View className="relative">
          <Image
            source={{ uri: booking.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          <View className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
            <Text className="text-sm capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {booking.status}
            </Text>
          </View>
        </View>

        {/* Booking Reference */}
        <View className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Booking Reference
          </Text>
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            {booking.bookingReference}
          </Text>
        </View>

        {/* Hotel Information */}
        <View className="px-6 py-6">
          <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            {booking.hotelName}
          </Text>
          <View className="flex-row items-center mb-4">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {booking.address}
            </Text>
          </View>
          <Text className="text-lg text-gray-800 mb-4" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {booking.roomType}
          </Text>
        </View>

        {/* Trip Details */}
        <View className="px-6 py-6 border-t border-gray-100">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Trip Details
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Calendar size={20} color="#FF5A5F" />
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Check-in
                </Text>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {formatDate(booking.checkIn)}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <Calendar size={20} color="#FF5A5F" />
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Check-out
                </Text>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {formatDate(booking.checkOut)}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <Users size={20} color="#FF5A5F" />
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Guests
                </Text>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="px-6 py-6 border-t border-gray-100">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Price Breakdown
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.roomRate.toLocaleString()} × {booking.nights} nights
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.subtotal.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Taxes and fees
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.taxes.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Service fee
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.serviceFee.toLocaleString()}
              </Text>
            </View>
            <View className="border-t border-gray-200 pt-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-900 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Total
                </Text>
                <Text className="text-gray-900 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  ₹{booking.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View className="px-6 py-6 border-t border-gray-100">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Amenities
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {booking.amenities.map((amenity, index) => (
              <View key={index} className="bg-gray-100 px-3 py-2 rounded-full">
                <Text className="text-sm text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cancellation Policy */}
        <View className="px-6 py-6 border-t border-gray-100">
          <Text className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Cancellation Policy
          </Text>
          <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {booking.cancellationPolicy}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="px-6 py-6 border-t border-gray-100 space-y-3">
          <TouchableOpacity
            className="w-full h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
            onPress={handleContactHotel}
          >
            <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Contact Hotel
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center flex-row"
              onPress={handleModifyBooking}
            >
              <Text className="text-gray-700 text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Modify Booking
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center flex-row"
              onPress={handleShareBooking}
            >
              <Share2 size={16} color="#374151" />
              <Text className="text-gray-700 text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            className="w-full h-12 border border-gray-300 rounded-lg items-center justify-center flex-row"
            onPress={handleDownloadReceipt}
          >
            <Download size={16} color="#374151" />
            <Text className="text-gray-700 text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Download Receipt
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;