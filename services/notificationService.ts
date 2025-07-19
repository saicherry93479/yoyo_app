
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      return true;
    } catch (error) {
      console.log('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async getExpoPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'd5ca329b-cd9c-4c98-999c-18911b43c1cb', // Replace with your Expo project ID
      });

      console.log('Expo push token:', token.data);
      return token.data;
    } catch (error) {
      console.log('Error getting Expo push token:', error);
      return null;
    }
  }

  static async registerDeviceToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await this.getExpoPushToken();
      console.log('token ',token)
      if (!token) {
        return null;
      }

      // Store token locally
      await AsyncStorage.setItem('expoPushToken', token);

      // Send token to backend
      await this.sendTokenToBackend(token);

      return token;
    } catch (error) {
      console.log('Error registering device token:', error);
      return null;
    }
  }

  static async sendTokenToBackend(token: string): Promise<void> {
    try {
      const response = await apiService.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceInfo: {
          brand: Device.brand,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
        }
      });

      if (response.success) {
        console.log('Device token registered successfully');
      } else {
        console.log('Failed to register device token:', response.error);
      }
    } catch (error) {
      console.log('Error sending token to backend:', error);
    }
  }

  static async removeTokenFromBackend(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('expoPushToken');
      if (!token) {
        return;
      }

      const response = await apiService.delete('/notifications/remove-token', {
        data: { token }
      });

      if (response.success) {
        console.log('Device token removed successfully');
      } else {
        console.log('Failed to remove device token:', response.error);
      }
    } catch (error) {
      console.log('Error removing token from backend:', error);
    }
  }

  static async clearLocalToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('expoPushToken');
      console.log('Local push token cleared');
    } catch (error) {
      console.log('Error clearing local token:', error);
    }
  }

  static async updateNotificationSettings(settings: Record<string, boolean>): Promise<void> {
    try {
      const response = await apiService.put('/notifications/settings', settings);

      if (response.success) {
        console.log('Notification settings updated successfully');
      } else {
        console.log('Failed to update notification settings:', response.error);
      }
    } catch (error) {
      console.log('Error updating notification settings:', error);
    }
  }

  static setupNotificationListeners(): () => void {
    // Listen for notifications received while app is running
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user tapping on notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap - navigate to specific screen, etc.
    });

    // Return cleanup function
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }
}
