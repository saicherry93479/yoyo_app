import 'react-native-get-random-values';
import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated/lib/reanimated2/NativeReanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/notificationService';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import 'react-native-reanimated';
import '../global.css';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SheetProvider } from 'react-native-actions-sheet';
import './sheets';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  });

  if (!loaded && !error) {
    return null;
  }

  useEffect(() => {
    NotificationService.registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>

      <SheetProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
          <Stack initialRouteName='(tabs)'>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: true }} />
            <Stack.Screen name="hotels" options={{ headerShown: true }} />
            <Stack.Screen name="checkout" options={{ headerShown: true }} />
            <Stack.Screen name="contactus" options={{ headerShown: true }} />
            <Stack.Screen name="personal-info" options={{ headerShown: true }} />
            <Stack.Screen name="notifications" options={{ headerShown: true }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </SheetProvider>
    </AuthProvider>
  );
}