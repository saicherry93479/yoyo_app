import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Google Icon Component
const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      fill="#FFC107"
    />
    <Path
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      fill="#FF3D00"
    />
    <Path
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      fill="#4CAF50"
    />
    <Path
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.631,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      fill="#1976D2"
    />
  </Svg>
);

// GitHub Icon Component
const GitHubIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C6.477 2 2 6.477 2 12c0 4.478 2.943 8.268 6.938 9.5c.5.092.682-.217.682-.482c0-.237-.009-.868-.014-1.703c-2.857.62-3.46-1.373-3.46-1.373c-.454-1.155-1.11-1.463-1.11-1.463c-.908-.62.069-.608.069-.608c1.003.07 1.531 1.03 1.531 1.03c.892 1.53 2.341 1.088 2.91.832c.092-.647.35-1.088.636-1.338c-2.22-.253-4.555-1.113-4.555-4.951c0-1.093.39-1.988 1.03-2.688c-.103-.253-.446-1.272.098-2.65c0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.82c.85.004 1.705.115 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027c.546 1.378.203 2.397.1 2.65c.64.7 1.03 1.595 1.03 2.688c0 3.848-2.338 4.695-4.566 4.943c.359.309.678.92.678 1.855c0 1.338-.012 2.419-.012 2.747c0 .268.18.578.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10z"
      fill="#333"
    />
  </Svg>
);

// Email Icon Component
const EmailIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      fill="#666"
    />
  </Svg>
);

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useAuth()

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phoneNumber, 'user');
      router.push({
        pathname: '/(auth)/otp',
        params: { phoneNumber: phoneNumber },
      });
    } catch (e) {
      console.log('error ', e);
      alert('Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    console.log('Google sign in');
  };

  const handleGitHubSignIn = () => {
    // Handle GitHub sign in
    console.log('GitHub sign in');
  };

  const handleEmailSignIn = () => {
    // Handle email sign in
    console.log('Email sign in');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center items-center px-6 py-8">
          <View className="w-full max-w-sm">
            {/* Header */}
            <View className="mt-16 mb-12">
              <Text
                className="text-3xl text-gray-900 text-left leading-tight"
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Log in or sign up to book
              </Text>
            </View>

            {/* Phone Number Input Section */}
            <View className="mb-6">
              <View className="rounded-xl border border-gray-300 bg-white">
                {/* Country/Region Section */}
                <View className="px-5 pt-4 pb-2">
                  <Text
                    className="text-xs text-gray-500 mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                  >
                    Country/Region
                  </Text>
                  <Text
                    className="text-base text-gray-900"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    India (+91)
                  </Text>
                </View>

                {/* Phone Number Input */}
                <View className="border-t border-gray-300">
                  <TextInput
                    className="w-full rounded-b-xl bg-white px-5 py-4 text-base text-gray-900"
                    placeholder="Phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  />
                </View>
              </View>

              {/* Disclaimer Text */}
              <Text
                className="text-xs text-gray-500 mt-4 leading-relaxed"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                We'll call or text you to confirm your number. Standard message and data rates apply.
              </Text>
            </View>

            {/* Continue Button */}
            <View className="mb-8">
              <TouchableOpacity
                className="w-full rounded-xl bg-black py-4 shadow-sm active:bg-[#1A1A1A] flex-row justify-center items-center"
                onPress={handleContinue}
                disabled={loading}
              >
                {loading ? (
                  <Text
                    className="text-base text-white text-center"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    Loading...
                  </Text>
                ) : (
                  <Text
                    className="text-base text-white text-center"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    Continue
                  </Text>
                )}
              </TouchableOpacity>

            </View>

            {/* Divider */}
            <View className="relative flex items-center justify-center my-8">
              <View className="absolute inset-0 flex items-center">
                <View className="w-full border-t border-gray-300" />
              </View>
              <View className="relative bg-white px-4">
                <Text
                  className="text-sm text-gray-500"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                >
                  or
                </Text>
              </View>
            </View>

            {/* Social Login Buttons */}
            <View className="gap-4">
              {/* Google Button */}
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4 shadow-sm active:bg-gray-50"
                onPress={handleGoogleSignIn}
              >
                <GoogleIcon size={20} />
                <Text
                  className="ml-3 text-base text-gray-700"
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* GitHub Button */}
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4 shadow-sm active:bg-gray-50"
                onPress={handleGitHubSignIn}
              >
                <GitHubIcon size={20} />
                <Text
                  className="ml-3 text-base text-gray-700"
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  Continue with GitHub
                </Text>
              </TouchableOpacity>

              {/* Email Button */}
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4 shadow-sm active:bg-gray-50"
                onPress={handleEmailSignIn}
              >
                <EmailIcon size={20} />
                <Text
                  className="ml-3 text-base text-gray-700"
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View className="h-8" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}