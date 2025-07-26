
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
import { ArrowLeft, AlertTriangle, CreditCard, DollarSign } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const CancelBookingScreen = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [refundDetails, setRefundDetails] = useState<any>(null);
  const [step, setStep] = useState<'reason' | 'refund'>('reason');

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

  const handleReasonSubmit = async () => {
    if (!selectedReason || (selectedReason === 'Other' && !customReason.trim())) {
      Alert.alert('Error', 'Please select or enter a cancellation reason');
      return;
    }

    try {
      setLoading(true);
      
      // Get cancellation details including refund information
      const response = await apiService.post(`/bookings/${params.bookingId}/cancel-preview`, {
        reason: selectedReason === 'Other' ? customReason : selectedReason,
      });

      if (response.success) {
        setRefundDetails(response.data);
        setStep('refund');
      } else {
        Alert.alert('Error', response.message || 'Failed to get cancellation details');
      }
    } catch (error) {
      console.error('Cancellation preview error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancellation = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.put(`/bookings/${params.bookingId}/cancel`, {
        reason: selectedReason === 'Other' ? customReason : selectedReason,
        refundDetails: refundDetails
      });

      if (response.success) {
        Alert.alert(
          'Booking Cancelled',
          `Your booking has been cancelled successfully. ${refundDetails?.refundAmount > 0 ? `A refund of ₹${refundDetails.refundAmount.toLocaleString()} will be processed within 3-5 business days.` : ''}`,
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
  };

  const renderReasonStep = () => (
    <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
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

      {/* Cancellation Reasons */}
      <View className="mb-6">
        <Text className="text-lg text-[#161312] mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Reason for Cancellation
        </Text>
        
        <View className="space-y-3">
          {cancellationReasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              className={`p-4 rounded-xl border-2 ${
                selectedReason === reason ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
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
                <View className={`w-5 h-5 rounded-full border-2 ${
                  selectedReason === reason ? 'bg-black border-black' : 'border-gray-300'
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

      {/* Continue Button */}
      <TouchableOpacity
        className={`w-full p-4 rounded-2xl items-center ${
          selectedReason && (selectedReason !== 'Other' || customReason.trim()) && !loading
            ? 'bg-black' 
            : 'bg-gray-300'
        }`}
        onPress={handleReasonSubmit}
        disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim()) || loading}
      >
        {loading ? (
          <LoadingSpinner size="small" color="white" />
        ) : (
          <Text className="text-white text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderRefundStep = () => (
    <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-8">
        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
          <CreditCard size={32} color="#2563EB" />
        </View>
        <Text className="text-2xl text-[#161312] mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Refund Details
        </Text>
        <Text className="text-gray-600 text-base leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Here are the details of your cancellation and refund information.
        </Text>
      </View>

      {/* Refund Breakdown */}
      <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <Text className="text-lg text-[#161312] mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Payment Breakdown
        </Text>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Original Amount
            </Text>
            <Text className="text-[#161312]" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              ₹{parseFloat(params.totalAmount as string).toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Cancellation Fee
            </Text>
            <Text className="text-red-600" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              -₹{(refundDetails?.cancellationFee || 0).toLocaleString()}
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between">
              <Text className="text-[#161312] text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Refund Amount
              </Text>
              <Text className="text-green-600 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                ₹{(refundDetails?.refundAmount || 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Refund Information */}
      <View className="bg-blue-50 p-4 rounded-2xl mb-6">
        <View className="flex-row items-start">
          <DollarSign size={20} color="#2563EB" className="mt-1" />
          <View className="ml-3 flex-1">
            <Text className="text-blue-900 text-base mb-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Refund Processing Time
            </Text>
            <Text className="text-blue-800 text-sm leading-5" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {refundDetails?.refundAmount > 0 
                ? 'Your refund will be processed within 3-5 business days and credited to your original payment method.'
                : 'Based on our cancellation policy, no refund is applicable for this booking.'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Cancellation Policy */}
      <View className="bg-gray-50 p-4 rounded-2xl mb-8">
        <Text className="text-[#161312] text-base mb-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
          Cancellation Policy
        </Text>
        <Text className="text-gray-600 text-sm leading-5" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {refundDetails?.cancellationPolicy || 'Standard cancellation policy applies based on the time of cancellation.'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 p-4 rounded-2xl items-center border border-gray-300 bg-white"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            I Changed My Mind
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-4 rounded-2xl items-center ${loading ? 'bg-gray-400' : 'bg-red-600'}`}
          onPress={handleConfirmCancellation}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" color="white" />
          ) : (
            <Text className="text-white text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Confirm Cancel
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {step === 'reason' ? renderReasonStep() : renderRefundStep()}
    </SafeAreaView>
  );
};

export default CancelBookingScreen;
