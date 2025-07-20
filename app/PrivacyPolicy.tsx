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

const PrivacyGuestPolicyScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-2xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Privacy & Guest Policy</Text>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* About Yoyo Lite */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. About Yoyo Lite</Text>
          <Text style={styles.paragraph}>
            Yoyo Lite is a budget hotel booking platform offering safe, affordable, and verified stays across multiple cities. We partner directly with hotels to ensure quality service and hassle-free experiences.
          </Text>
        </View>

        {/* Scope of This Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Scope of This Policy</Text>
          <Text style={styles.paragraph}>This policy applies to:</Text>
          <Text style={styles.bulletPoint}>
            • All users and guests booking via Yoyo Lite mobile application or verified channels.
          </Text>
          <Text style={styles.bulletPoint}>
            • All partner hotels and associated services booked through the Yoyo platform.
          </Text>
        </View>

        {/* Privacy Commitment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Privacy Commitment</Text>
          <Text style={styles.paragraph}>
            We only collect information required to provide and improve our services. Your data (name, contact, location, payment method, and stay history) is securely stored and never sold or rented.
          </Text>
        </View>

        {/* Guest Check-In Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Guest Check-In Policy</Text>
          <Text style={styles.bulletPoint}>
            • Valid government-issued photo ID (Aadhaar, Passport, Voter ID) is required for all guests. PAN card is not accepted.
          </Text>
          <Text style={styles.bulletPoint}>
            • Only pre-registered guests will be allowed to check in.
          </Text>
        </View>

        {/* Children & Pets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Children & Pets</Text>
          <Text style={styles.bulletPoint}>
            • Children under 5 years stay free with parents without an extra bed.
          </Text>
          <Text style={styles.bulletPoint}>
            • Pets are not allowed unless explicitly permitted by the hotel (check before booking).
          </Text>
        </View>

        {/* Visitors Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Visitors Policy</Text>
          <Text style={styles.bulletPoint}>
            • Visitors must register at the front desk and are not allowed in rooms after 10 PM.
          </Text>
          <Text style={styles.bulletPoint}>
            • Unregistered overnight guests may result in cancellation or penalty.
          </Text>
        </View>

        {/* Triple Occupancy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Triple Occupancy</Text>
          <Text style={styles.paragraph}>
            Standard rooms accommodate up to 2 adults. For triple occupancy, additional charges may apply and availability of an extra bed is subject to hotel policy.
          </Text>
        </View>

        {/* Check-In / Check-Out */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Check-In / Check-Out</Text>
          <Text style={styles.bulletPoint}>
            • Standard check-in time: 12:00 PM | Check-out: 11:00 AM.
          </Text>
          <Text style={styles.bulletPoint}>
            • Early check-in or late check-out is based on availability and may incur extra charges.
          </Text>
        </View>

        {/* Extra Charges for Extended Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Extra Charges for Extended Hours</Text>
          <Text style={styles.bulletPoint}>
            • Extra stay up to 2 hours after standard checkout may incur 25% of room tariff.
          </Text>
          <Text style={styles.bulletPoint}>
            • Stays beyond 4 hours will be charged as a full-day rate.
          </Text>
        </View>

        {/* Safety & Security Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Safety & Security Policy</Text>
          <Text style={styles.bulletPoint}>
            • All Yoyo Lite hotels are verified for basic safety standards.
          </Text>
          <Text style={styles.bulletPoint}>
            • CCTV surveillance is installed in common areas.
          </Text>
          <Text style={styles.bulletPoint}>
            • Emergency contact details are available at reception.
          </Text>
        </View>

        {/* Contact Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contact Policy</Text>
          <Text style={styles.bulletPoint}>
            • Yoyo Lite may contact you for booking confirmations or feedback via SMS, WhatsApp, or calls.
          </Text>
          <Text style={styles.bulletPoint}>
            • We never ask for OTPs, passwords, or external payments.
          </Text>
        </View>

        {/* On-Time Service Guarantee */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. On-Time Service Guarantee</Text>
          <Text style={styles.bulletPoint}>
            • Room to be ready by check-in time, or a complimentary refreshment voucher will be provided.
          </Text>
          <Text style={styles.bulletPoint}>
            • Service issues will be resolved within 2 hours.
          </Text>
        </View>

        {/* No Smoking & Drinking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. No Smoking & Drinking</Text>
          <Text style={styles.paragraph}>
            Smoking and alcohol consumption is prohibited unless allowed by hotel policy. Cleaning/damage fees may apply.
          </Text>
        </View>

        {/* Long Stay Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Long Stay Bookings</Text>
          <Text style={styles.bulletPoint}>
            • For bookings longer than 7 days, a security deposit or interim ID verification may be required.
          </Text>
          <Text style={styles.bulletPoint}>
            • Housekeeping and room inspections will be scheduled.
          </Text>
        </View>

        {/* Fraud & Booking Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Fraud & Booking Safety</Text>
          <Text style={styles.bulletPoint}>
            • Book only through the Yoyo Lite app or official WhatsApp.
          </Text>
          <Text style={styles.bulletPoint}>
            • Avoid payments to personal bank accounts.
          </Text>
          <Text style={styles.bulletPoint}>
            • Report fraud to support@yoyolite.in.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>16. Contact Us</Text>
          <Text style={styles.bulletPoint}>
            • Customer Support: +91-XXXXXXXXXX
          </Text>
          <Text style={styles.bulletPoint}>
            • Email: support@yoyolite.in
          </Text>
          <Text style={styles.bulletPoint}>
            • Office: [Your registered company address]
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

export default PrivacyGuestPolicyScreen;