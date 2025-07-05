import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useHotels } from '@/hooks/useHotels';


export default function HomeScreen() {
  const { user } = useAuth();
  const { hotels, loading } = useHotels();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Welcome back, {user?.name?.split(' ')[0]}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Find your perfect stay
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Featured Hotels
        </ThemedText>

        {loading ? (
          <View>
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </View>
        ) : (
          <View style={styles.hotelsContainer}>
            {hotels.map((hotel) => (
              <View key={hotel.id} style={styles.hotelCard}>
                <ThemedText style={styles.hotelName}>{hotel.name}</ThemedText>
                <ThemedText style={styles.hotelLocation}>{hotel.location}</ThemedText>
                <ThemedText style={styles.hotelPrice}>${hotel.price}/night</ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  hotelsContainer: {
    paddingBottom: 100,
  },
  hotelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
