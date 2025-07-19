import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { X, Bed, Clock, Tag } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SheetManager } from 'react-native-actions-sheet';
import Svg, { Path } from 'react-native-svg';

// Define the RoomIcon component directly
const RoomIcon = () => (
  <Bed size={16} color="#6B7280" />
);

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Extract booking data from params with safe parsing
    const bookingData = {
      hotelId: String(params.hotelId || ''),
      roomId: String(params.roomId || ''),
      checkIn: String(params.checkIn || ''),
      checkOut: String(params.checkOut || ''),
      guests: parseInt(String(params.guests || '2'), 10) || 2,
      hotelName: String(params.hotelName || ''),
      roomName: String(params.roomName || ''),
      totalAmount: parseFloat(String(params.totalAmount || '0')) || 0,
      address: String(params.address || ''),
      image: String(params.image || '')
    };

useLayoutEffect(() => {
        navigation.setOptions({
          headerShadowVisible: false,
          headerTitle: () => (
            <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Checkout</Text>
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <X size={24} color="#121516" />
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

    // Handle booking creation
    const handleConfirmBooking = async () => {
      try {
        setLoading(true);

        // Validate required fields
        if (!bookingData.hotelId || !bookingData.roomId || !bookingData.checkIn || !bookingData.checkOut) {
          Alert.alert('Error', 'Missing required booking information. Please go back and try again.');
          setLoading(false);
          return;
        }

        const bookingRequest = {
          hotelId: bookingData.hotelId,
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          specialRequests: '' // Can be added later if needed
        }; 

        console.log('booking request ',bookingRequest)


        const response = await apiService.post('/bookings/', bookingRequest);
        console.log('response in checkoutr ',response)
        if (response.success) {
          Alert.alert(
            'Booking Confirmed!',
            'Your booking has been successfully created.',
            [
              {
                text: 'View Booking',
                onPress: () => {
                  router.replace('/(tabs)/bookings');
                }
              }
            ]
          );
        } else {
          Alert.alert('Booking Failed',  'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Booking error:', error);
        Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    // Calculate nights
    const calculateNights = () => {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    const nights = calculateNights();
    const subtotal = bookingData.totalAmount * nights;
    const taxes = 0; // As requested, keeping taxes as 0
    const total = subtotal + taxes - discountAmount;

    const handleCouponApplied = (validationData: any) => {
        setAppliedCoupon(validationData.coupon);
        setDiscountAmount(validationData.discountAmount);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
    };

    const openCouponsSheet = () => {
        SheetManager.show('coupons-sheet', {
            payload: {
                hotelId: bookingData.hotelId,
                roomTypeId: bookingData.roomId,
                orderAmount: subtotal,
                onCouponApplied: handleCouponApplied,
            },
        });
    };

    const VisaIcon = () => (
        <Svg width="48" height="32" viewBox="0 0 38 24">
            <Path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07" />
            <Path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff" />
            <Path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm-5.5 7.5c.3-1.1.5-1.8.6-2.2l-2.8-5.3h2.2l1.2 2.8 1.1-2.8h2l-2.1 6.6c-.2.6-.4 1.1-.7 1.6l-1.9-1.6c.2-.5.4-.9.5-1.3zm-14.2-7.5h-2.2l-3.6 8.9c-.2.5-.3.7-.3.7h1.6l.5-1.4h2.5l.3 1.4h1.9l-2.1-8.9zm-2.2 5.6l1-2.5.8 2.5h-1.8z" fill="#01579B" />
            <Path d="M12.2 12.2c-.3-2.5-.9-4.8-2.8-4.8s-2.5 2.3-2.8 4.8c.2-2.3.8-4.1 2.3-4.1s2.1 1.8 2.3 4.1zm-3.9 5.3c.3.4.8.6 1.3.6s1-.2 1.3-.6c-.2.4-.6.7-1.3.7s-1.1-.3-1.3-.7z" fill="#F79E1B" />
        </Svg>
    );

    const ChevronIcon = () => (
        <Svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <Path d="M96,48H208a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm112,56H96a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Zm0,64H96a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16ZM48,80a20,20,0,1,0-20-20A20,20,0,0,0,48,80Zm0,64a20,20,0,1,0-20-20A20,20,0,0,0,48,144Zm0,64a20,20,0,1,0-20-20A20,20,0,0,0,48,208Z" />
        </Svg>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-between">
                {/* Header */}


                {/* Scrollable Content */}
                <ScrollView className="flex-1 px-6 py-6">
                    {/* Room Card */}
                    <View className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <View className="w-24 h-24 rounded-xl overflow-hidden">
                            <Image
                                source={{
                                    uri: bookingData.image
                                }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-gray-500 text-xs uppercase tracking-wider" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                                {bookingData.hotelName}
                            </Text>
                            <Text className="text-[#161312] text-lg  mt-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                {bookingData.roomName}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <View className="text-gray-500">
                                    <Clock size={16} color="#6B7280" />
                                </View>
                                <Text className="text-gray-500 text-sm ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    {nights} {nights === 1 ? 'night' : 'nights'}
                                </Text>
                            </View>
                            <View className="flex-row items-center mt-2">
                                <View className="text-gray-500">
                                    <RoomIcon />
                                </View>
                                <Text className="text-gray-500 text-sm ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    {bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-100 -mx-6 mb-6" />

                    {/* Dates */}
                    <View className="flex-row bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <View className="flex-1">
                            <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Check-in</Text>
                            <Text className="text-[#161312] text-lg mt-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                {formatDate(bookingData.checkIn)}
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                After 2:00 PM
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Check-out</Text>
                            <Text className="text-[#161312] text-lg mt-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                {formatDate(bookingData.checkOut)}
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Before 12:00 PM
                            </Text>
                        </View>
                        <View className="items-center justify-center">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                <Text className="text-[#161312] text-sm" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{bookingData.guests}</Text>
                            </View>
                            <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Guests</Text>
                        </View>
                    </View>

                    {/* Price Breakdown */}
                    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <Text className="text-[#161312] text-lg mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Price Details
                        </Text>

                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                ₹{bookingData.totalAmount.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}
                            </Text>
                            <Text className="text-[#161312]" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                ₹{subtotal.toLocaleString()}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Taxes and fees
                            </Text>
                            <Text className="text-[#161312]" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                ₹{taxes.toLocaleString()}
                            </Text>
                        </View>

                        {/* Coupon Section */}
                        {appliedCoupon ? (
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Tag size={16} color="#22C55E" />
                                    <Text className="text-green-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {appliedCoupon.code}
                                    </Text>
                                    <TouchableOpacity onPress={handleRemoveCoupon} className="ml-2">
                                        <X size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-green-600" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    -₹{discountAmount.toLocaleString()}
                                </Text>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                onPress={openCouponsSheet}
                                className="flex-row justify-between items-center mb-3 p-3 rounded-lg border border-dashed border-red-300 bg-red-50"
                            >
                                <View className="flex-row items-center">
                                    <Tag size={16} color="#DC2626" />
                                    <Text className="text-red-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        Apply Coupon
                                    </Text>
                                </View>
                                <Text className="text-red-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Save more
                                </Text>
                            </TouchableOpacity>
                        )}

                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[#161312] text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    Total
                                </Text>
                                <Text className="text-[#161312] text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    ₹{total.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Cancellation Policy Section */}
                    <View className="mb-6">
                        <Text className="text-[#161312] text-lg  mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Cancellation Policy
                        </Text>
                        <Text className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Cancel before{' '}
                            <Text className="font-semibold text-gray-800" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Jul 10, 2024
                            </Text>
                            {' '}for a partial refund. After that, this reservation is non-refundable.{' '}
                            <Text className="text-[#e1a9a1] " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Learn more
                            </Text>
                        </Text>
                    </View>
                </ScrollView>

                {/* Confirm Button */}
                <View className="px-6 py-4">
                    <TouchableOpacity
                        className={`w-full p-4 rounded-2xl items-center ${loading ? 'bg-gray-400' : 'bg-[#FF5A5F]'}`}
                        onPress={handleConfirmBooking}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner size="small" color="white" />
                        ) : (
                            <Text className="text-white text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Confirm Booking
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CheckoutScreen;