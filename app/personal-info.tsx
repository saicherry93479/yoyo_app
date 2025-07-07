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
  Image,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Edit3 } from 'lucide-react-native';

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    dateOfBirth: '',
    gender: '',
    avatar: user?.avatar || '',
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
          <Edit3 size={20} color="#FF5A5F" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const updateFormData = (field: string, value: string) => {
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user context
      if (user) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
      }
      
      setIsEditing(false);
      Alert.alert('Success', 'Your information has been updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      dateOfBirth: '',
      gender: '',
      avatar: user?.avatar || '',
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
        isEditing && editable ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
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
        />
      </View>
      {errors[field] && (
        <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} className="w-24 h-24 rounded-full" />
              ) : (
                <User size={32} color="#9CA3AF" />
              )}
            </View>
            {isEditing && (
              <TouchableOpacity className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF5A5F] rounded-full items-center justify-center">
                <Camera size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-lg text-gray-900 mt-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {formData.name || 'Your Name'}
          </Text>
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Member since 2024
          </Text>
        </View>

        {/* Form Fields */}
        <InfoField
          icon={User}
          label="Full Name"
          value={formData.name}
          field="name"
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

        <InfoField
          icon={MapPin}
          label="Location"
          value={formData.location}
          field="location"
          placeholder="City, Country"
        />

        <InfoField
          icon={Calendar}
          label="Date of Birth"
          value={formData.dateOfBirth}
          field="dateOfBirth"
          placeholder="DD/MM/YYYY"
        />

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
            Gender
          </Text>
          <View className="flex-row gap-3">
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                className={`flex-1 py-3 rounded-lg border items-center ${
                  formData.gender === gender
                    ? 'border-[#FF5A5F] bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${!isEditing ? 'opacity-50' : ''}`}
                onPress={() => isEditing && updateFormData('gender', gender)}
                disabled={!isEditing}
              >
                <Text 
                  className={`text-sm ${
                    formData.gender === gender ? 'text-[#FF5A5F]' : 'text-gray-700'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Information */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-base text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Account Information
          </Text>
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Account Status
              </Text>
              <Text className="text-sm text-green-600" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Verified
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Member Since
              </Text>
              <Text className="text-sm text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                January 2024
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Total Bookings
              </Text>
              <Text className="text-sm text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                12
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center"
              onPress={handleCancel}
            >
              <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}