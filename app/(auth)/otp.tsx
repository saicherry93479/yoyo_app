import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RelativePathString, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function OTPScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const { sendOTP, verifyOTP } = useAuth()

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
       await verifyOTP(otpCode, 'user')


      
    } catch (error) {
      Alert.alert('Error', 'Unable to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Simulate resend OTP
      await sendOTP(phoneNumber, 'user')
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4"
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Verify Phone Number
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            We've sent a 6-digit code to
          </Text>
          <Text className="text-lg text-gray-900 mb-8" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {phoneNumber}
          </Text>

          {/* OTP Input */}
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                className="w-12 h-14 border-2 border-gray-200 rounded-lg text-center text-xl text-gray-900 focus:border-[#FF5A5F]"
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend OTP */}
          <View className="flex-row items-center justify-center mb-8">
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
              <Text
                className={`${canResend ? 'text-[#FF5A5F]' : 'text-gray-400'}`}
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`w-full h-12 rounded-lg items-center justify-center ${otp.join('').length === 6 && !isLoading ? 'bg-[#FF5A5F]' : 'bg-gray-200'
              }`}
            onPress={handleVerifyOTP}
            disabled={otp.join('').length !== 6 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className={`text-base ${otp.join('').length === 6 ? 'text-white' : 'text-gray-400'
                  }`}
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}