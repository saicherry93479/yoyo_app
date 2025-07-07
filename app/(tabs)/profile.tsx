import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router, useNavigation } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  // SVG Components based on your original HTML
  const BackIcon = ({ size = 24, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </Svg>
  );

  const UserIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </Svg>
  );

  const CreditCardIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </Svg>
  );

  const BellIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
    </Svg>
  );

  const SettingsIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </Svg>
  );

  const HelpIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
    </Svg>
  );

  const MessageIcon = ({ size = 28, color = "#374151" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </Svg>
  );

  const ChevronRightIcon = ({ size = 20, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <Path d="M181.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L166.69,128,98.34,59.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,181.66,133.66Z" />
    </Svg>
  );

  const menuItems = [
    {
      section: 'Account Settings',
      items: [
        { icon: UserIcon, label: 'Personal information', onPress: () => {
          router.push('/personal-info')
        } },
        { icon: CreditCardIcon, label: 'Payment methods', onPress: () => {} },
        { icon: BellIcon, label: 'Notifications', onPress: () => {
          router.push('/notifications')
        } },
        { icon: SettingsIcon, label: 'Settings', onPress: () => {} },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: HelpIcon, label: 'Help Center', onPress: () => {} },
        { icon: MessageIcon, label: 'Contact us', onPress: () => {
          router.push('/contactus')
        } },
      ]
    }
  ];

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
    <View className="flex-1 bg-white">
      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Profile Section */}
        <View className="flex-row items-center gap-4 mb-8">
          <View className="relative">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEge7MQC0MLY28227eQEwx3A3dYhxnRrlXYFJZzZVy9K09XXZ1fu1Gw_Y6Y76uySWhIHGTa1BHnwUJd2hTvwqH5sL5bR-AXweZz8IdGWdYNV6KHcCRf0ShYDYi0fYZguUtd7bV8KuR7XOs9eNV9k0jq_FQYezxz-SNIRi2Z-cQKFNqajKaCOoBYI64w1LK4Vnm1B0AufLtX_Ngd-10fnErG_fs-1hRW7xp2l5Wl-YcUcCIuQGlw1ueeQpNUaR3Z6J9zEbRoj6ySg' }}
              className="w-20 h-20 rounded-full"
              style={{ aspectRatio: 1 }}
            />
          </View>
          <View className="flex-col">
            <Text className="text-gray-900 text-2xl" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Sophia Carter</Text>
            <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Guest</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View className="gap-8">
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              <Text className="text-gray-900 text-xl pb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{section.section}</Text>
              <View className="gap-1">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    className="flex-row items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-lg transition-colors"
                    onPress={item.onPress}
                  >
                    <View className="flex-row items-center gap-4">
                      <item.icon size={28} color="#374151" />
                      <Text className="text-gray-800 text-base flex-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>{item.label}</Text>
                    </View>
                    <View className="shrink-0">
                      <ChevronRightIcon size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-4 pt-4 border-t border-gray-100 mt-6">
          <TouchableOpacity className="w-full py-3">
            <Text className="text-gray-700 text-left" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;