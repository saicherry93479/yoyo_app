import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, Phone, LocationEdit as Edit3 } from 'lucide-react-native';
import { apiService } from '@/services/api';

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    bookingUpdates: user?.bookingUpdates || true,
    checkinReminders: user?.checkinReminders || true,
    securityAlerts: user?.securityAlerts || true,
    promotionalOffers: user?.promotionalOffers || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Personal Information
        </Text>
      ),
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="mr-4">
          <Edit3 size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare request body according to API schema
      const requestBody = {
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
      };

      const response = await apiService.put('/auth/profile', requestBody);
      
      if (response.success) {
        // Update user context with response data
        if (user && response.data.user) {
          const updatedUser = { 
            ...user, 
            ...response.data.user,
            profile: response.data.profile
          };
          setUser(updatedUser);
        }
        
        setIsEditing(false);
        Alert.alert('Success', 'Your information has been updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update information');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      gender: user?.gender || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const InfoField = ({ 
    icon: Icon, 
    label, 
    value, 
    field, 
    placeholder, 
    keyboardType = 'default',
    editable = true 
  }: {
    icon: any;
    label: string;
    value: string;
    field: string;
    placeholder: string;
    keyboardType?: any;
    editable?: boolean;
  }) => (
    <View className="mb-6">
      <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
        {label}
      </Text>
      <View className={`flex-row items-center rounded-lg border px-4 py-3 ${
        isEditing && editable 
          ? 'border-gray-300 bg-white' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <Icon size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-900"
          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={(text) => updateFormData(field, text)}
          editable={isEditing && editable}
          keyboardType={keyboardType}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          autoCorrect={false}
          blurOnSubmit={false}
        />
      </View>
      {errors[field] && (
        <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1 px-6 py-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isEditing ? 100 : 20 }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Profile Photo */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
                <User size={32} color="#9CA3AF" />
              </View>
            </View>
            <Text className="text-lg text-gray-900 mt-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {formData.fullName || 'Your Name'}
            </Text>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Member since 2024
            </Text>
          </View>

          {/* Form Fields */}
          <InfoField
            icon={User}
            label="Full Name"
            value={formData.fullName}
            field="fullName"
            placeholder="Enter your full name"
          />

          <InfoField
            icon={Mail}
            label="Email Address"
            value={formData.email}
            field="email"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          <InfoField
            icon={Phone}
            label="Phone Number"
            value={formData.phone}
            field="phone"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={false}
          />

          <View className="mb-6">
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Gender
            </Text>
            <View className="flex-row gap-3">
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className={`flex-1 py-3 rounded-lg border items-center ${
                    formData.gender === gender
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 bg-white'
                  } ${!isEditing ? 'opacity-50' : ''}`}
                  onPress={() => isEditing && updateFormData('gender', gender)}
                  disabled={!isEditing}
                  activeOpacity={0.7}
                >
                  <Text 
                    className={`text-sm ${
                      formData.gender === gender ? 'text-black' : 'text-gray-700'
                    }`}
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Buttons */}
        {isEditing && (
          <View className="bg-white border-t border-gray-200 px-6 py-4">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center"
                onPress={handleCancel}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 h-12 rounded-lg items-center justify-center ${
                  isLoading ? 'bg-gray-300' : 'bg-black'
                }`}
                onPress={handleSave}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-base text-white ml-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                      Saving...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}