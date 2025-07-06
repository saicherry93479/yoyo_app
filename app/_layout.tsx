import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext'
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

  return (
    <AuthProvider>
      
      <SheetProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
          <Stack initialRouteName='(auth)'>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="hotels" options={{ headerShown: true }} />
            <Stack.Screen name="checkout" options={{ headerShown: true }} />
            <Stack.Screen name="contactus" options={{ headerShown: true }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </SheetProvider>
    </AuthProvider>
  );
}
