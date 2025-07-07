import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Bell, Mail, MessageSquare, Calendar, Percent, Shield, Volume2 } from 'lucide-react-native';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'booking' | 'marketing' | 'security' | 'general';
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'booking_updates',
      title: 'Booking Updates',
      description: 'Get notified about booking confirmations, changes, and reminders',
      icon: Calendar,
      enabled: true,
      category: 'booking',
    },
    {
      id: 'payment_alerts',
      title: 'Payment Alerts',
      description: 'Receive notifications about payment confirmations and receipts',
      icon: Shield,
      enabled: true,
      category: 'booking',
    },
    {
      id: 'check_in_reminders',
      title: 'Check-in Reminders',
      description: 'Get reminded about upcoming check-ins and travel dates',
      icon: Bell,
      enabled: true,
      category: 'booking',
    },
    {
      id: 'special_offers',
      title: 'Special Offers',
      description: 'Receive notifications about deals, discounts, and promotions',
      icon: Percent,
      enabled: false,
      category: 'marketing',
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Get travel tips, destination guides, and hotel recommendations',
      icon: Mail,
      enabled: false,
      category: 'marketing',
    },
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      description: 'Important notifications about account security and login attempts',
      icon: Shield,
      enabled: true,
      category: 'security',
    },
    {
      id: 'app_updates',
      title: 'App Updates',
      description: 'Get notified about new features and app improvements',
      icon: MessageSquare,
      enabled: true,
      category: 'general',
    },
    {
      id: 'sound_notifications',
      title: 'Sound & Vibration',
      description: 'Enable sound and vibration for push notifications',
      icon: Volume2,
      enabled: true,
      category: 'general',
    },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Notifications
        </Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const toggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const renderSettingItem = (setting: NotificationSetting) => {
    const IconComponent = setting.icon;
    
    return (
      <View key={setting.id} className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
            <IconComponent size={20} color="#6B7280" />
          </View>
          <View className="flex-1">
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {setting.title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {setting.description}
            </Text>
          </View>
        </View>
        <Switch
          value={setting.enabled}
          onValueChange={() => toggleSetting(setting.id)}
          trackColor={{ false: '#E5E7EB', true: '#FEE2E2' }}
          thumbColor={setting.enabled ? '#FF5A5F' : '#F3F4F6'}
        />
      </View>
    );
  };

  const renderCategory = (title: string, category: string, description?: string) => {
    const categorySettings = getSettingsByCategory(category);
    
    return (
      <View className="mb-8">
        <View className="mb-4">
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            {title}
          </Text>
          {description && (
            <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {description}
            </Text>
          )}
        </View>
        <View className="bg-white rounded-xl border border-gray-100">
          {categorySettings.map((setting, index) => (
            <View key={setting.id}>
              {renderSettingItem(setting)}
              {index < categorySettings.length - 1 && (
                <View className="h-px bg-gray-100 ml-14" />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleTestNotification = () => {
    Alert.alert(
      'Test Notification',
      'This is how notifications will appear on your device.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Bell size={20} color="#3B82F6" />
            <Text className="text-base text-blue-900 ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Stay Updated
            </Text>
          </View>
          <Text className="text-sm text-blue-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Customize your notification preferences to stay informed about your bookings and receive relevant updates.
          </Text>
        </View>

        {/* Test Notification */}
        <TouchableOpacity
          className="bg-white rounded-xl border border-gray-100 p-4 mb-6"
          onPress={handleTestNotification}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                <MessageSquare size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Test Notification
                </Text>
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Send a test notification to your device
                </Text>
              </View>
            </View>
            <Text className="text-[#FF5A5F]" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Send
            </Text>
          </View>
        </TouchableOpacity>

        {/* Notification Categories */}
        {renderCategory(
          'Booking & Travel',
          'booking',
          'Important notifications about your reservations and trips'
        )}

        {renderCategory(
          'Marketing & Promotions',
          'marketing',
          'Deals, offers, and travel inspiration'
        )}

        {renderCategory(
          'Security & Account',
          'security',
          'Critical alerts about your account security'
        )}

        {renderCategory(
          'General',
          'general',
          'App updates and general notifications'
        )}

        {/* Footer Info */}
        <View className="bg-gray-100 rounded-xl p-4 mt-4">
          <Text className="text-sm text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            You can change these settings anytime. Some notifications may still be sent for important account security updates.
          </Text>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}