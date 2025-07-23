import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [socialLoading, setSocialLoading] = useState<{ google?: boolean; github?: boolean }>({});
  const { register, isLoading } = useAuth();

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const updateFormData = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    } else if (!cleanPhone.match(/^[6-9]/)) {
      newErrors.phone = 'Phone number must start with 6, 7, 8, or 9';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: `+91${formData.phone.replace(/\D/g, '')}`,
        password: formData.password,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'github') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration with social provider
      await register({
        name: 'Social User',
        email: `${provider}@example.com`,
        phone: '+919876543210',
        password: 'social_password',
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', `${provider} registration failed`);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4 pt-16">
        <View className="w-full max-w-sm mx-auto">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl text-gray-900 text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Create Account
            </Text>
            <Text className="text-base text-gray-600 text-center mt-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Join us to start booking amazing hotels
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Name */}
            <View>
              <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Full Name</Text>
              <View className="rounded-lg border border-gray-300">
                <TextInput
                  className="w-full p-4 text-base text-gray-900 rounded-lg"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Email</Text>
              <View className="rounded-lg border border-gray-300">
                <TextInput
                  className="w-full p-4 text-base text-gray-900 rounded-lg"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Phone Number</Text>
              <View className="rounded-lg border border-gray-300">
                <View className="flex-row">
                  <View className="px-4 py-4 border-r border-gray-300">
                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>+91</Text>
                  </View>
                  <TextInput
                    className="flex-1 p-4 text-base text-gray-900 rounded-r-lg"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    placeholder="Phone number"
                    placeholderTextColor="#9CA3AF"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              {errors.phone && (
                <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{errors.phone}</Text>
              )}
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Password</Text>
              <View className="rounded-lg border border-gray-300">
                <TextInput
                  className="w-full p-4 text-base text-gray-900 rounded-lg"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry
                />
              </View>
              {errors.password && (
                <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Confirm Password</Text>
              <View className="rounded-lg border border-gray-300">
                <TextInput
                  className="w-full p-4 text-base text-gray-900 rounded-lg"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry
                />
              </View>
              {errors.confirmPassword && (
                <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Register Button */}
          <View className="mt-8">
            <TouchableOpacity
              className="w-full rounded-lg bg-black py-3.5 shadow-sm active:bg-[#1A1A1A] disabled:opacity-50"
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-base text-white text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Create Account
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
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>or</Text>
            </View>
          </View>

          {/* Social Registration */}
          <View className="gap-3">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 shadow-sm active:bg-gray-50 disabled:opacity-50"
              onPress={() => handleSocialRegister('google')}
              disabled={socialLoading.google}
            >
              {socialLoading.google ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <Text className="mr-3">🔍</Text>
                  <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 shadow-sm active:bg-gray-50 disabled:opacity-50"
              onPress={() => handleSocialRegister('github')}
              disabled={socialLoading.github}
            >
              {socialLoading.github ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <>
                  <Text className="mr-3">⚡</Text>
                  <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    Continue with Github
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Already have an account?{' '}
              <Link href="/(auth)/login" className="text-black" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}