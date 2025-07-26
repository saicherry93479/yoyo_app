import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const CancelBookingScreen = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const cancellationReasons = [
    'Change of plans',
    'Found better accommodation',
    'Emergency situation',
    'Weather conditions',
    'Health issues',
    'Work commitments',
    'Travel restrictions',
    'Other'
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Cancel Booking
        </Text>
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#121516" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCancelBooking = async () => {
    if (!selectedReason || (selectedReason === 'Other' && !customReason.trim())) {
      Alert.alert('Error', 'Please select or enter a cancellation reason');
      return;
    }

    // Show confirmation alert before proceeding
    Alert.alert(
      'Confirm Cancellation',
      `Are you sure you want to cancel your booking for ${params.hotelName}? This action cannot be undone.`,
      [
        {
          text: 'No, Keep Booking',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              const response = await apiService.put(`/bookings/${params.bookingId}/cancel`, {
                reason: selectedReason === 'Other' ? customReason : selectedReason,
              });

              if (response.success) {
                const { refundAmount, cancellationFee } = response.data;

                Alert.alert(
                  'Booking Cancelled',
                  `Your booking has been cancelled successfully.${refundAmount > 0
                    ? ` A refund of ₹${refundAmount.toLocaleString()} will be processed within 3-5 business days.`
                    : ' No refund is applicable based on the cancellation policy.'
                  }${cancellationFee > 0
                    ? ` A cancellation fee of ₹${cancellationFee.toLocaleString()} has been applied.`
                    : ''
                  }`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        router.replace('/(tabs)/bookings');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', response.message || 'Failed to cancel booking');
              }
            } catch (error) {
              console.error('Cancellation error:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView className="flex-1  py-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <AlertTriangle size={32} color="#DC2626" />
          </View>
          <Text className="text-2xl text-[#161312] mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Cancel Booking
          </Text>
          <Text className="text-gray-600 text-base leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            We're sorry to see you cancel your booking for {params.hotelName}. Please let us know why you're cancelling so we can improve our service.
          </Text>
        </View>

        {/* Booking Details */}
        <View className="bg-gray-50 p-4 rounded-2xl mb-6">
          <Text className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Booking Reference
          </Text>
          <Text className="text-lg text-[#161312] mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            {params.bookingReference}
          </Text>
          <Text className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Total Amount
          </Text>
          <Text className="text-lg text-[#161312]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            ₹{parseFloat(params.totalAmount as string).toLocaleString()}
          </Text>
        </View>

        {/* Cancellation Policy Notice */}
        <View className="bg-yellow-50 p-4 rounded-2xl mb-6 border border-yellow-200">
          <Text className="text-yellow-800 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Important Notice
          </Text>
          <Text className="text-yellow-700 text-sm leading-5" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Cancellation fees may apply based on the timing of your cancellation and the hotel's policy. Refund details will be provided after confirmation.
          </Text>
        </View>

        {/* Cancellation Reasons */}
        <View className="mb-6">
          <Text className="text-lg text-[#161312] mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Reason for Cancellation
          </Text>

          <View className="flex gap-y-3">
            {cancellationReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                className={`p-4 rounded-xl border-2 ${selectedReason === reason ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
                  }`}
                onPress={() => setSelectedReason(reason)}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-base ${selectedReason === reason ? 'text-black' : 'text-gray-700'}`}
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                  >
                    {reason}
                  </Text>
                  <View className={`w-5 h-5 rounded-full border-2 ${selectedReason === reason ? 'bg-black border-black' : 'border-gray-300'
                    }`}>
                    {selectedReason === reason && (
                      <View className="w-1.5 h-1.5 bg-white rounded-full self-center mt-1.5" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Reason Input */}
          {selectedReason === 'Other' && (
            <View className="mt-4">
              <TextInput
                className="bg-white rounded-xl p-4 border border-gray-200 text-[#161312] min-h-[100px]"
                style={{ fontFamily: 'PlusJakartaSans-Regular', textAlignVertical: 'top' }}
                placeholder="Please specify your reason for cancellation..."
                placeholderTextColor="#9CA3AF"
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={4}
              />
            </View>
          )}
        </View>

        {/* Cancel Booking Button */}
        <TouchableOpacity
        className={`w-full p-4 mb-8 rounded-2xl items-center ${selectedReason && (selectedReason !== 'Other' || customReason.trim()) && !loading
            ? 'bg-black'
            : 'bg-gray-300'
          }`}
        onPress={handleCancelBooking}
        disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim()) || loading}
      >
        {loading ? (
          <LoadingSpinner size="small" color="white" />
        ) : (
          <Text className="text-white text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Cancel Booking
          </Text>
        )}
      </TouchableOpacity>

      </ScrollView>
      
    </SafeAreaView>
  );
};

export default CancelBookingScreen;