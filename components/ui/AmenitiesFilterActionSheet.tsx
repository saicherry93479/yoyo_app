
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Wifi, Car, Utensils, Waves, Dumbbell, Space as Spa } from 'lucide-react-native';

interface AmenitiesFilterActionSheetProps {
  sheetId: string;
  payload?: {
    currentAmenities: string[];
    onAmenitiesSelect: (amenities: string[]) => void;
  };
}

const amenitiesList = [
  { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
  { id: 'spa', label: 'Spa', icon: Spa },
];

export function AmenitiesFilterActionSheet({ sheetId, payload }: AmenitiesFilterActionSheetProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(payload?.currentAmenities || []);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApply = () => {
    payload?.onAmenitiesSelect(selectedAmenities);
    handleClose();
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleClear = () => {
    setSelectedAmenities([]);
  };

  return (
    <ActionSheet
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      closable={true}
      closeOnTouchBackdrop={true}
      snapPoints={[70]}
    >
      <View className="rounded-t-2xl bg-white pt-3">
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center">
          <View className="h-1.5 w-10 rounded-full bg-gray-200" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-base text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Clear
            </Text>
          </TouchableOpacity>
          <Text className="text-xl text-black" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Amenities
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Amenities Content */}
        <View className="flex-1">
          <View className="px-6 py-4">
            <View className="flex-row flex-wrap gap-3">
              {amenitiesList.map((amenity) => {
                const IconComponent = amenity.icon;
                const isSelected = selectedAmenities.includes(amenity.id);

                return (
                  <TouchableOpacity
                    key={amenity.id}
                    className={`flex-row items-center px-4 py-3 rounded-full border ${isSelected
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300'
                      }`}
                    onPress={() => toggleAmenity(amenity.id)}
                  >
                    <IconComponent
                      size={16}
                      color={isSelected ? 'white' : '#6B7280'}
                    />
                    <Text
                      className={`text-sm ml-2 ${isSelected ? 'text-white' : 'text-gray-700'}`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      {amenity.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Apply Button */}
          <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <TouchableOpacity
              onPress={handleApply}
              className="w-full h-12 bg-black rounded-lg items-center justify-center"
            >
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Apply ({selectedAmenities.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
