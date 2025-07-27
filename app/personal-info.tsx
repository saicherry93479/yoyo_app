import React, { useState, useCallback, useMemo, useLayoutEffect } from 'react';
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

// Memoized Components
const ProfilePhoto = React.memo(({ fullName }) => (
  <View className="items-center mb-8">
    <View className="relative">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
        <User size={32} color="#9CA3AF" />
      </View>
    </View>
    <Text className="text-lg text-gray-900 mt-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
      {fullName || 'Your Name'}
    </Text>
    <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
      Member since 2024
    </Text>
  </View>
));

const InfoField = React.memo(({ 
  icon: Icon, 
  label, 
  value, 
  field, 
  placeholder, 
  keyboardType = 'default',
  editable = true,
  isEditing,
  onChangeText,
  error
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
        onChangeText={onChangeText}
        editable={isEditing && editable}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
        autoCorrect={false}
        blurOnSubmit={false}
      />
    </View>
    {error && (
      <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        {error}
      </Text>
    )}
  </View>
));

const GenderSelector = React.memo(({ selectedGender, onGenderChange, isEditing }) => {
  const genderOptions = useMemo(() => ['male', 'female', 'other'], []);

  return (
    <View className="mb-6">
      <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
        Gender
      </Text>
      <View className="flex-row gap-3">
        {genderOptions.map((gender) => (
          <TouchableOpacity
            key={gender}
            className={`flex-1 py-3 rounded-lg border items-center ${
              selectedGender === gender
                ? 'border-black bg-gray-50'
                : 'border-gray-300 bg-white'
            } ${!isEditing ? 'opacity-50' : ''}`}
            onPress={() => isEditing && onGenderChange(gender)}
            disabled={!isEditing}
            activeOpacity={0.7}
          >
            <Text 
              className={`text-sm ${
                selectedGender === gender ? 'text-black' : 'text-gray-700'
              }`}
              style={{ fontFamily: 'PlusJakartaSans-Medium' }}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const ActionButtons = React.memo(({ isLoading, onCancel, onSave }) => (
  <View className="bg-white border-t border-gray-200 px-6 py-4">
    <View className="flex-row gap-3">
      <TouchableOpacity
        className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center"
        onPress={onCancel}
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
        onPress={onSave}
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
));

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    bookingUpdates: user?.bookingUpdates || true,
    checkinReminders: user?.checkinReminders || true,
    securityAlerts: user?.securityAlerts || true,
    promotionalOffers: user?.promotionalOffers || false,
  });
  
  const [errors, setErrors] = useState({});

  // Memoized field change handlers
  const handleFullNameChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, fullName: text }));
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  }, [errors.fullName]);

  const handleEmailChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, email: text }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }, [errors.email]);

  const handlePhoneChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, phone: text }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }, [errors.phone]);

  const handleGenderChange = useCallback((gender) => {
    setFormData(prev => ({ ...prev, gender }));
  }, []);

  // Toggle editing mode
  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

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
  }, [formData.fullName, formData.email]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const requestBody = {
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
      };

      const response = await apiService.put('/auth/profile', requestBody);
      
      if (response.success) {
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
  }, [formData.fullName, formData.email, formData.gender, user, setUser, validateForm]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    setFormData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      gender: user?.gender || '',
      phone: user?.phone || '',
      name: user?.name || '',
      bookingUpdates: user?.bookingUpdates || true,
      checkinReminders: user?.checkinReminders || true,
      securityAlerts: user?.securityAlerts || true,
      promotionalOffers: user?.promotionalOffers || false,
    });
    setErrors({});
    setIsEditing(false);
  }, [user]);

  // Header configuration
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Personal Information
        </Text>
      ),
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={toggleEditing} className="mr-4">
          <Edit3 size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, toggleEditing]);

  // Memoized scroll view content style
  const scrollViewContentStyle = useMemo(() => ({
    paddingBottom: isEditing ? 100 : 20
  }), [isEditing]);

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
          contentContainerStyle={scrollViewContentStyle}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Profile Photo */}
          <ProfilePhoto fullName={formData.fullName} />

          {/* Form Fields */}
          <InfoField
            icon={User}
            label="Full Name"
            value={formData.fullName}
            field="fullName"
            placeholder="Enter your full name"
            isEditing={isEditing}
            onChangeText={handleFullNameChange}
            error={errors.fullName}
          />

          <InfoField
            icon={Mail}
            label="Email Address"
            value={formData.email}
            field="email"
            placeholder="Enter your email"
            keyboardType="email-address"
            isEditing={isEditing}
            onChangeText={handleEmailChange}
            error={errors.email}
          />
          
          <InfoField
            icon={Phone}
            label="Phone Number"
            value={formData.phone}
            field="phone"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={false}
            isEditing={isEditing}
            onChangeText={handlePhoneChange}
            error={errors.phone}
          />

          {/* Gender Selection */}
          <GenderSelector
            selectedGender={formData.gender}
            onGenderChange={handleGenderChange}
            isEditing={isEditing}
          />
        </ScrollView>

        {/* Sticky Bottom Buttons */}
        {isEditing && (
          <ActionButtons
            isLoading={isLoading}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}