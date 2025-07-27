import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { X, User } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ModifyGuestNameActionSheetProps {
  sheetId: string;
  payload?: {
    bookingId: string;
    currentGuestName: string;
    onGuestNameUpdated: (newName: string) => void;
  };
}

export function ModifyGuestNameActionSheet({ sheetId, payload }: ModifyGuestNameActionSheetProps) {
  const [guestName, setGuestName] = useState(payload?.currentGuestName || '');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleSave = async () => {
    if (!guestName.trim()) {
      Alert.alert('Error', 'Please enter a valid guest name');
      return;
    }

    if (guestName.trim() === payload?.currentGuestName) {
      handleClose();
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.put(`/bookings/${payload?.bookingId}/guest-name`, {
        guestName: guestName.trim()
      });

      if (response.success) {
        payload?.onGuestNameUpdated(guestName.trim());
        Alert.alert('Success', 'Guest name updated successfully');
        handleClose();
      } else {
        Alert.alert('Error', response.error || 'Failed to update guest name');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update guest name');
    } finally {
      setLoading(false);
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
          <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Modify Guest Name
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 pb-6">
          <Text className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Update the primary guest name for this booking. This name will be used for check-in at the hotel.
          </Text>

          <View className="mb-6">
            <Text className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Guest Name
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
              <User size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-[#161312] text-base"
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                placeholder="Enter guest name"
                placeholderTextColor="#9CA3AF"
                value={guestName}
                onChangeText={setGuestName}
                autoCapitalize="words"
                autoFocus={true}
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-12 bg-gray-100 rounded-lg items-center justify-center"
              onPress={handleClose}
              disabled={loading}
            >
              <Text className="text-gray-700 text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 h-12 rounded-lg items-center justify-center ${
                guestName.trim() && !loading ? 'bg-black' : 'bg-gray-300'
              }`}
              onPress={handleSave}
              disabled={!guestName.trim() || loading}
            >
              {loading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}