import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonLoaderProps) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, animatedStyle, { borderRadius }]} />
    </View>
  );
}

// Predefined skeleton components
export function HotelCardSkeleton() {
  return (
    <View style={styles.hotelCard}>
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.hotelCardContent}>
        <SkeletonLoader width="80%" height={20} />
        <SkeletonLoader width="60%" height={16} style={{ marginTop: 8 }} />
        <View style={styles.hotelCardFooter}>
          <SkeletonLoader width={80} height={16} />
          <SkeletonLoader width={60} height={20} />
        </View>
      </View>
    </View>
  );
}

export function BookingCardSkeleton() {
  return (
    <View style={styles.bookingCard}>
      <SkeletonLoader width={100} height={100} borderRadius={12} />
      <View style={styles.bookingCardContent}>
        <SkeletonLoader width="80%" height={20} />
        <SkeletonLoader width="60%" height={16} style={{ marginTop: 8 }} />
        <SkeletonLoader width="40%" height={16} style={{ marginTop: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <SkeletonLoader width={80} height={16} />
          <SkeletonLoader width={60} height={20} />
        </View>
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.profile}>
      <SkeletonLoader width={80} height={80} borderRadius={40} />
      <View style={styles.profileContent}>
        <SkeletonLoader width="60%" height={20} />
        <SkeletonLoader width="80%" height={16} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
    backgroundColor: '#F2F8FC',
  },
  hotelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelCardContent: {
    padding: 16,
  },
  hotelCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bookingCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileContent: {
    flex: 1,
    marginLeft: 16,
  },
});