// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  HomeIcon, 
  SearchIcon, 
  WishlistIcon, 
  TripsIcon, 
  ProfileIcon 
} from '@/components/icons/TabIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: true,
        // tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 90, // Increased height
            borderTopLeftRadius: 20, // Curved top left corner
            borderTopRightRadius: 20, // Curved top right corner
            paddingBottom: 34, // Account for iOS safe area
            paddingTop: 10, // Add some top padding
          },
          default: {
            backgroundColor: Colors.light.card,
            borderTopColor: Colors.light.border,
            height: 80, // Increased height for Android
            borderTopLeftRadius: 20, // Curved top left corner
            borderTopRightRadius: 20, // Curved top right corner
            paddingBottom: 10, // Add some bottom padding
            paddingTop: 10, // Add some top padding
            elevation: 8, // Add shadow on Android
            shadowColor: '#000', // Shadow for better visual separation
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <SearchIcon size={size} color={color} />,
          // headerShown:false
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: 'Wishlists',
          tabBarIcon: ({ color, size }) => <WishlistIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <TripsIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <ProfileIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}