import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BookingCardSkeleton } from '@/components/ui/SkeletonLoader';
import { useBookings } from '@/hooks/useBookings';

export default function BookingsScreen() {
  const { bookings, loading } = useBookings();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Bookings
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View>
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </View>
        ) : (
          <View style={styles.bookingsContainer}>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <ThemedText style={styles.hotelName}>{booking.hotelName}</ThemedText>
                    <View style={[styles.statusBadge, styles[`status${booking.status}`]]}>
                      <ThemedText style={styles.statusText}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.bookingDetails}>
                    <ThemedText style={styles.detailText}>
                      Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      Guests: {booking.guests}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.bookingFooter}>
                    <ThemedText style={styles.totalAmount}>
                      Total: ${booking.totalAmount}
                    </ThemedText>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>
                  No bookings yet. Start exploring hotels to make your first booking!
                </ThemedText>
              </View>
            )}
          </View>
        )}
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
  bookingsContainer: {
    paddingBottom: 100,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusconfirmed: {
    backgroundColor: '#E8F5E8',
  },
  statuspending: {
    backgroundColor: '#FFF3CD',
  },
  statuscancelled: {
    backgroundColor: '#F8D7DA',
  },
  statuscompleted: {
    backgroundColor: '#D1ECF1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  bookingFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
});