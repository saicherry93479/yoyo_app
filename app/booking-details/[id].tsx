import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { Calendar, MapPin, Users, Phone, Mail, MessageCircle, Download, X, Plus } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { MockBooking } from '@/services/mockData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useBookings } from '@/hooks/useBookings';

const BookingDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [booking, setBooking] = useState<MockBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { refresh: refreshBookings } = useBookings();

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(`/bookings/${id}/details`);

      console.log('response in booking details  ', JSON.stringify(response))

      if (response.success) {
        setBooking(response.data.booking);
      } else {
        setError(response.error || 'Failed to fetch booking details');
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
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Booking Details
        </Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    router.push({
      pathname: '/cancel-booking',
      params: {
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        hotelName: booking.hotelName,
        totalAmount: booking.totalAmount.toString(),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      }
    });
  };

  const formatDate = (dateString: string) => {
    // Remove the 'Z' to treat it as local time instead of UTC
    const localDateString = dateString.replace('Z', '');
    const date = new Date(localDateString);

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTime = (dateString: string) => {
    console.log('dateString', dateString);
    const date = new Date(dateString); // Don't add 'Z'
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  const generateReceiptHTML = (booking: MockBooking) => {
    const addonsHTML = booking.addons && booking.addons.length > 0 ? `
      <div class="section">
        <div class="section-title">Add-ons</div>
        ${booking.addons.map(addon => `
          <div class="detail-row">
            <span>${addon.name} (x${addon.quantity}):</span>
            <span>₹${addon.totalPrice.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .booking-ref { background: #f5f5f5; padding: 10px; margin: 20px 0; text-align: center; }
          .section { margin: 20px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; }
          .detail-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
          .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
          .status.confirmed { background: #d4edda; color: #155724; }
          .status.cancelled { background: #f8d7da; color: #721c24; }
          .status.completed { background: #cce5ff; color: #004085; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Receipt</h1>
          <p>Thank you for choosing our service</p>
        </div>
        
        <div class="booking-ref">
          <h2>Booking Reference: ${booking.bookingReference}</h2>
          <span class="status ${booking.status}">${booking.status.toUpperCase()}</span>
        </div>
        
        <div class="section">
          <div class="section-title">Hotel Information</div>
          <div class="detail-row">
            <span>Hotel Name:</span>
            <span>${booking.hotelName}</span>
          </div>
          <div class="detail-row">
            <span>Address:</span>
            <span>${booking.address}</span>
          </div>
          <div class="detail-row">
            <span>Room Type:</span>
            <span>${booking.roomType}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Trip Details</div>
          <div class="detail-row">
            <span>Check-in:</span>
            <span>${formatDate(booking.checkIn)}</span>
          </div>
          <div class="detail-row">
            <span>Check-out:</span>
            <span>${formatDate(booking.checkOut)}</span>
          </div>
          <div class="detail-row">
            <span>Guests:</span>
            <span>${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}</span>
          </div>
         <div class="detail-row">
          <span>Nights:</span>
          <span>
            ${booking.nights}
            ${booking.bookingType === 'daily'
        ? booking.nights === 1
          ? 'night'
          : 'nights'
        : booking.nights === 1
          ? 'hour'
          : 'hours'
      }
          </span>
        </div>

        </div>
        
        <div class="section">
          <div class="section-title">Price Breakdown</div>
         <div class="detail-row">
            <span>
              ₹${booking.priceBreakdown.roomRate.toLocaleString()} × ${booking.nights}
              ${booking.bookingType === 'daily'
        ? booking.nights === 1
          ? 'night'
          : 'nights'
        : booking.nights === 1
          ? 'hour'
          : 'hours'
      }:
            </span>
            <span>₹${booking.priceBreakdown.subtotal.toLocaleString()}</span>
          </div>

          <div class="detail-row">
            <span>Taxes and fees:</span>
            <span>₹${booking.priceBreakdown.taxes.toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <span>Service fee:</span>
            <span>₹${booking.priceBreakdown.serviceFee.toLocaleString()}</span>
          </div>
          <div class="detail-row total">
            <span>Total:</span>
            <span>₹${booking.totalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        ${addonsHTML}
        
        <div class="section">
          <div class="section-title">Amenities</div>
          <p>${booking.amenities.join(', ')}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Cancellation Policy</div>
          <p>${booking.cancellationPolicy}</p>
        </div>
        
        <div class="section">
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadReceipt = async () => {
    if (!booking) return;

    try {
      const html = generateReceiptHTML(booking);
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const filename = `booking_receipt_${booking.bookingReference}.pdf`;
      const documentsDir = FileSystem.documentDirectory;
      const newPath = `${documentsDir}${filename}`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
      } else {
        Alert.alert('Success', `Receipt saved to ${newPath}`);
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      Alert.alert('Error', 'Failed to generate receipt. Please try again.');
    }
  };

  const handleContactHotel = () => {
    const contactOptions = [];

    if (booking?.hotelPhone) {
      contactOptions.push({
        title: 'Call Hotel',
        icon: 'phone',
        onPress: () => Linking.openURL(`tel:${booking.hotelPhone}`)
      });

      contactOptions.push({
        title: 'WhatsApp',
        icon: 'whatsapp',
        onPress: () => {
          const whatsappUrl = `whatsapp://send?phone=${booking.hotelPhone.replace(/\D/g, '')}&text=Hi, I have a booking inquiry regarding ${booking.bookingReference}`;
          Linking.canOpenURL(whatsappUrl).then(supported => {
            if (supported) {
              Linking.openURL(whatsappUrl);
            } else {
              Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature.');
            }
          });
        }
      });
    }

    if (booking?.hotelEmail) {
      contactOptions.push({
        title: 'Send Email',
        icon: 'email',
        onPress: () => {
          const emailUrl = `mailto:${booking.hotelEmail}?subject=Booking Inquiry - ${booking.bookingReference}&body=Hi, I have a question regarding my booking ${booking.bookingReference}.`;
          Linking.openURL(emailUrl);
        }
      });
    }

    if (contactOptions.length > 0) {
      SheetManager.show('contact-hotel', {
        payload: {
          hotelName: booking?.hotelName,
          contactOptions
        }
      });
    } else {
      Alert.alert('No Contact Info', 'Contact information is not available for this hotel.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-lg text-gray-500 mb-4 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {error || 'Booking not found'}
        </Text>
        <TouchableOpacity
          className="bg-black px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'text-green-800 bg-green-100 border-green-300';
      case 'completed':
        return 'text-blue-800 bg-blue-100 border-blue-300';
      case 'cancelled':
        return 'text-gray-800 bg-gray-100 border-gray-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const canCancelBooking = booking.status === 'confirmed' || booking.status === 'upcoming';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hotel Image and Status */}
        <View className="relative">
          <Image
            source={{ uri: booking.image }}
            className="w-full h-64"
            style={{ resizeMode: 'cover' }}
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
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {booking.address}
              </Text>
            </View>
            <TouchableOpacity
              className="ml-3 p-2 bg-black rounded-full"
              onPress={() => {
                const address = encodeURIComponent(booking.address);
                const url = Platform.OS === 'ios' 
                  ? `maps://maps.google.com/maps?q=${address}`
                  : `geo:0,0?q=${address}`;
                
                Linking.canOpenURL(url).then(supported => {
                  if (supported) {
                    Linking.openURL(url);
                  } else {
                    // Fallback to web maps
                    Linking.openURL(`https://maps.google.com/maps?q=${address}`);
                  }
                });
              }}
            >
              <MapPin size={16} color="white" />
            </TouchableOpacity>
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

          <View className="gap-4">
            <View className="flex-row items-center">
              <Calendar size={20} color="#000000" />
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Check-in
                </Text>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {formatDate(booking.checkIn)}
                </Text>
                {/* {booking.bookingType === 'hourly' && (
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    {formatTime(booking.checkOut)}
                  </Text>
                )} */}
              </View>
            </View>

            <View className="flex-row items-center">
              <Calendar size={20} color="#000000" />
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
              <Users size={20} color="#000000" />
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

        {/* Add-ons Section */}
        {booking.addons && booking.addons.length > 0 && (
          <View className="px-6 py-6 border-t border-gray-100">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Add-ons
            </Text>
            <View className="gap-4">
              {booking.addons.map((addon, index) => (
                <View key={addon.id} className="flex-row items-center bg-gray-50 p-4 rounded-lg">
                  <Image
                    source={{ uri: addon.image }}
                    className="w-16 h-16 rounded-lg"
                    style={{ resizeMode: 'cover' }}
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                      {addon.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      {addon.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                        Quantity: {addon.quantity}
                      </Text>
                      <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        ₹{addon.totalPrice.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        <View className="px-6 py-6 border-t border-gray-100">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Price Breakdown
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.roomRate.toLocaleString()} × {booking.nights} {booking.bookinType == 'daily' ? 'nights' : 'hours'}
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.subtotal.toLocaleString()}
              </Text>
            </View>

            {/* Add-ons in price breakdown */}
            {booking.addons && booking.addons.length > 0 && booking.addons.map((addon) => (
              <View key={addon.id} className="flex-row justify-between">
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {addon.name} (x{addon.quantity})
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  ₹{addon.totalPrice.toLocaleString()}
                </Text>
              </View>
            ))}

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
        <View className="px-6 py-6 border-t border-gray-100 gap-3">
          <TouchableOpacity
            className="w-full h-12 bg-black rounded-lg items-center justify-center"
            onPress={handleContactHotel}
          >
            <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Contact Hotel
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-3">
            {canCancelBooking && (
              <TouchableOpacity
                className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center flex-row"
                onPress={handleCancelBooking}
                disabled={cancelling}
              >
                <X size={16} color="#DC2626" />
                <Text className="text-gray-600 text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`${canCancelBooking ? 'flex-1' : 'w-full'} h-12 border border-gray-300 rounded-lg items-center justify-center flex-row`}
              onPress={handleDownloadReceipt}
            >
              <Download size={16} color="#374151" />
              <Text className="text-gray-700 text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Download Receipt
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;