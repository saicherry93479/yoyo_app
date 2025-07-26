
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Wifi, Waves, Car, Tv, ChefHat, WashingMachine, Wind, Flame, Dumbbell, Microwave, Refrigerator, Coffee, Wine, Armchair, UtensilsCrossed, Shield, TriangleAlert as AlertTriangle, Plus, Sun, Lock, X, Utensils } from 'lucide-react-native';

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
  { id: 'spa', label: 'Spa', icon: ChefHat },
];

const renderAmenityItem = (amenity) => {
  const IconComponent = amenity.icon;

  return (
    <View key={amenity.id} className="flex-row items-center gap-4 py-3">
      <IconComponent size={24} color="#8A8A8A" strokeWidth={2} />
      <Text className="text-base text-black " style={{ fontFamily: 'PlusJakartaSans-Medium' }}>{amenity.name}</Text>
    </View>
  );
};

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
      // gestureEnabled={true}
      closable={true}
      closeOnTouchBackdrop={true}
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
          <FlatList
            data={amenitiesList}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 16,
              paddingBottom: 20,
              paddingHorizontal: 16,

            }}
            renderItem={({ item }) => (
              <View className="w-[48%] mb-4 mr-[4%]">
                {renderAmenityItem(item)}
              </View>
            )}
            columnWrapperStyle={{
              justifyContent: 'space-between'
            }}
          />

          {/* Apply Button */}
          {/* <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <TouchableOpacity
              onPress={handleApply}
              className="w-full h-12 bg-black rounded-lg items-center justify-center"
            >
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Apply ({selectedAmenities.length})
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </ActionSheet>
  );
}
