
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
import { useNavigation, router } from 'expo-router';
import { ArrowLeft, Building, User, Mail, Phone, MapPin } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PartnerRegistrationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hotelName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    description: '',
    roomCount: '',
    experience: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Join as Partner
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['hotelName', 'ownerName', 'email', 'phone', 'address', 'city'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData].trim()) {
        Alert.alert('Error', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const response = await apiService.post('/partners/register', {
        hotelName: formData.hotelName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        description: formData.description.trim(),
        roomCount: parseInt(formData.roomCount) || 0,
        experience: formData.experience.trim(),
      });

      if (response.success) {
        Alert.alert(
          'Application Submitted!',
          'Thank you for your interest in joining YOYO as a partner. We will review your application and get back to you within 3-5 business days.',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Partner registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl text-[#161312] mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Partner with YOYO
          </Text>
          <Text className="text-gray-600 text-base leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Join our network of trusted hotel partners and grow your business with us.
          </Text>
        </View>

        {/* Form */}
        <View className="flex gap-y-6">
          {/* Hotel Information */}
          <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Text className="text-[#161312] text-lg mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Hotel Information
            </Text>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Hotel Name *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Building size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter hotel name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.hotelName}
                  onChangeText={(text) => handleInputChange('hotelName', text)}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Number of Rooms
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Building size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Total number of rooms"
                  placeholderTextColor="#9CA3AF"
                  value={formData.roomCount}
                  onChangeText={(text) => handleInputChange('roomCount', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="mb-0">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Hotel Description
              </Text>
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <TextInput
                  className="text-[#161312] text-base min-h-[80px]"
                  style={{ fontFamily: 'PlusJakartaSans-Regular', textAlignVertical: 'top' }}
                  placeholder="Tell us about your hotel, amenities, and unique features"
                  placeholderTextColor="#9CA3AF"
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>

          {/* Owner Information */}
          <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Text className="text-[#161312] text-lg mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Owner Information
            </Text>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Full Name *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <User size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.ownerName}
                  onChangeText={(text) => handleInputChange('ownerName', text)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Email Address *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Mail size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter email address"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-0">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Phone Number *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Phone size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Location Information */}
          <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Text className="text-[#161312] text-lg mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Location
            </Text>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Address *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter hotel address"
                  placeholderTextColor="#9CA3AF"
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                />
              </View>
            </View>

            <View className="mb-0">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                City *
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-[#161312] text-base"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  placeholder="Enter city"
                  placeholderTextColor="#9CA3AF"
                  value={formData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                />
              </View>
            </View>
          </View>

          {/* Experience */}
          <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Text className="text-[#161312] text-lg mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Experience
            </Text>

            <View className="mb-0">
              <Text className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Previous Experience in Hospitality
              </Text>
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <TextInput
                  className="text-[#161312] text-base min-h-[80px]"
                  style={{ fontFamily: 'PlusJakartaSans-Regular', textAlignVertical: 'top' }}
                  placeholder="Tell us about your experience in the hospitality industry"
                  placeholderTextColor="#9CA3AF"
                  value={formData.experience}
                  onChangeText={(text) => handleInputChange('experience', text)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View className="mt-8 mb-8">
          <TouchableOpacity
            className={`w-full p-4 rounded-2xl items-center ${loading ? 'bg-gray-400' : 'bg-black'}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <Text className="text-white text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Submit Application
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnerRegistrationScreen;
