import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [socialLoading, setSocialLoading] = useState<{ google?: boolean; github?: boolean; email?: boolean }>({});
  const { login, isLoading } = useAuth();

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    
    // Format as XXX XXX XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { phone?: string; email?: string } = {};

    if (loginMethod === 'phone') {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (!cleanPhone) {
        newErrors.phone = 'Phone number is required';
      } else if (cleanPhone.length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      } else if (!cleanPhone.match(/^[6-9]/)) {
        newErrors.phone = 'Phone number must start with 6, 7, 8, or 9';
      }
    } else {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    try {
      const loginData = loginMethod === 'phone' 
        ? `+91${phoneNumber.replace(/\D/g, '')}`
        : email.trim();
      
      await login(loginData, 'password_placeholder');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'email') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      await login('social@example.com', 'social_login');
    } catch (error: any) {
      Alert.alert('Login Failed', `${provider} login failed`);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-sm">
          {/* Header */}
          <View className="mt-12 mb-10">
            <Text className="text-2xl font-bold text-gray-900">
              Log in or sign up to book
            </Text>
          </View>

          {/* Phone/Email Input */}
          <View className="space-y-4 mb-4">
            <View className="rounded-lg border border-gray-300">
              {/* Country/Method Selector */}
              <View className="relative">
                <Text className="block text-xs font-medium text-gray-500 px-4 pt-3">
                  {loginMethod === 'phone' ? 'Country/Region' : 'Login Method'}
                </Text>
                <TouchableOpacity 
                  className="w-full border-0 rounded-t-lg bg-white px-4 pb-2"
                  onPress={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
                >
                  <Text className="text-base text-gray-900">
                    {loginMethod === 'phone' ? 'India (+91)' : 'Email Address'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Input Field */}
              <View className="relative border-t border-gray-300">
                <TextInput
                  className="w-full rounded-b-lg border-0 bg-white p-4 text-base text-gray-900"
                  placeholder={loginMethod === 'phone' ? 'Phone number' : 'Email address'}
                  placeholderTextColor="#9CA3AF"
                  value={loginMethod === 'phone' ? phoneNumber : email}
                  onChangeText={loginMethod === 'phone' ? handlePhoneChange : handleEmailChange}
                  keyboardType={loginMethod === 'phone' ? 'phone-pad' : 'email-address'}
                  autoCapitalize="none"
                  autoComplete={loginMethod === 'phone' ? 'tel' : 'email'}
                />
              </View>
            </View>

            {/* Error Messages */}
            {errors.phone && (
              <Text className="text-sm text-red-500 px-1">{errors.phone}</Text>
            )}
            {errors.email && (
              <Text className="text-sm text-red-500 px-1">{errors.email}</Text>
            )}

            {/* Helper Text */}
            <Text className="text-xs text-gray-500">
              {loginMethod === 'phone' 
                ? "We'll call or text you to confirm your number. Standard message and data rates apply."
                : "We'll send you a login link to your email address."
              }
            </Text>
          </View>

          {/* Continue Button */}
          <View className="mt-6">
            <TouchableOpacity
              className="w-full rounded-lg bg-[#FF5A5F] py-3.5 shadow-sm active:bg-red-600 disabled:opacity-50"
              onPress={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-base font-bold text-white text-center">
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="relative flex items-center justify-center my-6">
            <View className="absolute inset-0 flex items-center">
              <View className="w-full border-t border-gray-300" />
            </View>
            <View className="relative bg-white px-2">
              <Text className="text-sm text-gray-500">or</Text>
            </View>
          </View>

          {/* Social Login Buttons */}
          <View className="space-y-4">
            {/* Google */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 shadow-sm active:bg-gray-50 disabled:opacity-50"
              onPress={() => handleSocialLogin('google')}
              disabled={socialLoading.google}
            >
              {socialLoading.google ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <View className="w-5 h-5 mr-3">
                    <Text>🔍</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-700">
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* GitHub */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 shadow-sm active:bg-gray-50 disabled:opacity-50"
              onPress={() => handleSocialLogin('github')}
              disabled={socialLoading.github}
            >
              {socialLoading.github ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <>
                  <View className="w-5 h-5 mr-3">
                    <Text>⚡</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-700">
                    Continue with Github
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Email Alternative */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 shadow-sm active:bg-gray-50 disabled:opacity-50"
              onPress={() => handleSocialLogin('email')}
              disabled={socialLoading.email}
            >
              {socialLoading.email ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <>
                  <View className="w-5 h-5 mr-3">
                    <Text>✉️</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-700">
                    Continue with Email
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/(auth)/register" className="text-[#FF5A5F] font-medium">
                Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}