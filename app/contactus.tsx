import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// Back Arrow Icon
const ArrowLeftIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" fill={color} />
  </Svg>
);

// Phone Icon
const PhoneIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" fill={color} />
  </Svg>
);

// Email Icon
const EmailIcon = ({ size = 24, color = "#F97316" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" fill={color} />
  </Svg>
);

const ContactUsScreen = () => {

    const navigation = useNavigation();
  const handlePhonePress = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone app is not available on this device');
        }
      })
      .catch((err) => console.error('Error opening phone app:', err));
  };

  const handleEmailPress = (email) => {
    const emailUrl = `mailto:${email}`;
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'Email app is not available on this device');
        }
      })
      .catch((err) => console.error('Error opening email app:', err));
  };

  const handleBackPress = () => {
    // Handle back navigation

  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-2xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Profile</Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
   

      <ScrollView className="flex-1 bg-white">
        <View className="px-4 py-6 gap-8">
          {/* General Inquiries Section */}
          <View>
            <Text 
              className="text-gray-900 text-2xl mb-4"
              style={{ fontFamily: 'PlusJakartaSans-Bold' }}
            >
              General Inquiries
            </Text>
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Phone Contact */}
              <TouchableOpacity 
                onPress={() => handlePhonePress('+15551234567')}
                className="flex-row items-center p-4 border-b border-gray-100"
              >
                <View className="flex items-center justify-center rounded-full bg-orange-100 w-12 h-12 mr-4">
                  <PhoneIcon size={24} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-gray-800 text-base mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Phone
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    +1 (555) 123-4567
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Email Contact */}
              <TouchableOpacity 
                onPress={() => handleEmailPress('support@example.com')}
                className="flex-row items-center p-4"
              >
                <View className="flex items-center justify-center rounded-full bg-orange-100 w-12 h-12 mr-4">
                  <EmailIcon size={24} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-gray-800 text-base mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Email
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    support@example.com
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Section */}
          <View>
            <Text 
              className="text-gray-900 text-2xl mb-4"
              style={{ fontFamily: 'PlusJakartaSans-Bold' }}
            >
              Support
            </Text>
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Support Phone */}
              <TouchableOpacity 
                onPress={() => handlePhonePress('+15559876543')}
                className="flex-row items-center p-4 border-b border-gray-100"
              >
                <View className="flex items-center justify-center rounded-full bg-orange-100 w-12 h-12 mr-4">
                  <PhoneIcon size={24} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-gray-800 text-base mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Phone
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    +1 (555) 987-6543
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Support Email */}
              <TouchableOpacity 
                onPress={() => handleEmailPress('support@example.com')}
                className="flex-row items-center p-4"
              >
                <View className="flex items-center justify-center rounded-full bg-orange-100 w-12 h-12 mr-4">
                  <EmailIcon size={24} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-gray-800 text-base mb-1"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Email
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    support@example.com
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

  );
};

export default ContactUsScreen;