import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { X, Calendar, Users, XCircle, Edit3 } from 'lucide-react-native';

interface ModifyBookingActionSheetProps {
  sheetId: string;
  payload?: {
    bookingId: string;
    canCancel: boolean;
    canModify: boolean;
  };
}

export function ModifyBookingActionSheet({ sheetId, payload }: ModifyBookingActionSheetProps) {
  const { bookingId, canCancel, canModify } = payload || {};

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleModifyDates = () => {
    Alert.alert(
      'Modify Dates',
      'This feature will allow you to change your check-in and check-out dates.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Implement date modification logic
          console.log('Modify dates for booking:', bookingId);
          handleClose();
        }}
      ]
    );
  };

  const handleModifyGuests = () => {
    Alert.alert(
      'Modify Guests',
      'This feature will allow you to change the number of guests.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Implement guest modification logic
          console.log('Modify guests for booking:', bookingId);
          handleClose();
        }}
      ]
    );
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        { 
          text: 'Cancel Booking', 
          style: 'destructive',
          onPress: () => {
            // Implement cancellation logic
            console.log('Cancel booking:', bookingId);
            handleClose();
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
          }
        }
      ]
    );
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
            Modify Booking
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Modification Options */}
        <View className="px-6 pb-6 space-y-3">
          {canModify && (
            <>
              <TouchableOpacity
                className="flex-row items-center p-4 bg-blue-50 border border-blue-200 rounded-xl"
                onPress={handleModifyDates}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Calendar size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    Change Dates
                  </Text>
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    Modify check-in and check-out dates
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 bg-purple-50 border border-purple-200 rounded-xl"
                onPress={handleModifyGuests}
              >
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Users size={24} color="#7C3AED" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    Change Guests
                  </Text>
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    Modify number of guests
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {canCancel && (
            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 border border-red-200 rounded-xl"
              onPress={handleCancelBooking}
            >
              <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                <XCircle size={24} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Cancel Booking
                </Text>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Cancel this reservation
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {!canModify && !canCancel && (
            <View className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <Text className="text-base text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                This booking cannot be modified or cancelled.
              </Text>
            </View>
          )}
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