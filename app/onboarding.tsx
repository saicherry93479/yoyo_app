import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to complete onboarding
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user onboarding status
      if (user) {
        const updatedUser = { ...user, hasOnboarded: true };
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="h2" style={styles.title}>
            Welcome to HotelBooking!
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Let's get you set up to start booking amazing hotels
          </ThemedText>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <ThemedText type="h5" style={styles.featureTitle}>🏨 Discover Hotels</ThemedText>
            <ThemedText type="body" style={styles.featureDescription}>
              Find and book the perfect hotel for your next trip
            </ThemedText>
          </View>

          <View style={styles.feature}>
            <ThemedText type="h5" style={styles.featureTitle}>⭐ Read Reviews</ThemedText>
            <ThemedText type="body" style={styles.featureDescription}>
              Check ratings and reviews from other travelers
            </ThemedText>
          </View>

          <View style={styles.feature}>
            <ThemedText type="h5" style={styles.featureTitle}>💳 Easy Booking</ThemedText>
            <ThemedText type="body" style={styles.featureDescription}>
              Book instantly with secure payment options
            </ThemedText>
          </View>
        </View>

        <Button
          title="Get Started"
          onPress={completeOnboarding}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 24,
  },
  features: {
    marginBottom: 60,
  },
  feature: {
    marginBottom: 32,
    alignItems: 'center',
  },
  featureTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginBottom: 40,
  },
});