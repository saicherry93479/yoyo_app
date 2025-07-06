import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { X, Phone, Mail, MessageCircle } from 'lucide-react-native';

interface ContactHotelActionSheetProps {
  sheetId: string;
  payload?: {
    hotelName: string;
    phone: string;
    email: string;
  };
}

export function ContactHotelActionSheet({ sheetId, payload }: ContactHotelActionSheetProps) {
  const { hotelName, phone, email } = payload || {};

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handlePhoneCall = async () => {
    if (!phone) return;
    
    try {
      const phoneUrl = `tel:${phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      
      if (canOpen) {
        await Linking.openURL(phoneUrl);
        handleClose();
      } else {
        Alert.alert('Error', 'Unable to make phone call');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleEmail = async () => {
    if (!email) return;
    
    try {
      const emailUrl = `mailto:${email}?subject=Booking Inquiry - ${hotelName}`;
      const canOpen = await Linking.canOpenURL(emailUrl);
      
      if (canOpen) {
        await Linking.openURL(emailUrl);
        handleClose();
      } else {
        Alert.alert('Error', 'Unable to open email client');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  const handleWhatsApp = async () => {
    if (!phone) return;
    
    try {
      // Remove country code and format for WhatsApp
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=Hello, I have a booking inquiry for ${hotelName}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        handleClose();
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open WhatsApp');
    }
  };

  return (
    <ActionSheet 
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      gestureEnabled={true}
      closable={true}
      closeOnTouchBackdrop={true}
    >
      <View className="flex-col items-stretch rounded-t-2xl bg-white pt-3">
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center">
          <View className="h-1.5 w-10 rounded-full bg-gray-200" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-2xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Contact Hotel
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Hotel Name */}
        <View className="px-6 pb-4">
          <Text className="text-lg text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {hotelName}
          </Text>
        </View>

        {/* Contact Options */}
        <View className="px-6 pb-6 space-y-3">
          <TouchableOpacity
            className="flex-row items-center p-4 bg-green-50 border border-green-200 rounded-xl"
            onPress={handlePhoneCall}
          >
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Phone size={24} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Call Hotel
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {phone}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4 bg-blue-50 border border-blue-200 rounded-xl"
            onPress={handleEmail}
          >
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Mail size={24} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Send Email
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                {email}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4 bg-green-50 border border-green-200 rounded-xl"
            onPress={handleWhatsApp}
          >
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <MessageCircle size={24} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                WhatsApp
              </Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Send a message
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <TouchableOpacity 
            onPress={handleClose}
            className="w-full h-12 bg-gray-100 rounded-lg items-center justify-center"
          >
            <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}