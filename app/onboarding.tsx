import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin } from 'lucide-react-native';
import { apiService } from '@/services/api';

interface OnboardingData {
  name: string;
  email: string;
  location: string;
  dob: string;
  gender: string;
  avatar?: string;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    location: '',
    dob: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user, setUser } = useAuth();
  const navigation = useNavigation();

  const steps = [
    {
      title: '',
      subtitle: '',
      component: WelcomeStep,
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      component: PersonalInfoStep,
    }
  ];

  // Configure header based on current step
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="flex-row gap-2">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${index <= currentStep ? 'bg-[#FF5A5F]' : 'bg-gray-200'
                }`}
            />
          ))}
        </View>
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        currentStep > 0 ? (
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center ml-4"
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
        ) : null
      ),
      headerRight: () => (
        currentStep === 1 ? (
          <TouchableOpacity onPress={handleSkip} className="mr-4">
            <Text className="text-[#FF5A5F]" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : null
      ),
    });
  }, [navigation, currentStep]);

  function WelcomeStep() {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
          className="w-64 h-48 rounded-2xl mb-8"
          resizeMode="cover"
        />

        <View className="items-center mb-8">
          <Text className="text-3xl text-gray-900 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Welcome to HotelBooking!
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Discover amazing hotels, read reviews from travelers, and book your perfect stay with ease.
          </Text>
        </View>

        <View className="w-full gap-4">
          <View className="flex-row items-center p-4 bg-blue-50 rounded-xl">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-xl">🏨</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Discover Hotels
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Find perfect accommodations worldwide
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 bg-green-50 rounded-xl">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-xl">⭐</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Read Reviews
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Check ratings from other travelers
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 bg-purple-50 rounded-xl">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Text className="text-xl">💳</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Easy Booking
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Book instantly with secure payments
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function PersonalInfoStep() {
    // Memoize the updateFormData function to prevent unnecessary re-renders
    const updateFormData = React.useCallback((field: keyof OnboardingData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }, [errors]);

    return (
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Avatar Section */}
        {/* <View className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} className="w-24 h-24 rounded-full" />
              ) : (
                <User size={32} color="#9CA3AF" />
              )}
            </View>
            <TouchableOpacity className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF5A5F] rounded-full items-center justify-center">
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Add a profile photo (optional)
          </Text>
        </View> */}

        {/* Form Fields */}
        <View className="gap-4">
          {/* Name */}
          <View>
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Full Name
            </Text>
            <View className="flex-row items-center rounded-lg border border-gray-300 px-4 py-3">
              <User size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            {errors.name && (
              <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Email Address
            </Text>
            <View className="flex-row items-center rounded-lg border border-gray-300 px-4 py-3">
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            {errors.email && (
              <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Date of Birth */}
          {/* <View>
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Date of Birth
            </Text> */}
          {/* <View className="flex-row items-center rounded-lg border border-gray-300 px-4 py-3">
              <Text className="text-gray-400 mr-3">📅</Text>
              <TextInput
                className="flex-1 text-base text-gray-900"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={formData.dob}
                onChangeText={(value) => updateFormData('dob', value)}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View> */}
          {/* {errors.dob && (
              <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {errors.dob}
              </Text>
            )}
          </View> */}

          {/* Gender */}
          <View>
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Gender
            </Text>
            <View className="flex-row gap-3">
              {['Male', 'Female', 'Other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className={`flex-1 py-3 rounded-lg border items-center ${formData.gender === gender
                    ? 'border-[#FF5A5F] bg-red-50'
                    : 'border-gray-300 bg-white'
                    }`}
                  onPress={() => updateFormData('gender', gender)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm ${formData.gender === gender ? 'text-black' : 'text-gray-700'
                      }`}
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text className="text-sm text-red-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {errors.gender}
              </Text>
            )}
          </View>

          {/* Location */}
          {/* <View>
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Location (Optional)
            </Text>
            <View className="flex-row items-center rounded-lg border border-gray-300 px-4 py-3">
              <MapPin size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                placeholder="City, Country"
                placeholderTextColor="#9CA3AF"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
          </View> */}
        </View>

        <Text className="text-xs text-gray-500 mt-6 text-center leading-5" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          This information helps us personalize your experience. You can always update it later in your profile settings.
        </Text>
      </ScrollView>
    );
  }


  const validateStep = () => {
    if (currentStep === 1) {
      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {

    try {
      await apiService.post('profile/onboarding/skip')
      setUser({
        ...user,
        hasOnboarded: true
      })
      router.replace('/(tabs)')
    } catch (e) {
      Alert.alert('Error', 'Unable to skip now')
    }


  };

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);

      // Simulate API call to update user profile
      await apiService.post('profile/onboarding/complete', {
        fullName: formData.name,
        email: formData.email,
        gender: formData.gender?.toLowerCase() || "prefer_not_to_say",
      })

      // Update user with onboarding completion and profile data
      if (user) {
        const updatedUser = {
          ...user,
          hasOnboarded: true,
          name: formData.name || user.name,
          email: formData.email || user.email,

        };
        setUser(updatedUser);

        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Step Title */}
      <View className="px-6 mb-6">
        <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          {steps[currentStep].title}
        </Text>
        <Text className="text-base text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {steps[currentStep].subtitle}
        </Text>
      </View>

      {/* Step Content */}
      <View className="flex-1">
        <CurrentStepComponent />
      </View>

      {/* Footer */}
      <View className="px-6 py-6">
        {currentStep === steps.length - 1 ? (
          <TouchableOpacity
            className="w-full h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
            onPress={completeOnboarding}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Start Exploring
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="w-full h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
            onPress={handleNext}
          >
            <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {currentStep === 0 ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}