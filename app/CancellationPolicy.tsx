import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from 'expo-router';


const PolicyScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-2xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Cancellation & Refund</Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cancellation Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Cancellation Rules</Text>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Free Cancellation:</Text>
            <Text style={styles.bulletPoint}>
              • Cancel up to 6 hours before check-in time for a 100% refund.
            </Text>
            <Text style={styles.bulletPoint}>
              • Applies to all prepaid bookings unless marked 'Non-Refundable.'
            </Text>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Late Cancellation (Within 6 Hours):</Text>
            <Text style={styles.bulletPoint}>
              • No refund if cancelled less than 6 hours before check-in.
            </Text>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>No-Show:</Text>
            <Text style={styles.bulletPoint}>
              • If you do not arrive at the hotel and don't cancel, your booking is non-refundable.
            </Text>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Non-Refundable Rooms:</Text>
            <Text style={styles.bulletPoint}>
              • Some discounted rooms may be non-refundable, clearly marked at the time of booking.
            </Text>
          </View>
        </View>

        {/* Refund Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Refund Process</Text>
          <Text style={styles.paragraph}>
            Refunds (if applicable) will be initiated within 24 hours of cancellation.
          </Text>
          <Text style={styles.paragraph}>
            It may take 3-7 business days to reflect in your original payment method (UPI, card, wallet).
          </Text>
          <Text style={styles.paragraph}>
            You'll receive an email and SMS once your refund is processed.
          </Text>
        </View>

        {/* Hotel-Related Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Hotel-Related Issues</Text>
          <Text style={styles.paragraph}>If your hotel:</Text>
          <Text style={styles.bulletPoint}>• Is overbooked</Text>
          <Text style={styles.bulletPoint}>• Denies check-in</Text>
          <Text style={styles.bulletPoint}>• Or is found to be not as listed</Text>

          <Text style={[styles.paragraph, styles.marginTop]}>Then:</Text>
          <Text style={styles.bulletPoint}>
            We'll offer an alternate hotel nearby (equal or better).
          </Text>
          <Text style={styles.bulletPoint}>
            Or, offer a full 100% refund - your choice.
          </Text>
        </View>

        {/* Customer Support */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>4. Customer Support</Text>
          <Text style={styles.paragraph}>Need help?</Text>
          <Text style={styles.bulletPoint}>• Tap 'Help' in the app</Text>
          <Text style={styles.bulletPoint}>
            • Or contact us on WhatsApp any time before or after check-in.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#111827',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 22,
    color: '#374151',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 22,
    color: '#374151',
    marginBottom: 6,
  },
  marginTop: {
    marginTop: 16,
  },
});

export default PolicyScreen;