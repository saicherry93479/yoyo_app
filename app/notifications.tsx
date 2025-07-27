import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Calendar, Shield, Percent, MessageSquare } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { NotificationService } from '@/services/notificationService';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  apiKey: string;
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'booking_updates',
      title: 'Booking Updates',
      description: 'Get notified about booking confirmations, changes, and reminders',
      icon: Calendar,
      enabled: user?.bookingUpdatesEnabled ?? true,
      apiKey: 'bookingUpdatesEnabled',
    },
    {
      id: 'checkin_reminders',
      title: 'Check-in Reminders',
      description: 'Get reminded about upcoming check-ins and travel dates',
      icon: Bell,
      enabled: user?.checkinRemindersEnabled ?? true,
      apiKey: 'checkinRemindersEnabled',
    },
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      description: 'Important notifications about account security and login attempts',
      icon: Shield,
      enabled: user?.securityAlertsEnabled ?? true,
      apiKey: 'securityAlertsEnabled',
    },
    {
      id: 'promotional_offers',
      title: 'Special Offers & Promotions',
      description: 'Receive notifications about deals, discounts, and special promotions',
      icon: Percent,
      enabled: user?.promotionalOffersEnabled ?? false,
      apiKey: 'promotionalOffersEnabled',
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

  const toggleSetting = async (id: string) => {
    const setting = settings.find(s => s.id === id);
    if (!setting) return;

    const newValue = !setting.enabled;

    // Optimistically update UI
    setSettings(prev => 
      prev.map(s => 
        s.id === id 
          ? { ...s, enabled: newValue }
          : s
      )
    );

    try {
      setIsLoading(true);

      // Prepare request body with the specific notification setting
      const requestBody = {
        [setting.apiKey]: newValue,
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

        // Show success message for important changes
        if (setting.id === 'security_alerts' && !newValue) {
          Alert.alert(
            'Security Alerts Disabled',
            'You will no longer receive security notifications. You can re-enable them anytime.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Revert optimistic update on failure
        setSettings(prev => 
          prev.map(s => 
            s.id === id 
              ? { ...s, enabled: !newValue }
              : s
          )
        );
        Alert.alert('Error', response.message || 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Notification setting update error:', error);
      // Revert optimistic update on error
      setSettings(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, enabled: !newValue }
            : s
        )
      );
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingItem = (setting: NotificationSetting) => {
    const IconComponent = setting.icon;

    return (
      <View key={setting.id} className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
            <IconComponent size={22} color="#6B7280" />
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
        <View className="ml-3">
          <Switch
            value={setting.enabled}
            onValueChange={() => toggleSetting(setting.id)}
            trackColor={{ false: '#E5E7EB', true: '#FEE2E2' }}
            thumbColor={setting.enabled ? '#000000' : '#F3F4F6'}
            disabled={isLoading}
          />
        </View>
      </View>
    );
  };

  const handleTestNotification = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive test notifications.'
        );
        return;
      }

      // Send test notification to backend
      const response = await apiService.post('/notifications/test', {
        message: 'This is a test notification from your hotel booking app!'
      });
    
      if (response.success) {
        Alert.alert('Success', 'Test notification sent successfully!');
      } else {
        Alert.alert('Error', 'Failed to send test notification');
      }
    } catch (error) {
      console.log('Test notification error:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
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
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                <MessageSquare size={22} color="#8B5CF6" />
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
            <Text className="text-black" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Send
            </Text>
          </View>
        </TouchableOpacity>

        {/* Notification Settings */}
        <View className="mb-6">
          <View className="mb-4">
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Notification Preferences
            </Text>
            <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Choose which notifications you want to receive
            </Text>
          </View>

          <View className="bg-white rounded-xl border border-gray-100">
            {settings.map((setting, index) => (
              <View key={setting.id}>
                {renderSettingItem(setting)}
                {index < settings.length - 1 && (
                  <View className="h-px bg-gray-100 ml-16" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#000000" />
              <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Updating notification settings...
              </Text>
            </View>
          </View>
        )}

        {/* Important Notice */}
        <View className="bg-amber-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Shield size={18} color="#F59E0B" />
            <Text className="text-sm text-amber-800 ml-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Important Notice
            </Text>
          </View>
          <Text className="text-sm text-amber-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Security alerts are highly recommended to keep your account safe. Some critical notifications may still be sent regardless of your preferences.
          </Text>
        </View>

        {/* Footer Info */}
        <View className="bg-gray-100 rounded-xl p-4 mt-4">
          <Text className="text-sm text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            You can change these settings anytime. Changes are saved automatically to your account.
          </Text>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}