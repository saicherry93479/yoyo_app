import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { HotelCardSkeleton } from '@/components/ui/SkeletonLoader';
import { useHotels } from '@/hooks/useHotels';
import { Search, MapPin, Calendar, Users } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  
  const { hotels, loading, searchHotels } = useHotels();

  const handleSearch = () => {
    searchHotels({
      location,
      checkIn,
      checkOut,
      guests: parseInt(guests) || 2,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="h2" style={styles.title}>
          Search Hotels
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchForm}>
          <Input
            placeholder="Where are you going?"
            value={location}
            onChangeText={setLocation}
            leftIcon={<MapPin size={20} color="#8E8E93" />}
            containerStyle={styles.inputContainer}
          />

          <View style={styles.dateRow}>
            <Input
              placeholder="Check-in"
              value={checkIn}
              onChangeText={setCheckIn}
              leftIcon={<Calendar size={20} color="#8E8E93" />}
              containerStyle={[styles.inputContainer, styles.halfWidth]}
            />
            <Input
              placeholder="Check-out"
              value={checkOut}
              onChangeText={setCheckOut}
              leftIcon={<Calendar size={20} color="#8E8E93" />}
              containerStyle={[styles.inputContainer, styles.halfWidth]}
            />
          </View>

          <Input
            placeholder="Number of guests"
            value={guests}
            onChangeText={setGuests}
            keyboardType="numeric"
            leftIcon={<Users size={20} color="#8E8E93" />}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Search Hotels"
            onPress={handleSearch}
            icon={<Search size={20} color="white" style={{ marginRight: 8 }} />}
            style={styles.searchButton}
          />
        </View>

        <View style={styles.resultsSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Search Results
          </ThemedText>

          {loading ? (
            <View>
              <HotelCardSkeleton />
              <HotelCardSkeleton />
              <HotelCardSkeleton />
            </View>
          ) : (
            <View style={styles.hotelsContainer}>
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <View key={hotel.id} style={styles.hotelCard}>
                    <ThemedText type="bodySemiBold" style={styles.hotelName}>{hotel.name}</ThemedText>
                    <ThemedText type="caption" style={styles.hotelLocation}>{hotel.location}</ThemedText>
                    <View style={styles.hotelFooter}>
                      <ThemedText type="caption" style={styles.hotelRating}>⭐ {hotel.rating}</ThemedText>
                      <ThemedText type="bodySemiBold" style={styles.hotelPrice}>${hotel.price}/night</ThemedText>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <ThemedText type="body" style={styles.emptyText}>
                    No hotels found. Try adjusting your search criteria.
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchForm: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  searchButton: {
    marginTop: 8,
  },
  resultsSection: {
    flex: 1,
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelName: {
    marginBottom: 4,
  },
  hotelLocation: {
    opacity: 0.7,
    marginBottom: 12,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelRating: {
  },
  hotelPrice: {
    color: '#007AFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});