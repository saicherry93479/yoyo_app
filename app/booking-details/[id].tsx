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
import { Calendar, MapPin, Users, Phone, Mail, MessageCircle, Download, X, Plus, CreditCard, Clock, User, Copy, CheckCircle } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { MockBooking } from '@/services/mockData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useBookings } from '@/hooks/useBookings';
import * as Clipboard from 'expo-clipboard';
import RazorpayCheckout from 'react-native-razorpay';

const BookingDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [booking, setBooking] = useState<MockBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
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

  const handlePayNow = async () => {
    if (!booking || !booking.onlinePaymentEnabled) return;

    try {
      setPaymentLoading(true);

      // Create payment order
      const orderResponse = await apiService.post('/payments/orders', {
        bookingId: booking.id,
        amount: booking.paymentAmount || booking.totalAmount,
        currency: 'INR'
      });

      if (orderResponse.success) {
        const { orderId, amount, currency } = orderResponse.data;

        // Razorpay checkout options
        const options = {
          description: `Payment for ${booking.hotelName}`,
          image: booking.image || 'https://your-logo-url.com/logo.png', // Replace with your logo
          currency: currency,
          key: 'rzp_live_zOjuJaoBGy4ZSN', // Replace with your Razorpay key
          amount: amount * 100, // Amount in paise
          name: 'Your App Name', // Replace with your app name
          order_id: orderId,
          prefill: {
            email: booking.guestEmail || 'customer@example.com',
            contact: booking.guestPhone || '9999999999',
            name: booking.guestName || 'Guest'
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: () => {
              console.log('Payment dismissed');
              setPaymentLoading(false);
            }
          }
        };

        // Open Razorpay checkout
        RazorpayCheckout.open(options).then((data) => {
          // Payment successful
          console.log('Payment successful:', data);
          handlePaymentSuccess(orderId, data.razorpay_payment_id, data.razorpay_signature);
        }).catch((error) => {
          // Payment failed or cancelled
          console.log('Payment failed:', error);
          setPaymentLoading(false);
          
          if (error.code === 'PAYMENT_CANCELLED') {
            // User cancelled payment
            return;
          } else {
            Alert.alert('Payment Failed', error.description || 'Payment could not be processed');
          }
        });

      } else {
        Alert.alert('Payment Error', orderResponse.error || 'Failed to create payment order');
        setPaymentLoading(false);
      }
    } catch (error: any) {
      Alert.alert('Payment Error', error.message || 'Failed to initiate payment');
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, paymentId: string, signature: string) => {
    try {
      setPaymentLoading(true);

      // Verify payment
      const verifyResponse = await apiService.post('/payments/verify', {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature
      });

      if (verifyResponse.success) {
        Alert.alert(
          'Payment Successful!',
          'Your payment has been processed successfully. Your booking is now confirmed.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Refresh booking details
                fetchBookingDetails();
                refreshBookings();
              }
            }
          ]
        );
      } else {
        Alert.alert('Payment Verification Failed', verifyResponse.error || 'Payment verification failed');
      }
    } catch (error: any) {
      Alert.alert('Payment Verification Error', error.message || 'Failed to verify payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleModifyGuestName = () => {
    SheetManager.show('modify-guest-name', {
      payload: {
        bookingId: booking?.id,
        currentGuestName: booking?.guestName || 'Guest',
        onGuestNameUpdated: (newName: string) => {
          if (booking) {
            setBooking({ ...booking, guestName: newName });
          }
        }
      }
    });
  };

  const handleCopyBookingId = async () => {
    if (booking?.bookingReference) {
      await Clipboard.setStringAsync(booking.bookingReference);
      Alert.alert('Copied', 'Booking ID copied to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
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
    const date = new Date(dateString);
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
  const showPaymentSection = booking.onlinePaymentEnabled && booking.paymentStaus === 'pending';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Payment Section - Clean and Professional */}
        {showPaymentSection && (
          <View className="mx-6 mt-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <CreditCard size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Complete Payment
                </Text>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Secure your booking now
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Amount to pay
                </Text>
                <Text className="text-2xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  ₹{(booking.paymentAmount || booking.totalAmount).toLocaleString()}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-4">
                <CheckCircle size={16} color="#10B981" />
                <Text className="text-green-700 text-sm ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Safe & Secure Payment
                </Text>
              </View>

              <TouchableOpacity 
                className="w-full py-4 bg-blue-600 rounded-xl flex-row items-center justify-center"
                onPress={handlePayNow}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <CreditCard size={20} color="white" />
                    <Text className="text-center text-white text-lg ml-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                      Pay Now
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Hotel Information Card - Improved Layout */}
        <View className="mx-6 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="p-6">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {booking.hotelName}
                </Text>
                <View className="flex-row items-start mb-3">
                  <MapPin size={16} color="#6B7280" style={{ marginTop: 2 }} />
                  <Text className="text-gray-600 ml-2 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    {booking.address}
                  </Text>
                </View>
                <View className={`self-start px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                  <Text className="text-sm capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              
              {/* Hotel Image */}
              <View className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  source={{ uri: booking.image }}
                  className="w-full h-full"
                  style={{ resizeMode: 'cover' }}
                />
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-lg text-gray-800 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {booking.roomType}
              </Text>
              <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions - Improved Grid */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl border border-gray-100 p-6">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity className="flex-1 items-center py-4 mx-2 bg-gray-50 rounded-xl">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Calendar size={20} color="#3B82F6" />
                </View>
                <Text className="text-sm text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Check-in
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 items-center py-4 mx-2 bg-gray-50 rounded-xl">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <MapPin size={20} color="#10B981" />
                </View>
                <Text className="text-sm text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Directions
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 items-center py-4 mx-2 bg-gray-50 rounded-xl"
                onPress={handleContactHotel}
              >
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <Phone size={20} color="#F59E0B" />
                </View>
                <Text className="text-sm text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Call hotel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trip Details Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Trip Details
          </Text>
          
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                CHECK-IN
              </Text>
              <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                {formatDate(booking.checkIn)}
              </Text>
              <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                12:00 PM onwards
              </Text>
            </View>
            
            <View className="items-center px-4">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
                <Text className="text-blue-600 font-bold" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {booking.nights}N
                </Text>
              </View>
            </View>
            
            <View className="flex-1 items-end">
              <Text className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                CHECK-OUT
              </Text>
              <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                {formatDate(booking.checkOut)}
              </Text>
              <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Before 11:00 AM
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Booking Information
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Booking ID
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 mr-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {booking.bookingReference}
                </Text>
                <TouchableOpacity onPress={handleCopyBookingId}>
                  <Copy size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Reserved for
              </Text>
              <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {booking.guestName || 'Guest'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-3">
              <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Contact
              </Text>
              <View className="items-end">
                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {booking.guestEmail || 'saicherry93479@gmail.com'}
                </Text>
                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {booking.guestPhone || '+91-9515235212'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Breakdown Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Price Breakdown
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.roomRate.toLocaleString()} × {booking.nights} {booking.bookingType === 'daily' ? 'nights' : 'hours'}
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.subtotal.toLocaleString()}
              </Text>
            </View>

            {/* Add-ons in price breakdown */}
            {booking.addons && booking.addons.length > 0 && booking.addons.map((addon) => (
              <View key={addon.id} className="flex-row justify-between py-2">
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {addon.name} (x{addon.quantity})
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  ₹{addon.totalPrice.toLocaleString()}
                </Text>
              </View>
            ))}

            <View className="flex-row justify-between py-2">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Taxes and fees
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.taxes.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Service fee
              </Text>
              <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                ₹{booking.priceBreakdown.serviceFee.toLocaleString()}
              </Text>
            </View>

            <View className="border-t border-gray-200 pt-3 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-900 text-xl" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Total
                </Text>
                <Text className="text-gray-900 text-xl" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  ₹{booking.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Add-ons Section */}
        {booking.addons && booking.addons.length > 0 && (
          <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Add-ons
            </Text>
            <View className="space-y-4">
              {booking.addons.map((addon, index) => (
                <View key={addon.id} className="flex-row items-center bg-gray-50 p-4 rounded-xl">
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

        {/* Amenities Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Amenities
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {booking.amenities.map((amenity, index) => (
              <View key={index} className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <Text className="text-sm text-blue-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cancellation Policy Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Cancellation Policy
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full border-2 border-orange-500 items-center justify-center mr-3 mt-1">
                <View className="w-2 h-2 bg-orange-500 rounded-full" />
              </View>
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  This booking is non-refundable
                </Text>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Amount paid will not be refunded upon cancellation.
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full border-2 border-gray-400 items-center justify-center mr-3 mt-1">
                <View className="w-2 h-2 bg-gray-400 rounded-full" />
              </View>
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Free cancellation was available till 27 July, 9:00 am
                </Text>
              </View>
            </View>
          </View>
          
          <View className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <Text className="text-sm text-yellow-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              In case you don't show up at the property, there will be no refund.
            </Text>
          </View>
        </View>

        {/* Manage Booking Card */}
        <View className="mx-6 mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Manage Your Booking
          </Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={handleModifyGuestName}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                <User size={20} color="#3B82F6" />
              </View>
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Modify guest name
              </Text>
            </View>
            <Text className="text-gray-400 text-xl">›</Text>
          </TouchableOpacity>
          
          <View className="py-4 border-b border-gray-100">
            <View className="flex-row items-start mb-3">
              <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                <CreditCard size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Avail GST credit on this booking
                </Text>
                <Text className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Add GSTIN details to get GST credit on this and future bookings
                </Text>
                <TouchableOpacity>
                  <Text className="text-blue-600" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    Add GSTIN details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {canCancelBooking && (
            <TouchableOpacity 
              className="flex-row items-center justify-between py-4"
              onPress={handleCancelBooking}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
                  <X size={20} color="#EF4444" />
                </View>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Cancel booking
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mx-6 mb-8">
          <View className="bg-white rounded-2xl border border-gray-100 p-6">
            <TouchableOpacity
              className="w-full h-14 bg-black rounded-xl items-center justify-center mb-4"
              onPress={handleContactHotel}
            >
              <View className="flex-row items-center">
                <Phone size={20} color="white" />
                <Text className="text-white text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Contact Hotel
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-14 border border-gray-300 rounded-xl items-center justify-center"
              onPress={handleDownloadReceipt}
            >
              <View className="flex-row items-center">
                <Download size={20} color="#374151" />
                <Text className="text-gray-700 text-base ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Download Receipt
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;