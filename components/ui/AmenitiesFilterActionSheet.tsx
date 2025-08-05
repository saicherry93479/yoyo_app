import React, { useEffect, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Wifi, Waves, Car, Tv, ChefHat, WashingMachine, Wind, Flame, Dumbbell, Microwave, Refrigerator, Coffee, Wine, Armchair, UtensilsCrossed, Shield, TriangleAlert as AlertTriangle, Plus, Sun, Lock, X, Utensils, CheckSquare, Square } from 'lucide-react-native';

interface AmenitiesFilterActionSheetProps {
  sheetId: string;
  payload?: {
    currentAmenities: string[];
    availableAmenities: string[]; // All unique amenities from hotels
    onAmenitiesSelect: (amenities: string[]) => void;
  };
}

// Icon mapping for common amenities
const amenityIconMap: { [key: string]: any } = {
  'wifi': Wifi,
  'free wifi': Wifi,
  'parking': Car,
  'free parking': Car,
  'restaurant': Utensils,
  'pool': Waves,
  'swimming pool': Waves,
  'gym': Dumbbell,
  'fitness center': Dumbbell,
  'fitness centre': Dumbbell,
  'spa': ChefHat,
  'tv': Tv,
  'television': Tv,
  'air conditioning': Wind,
  'ac': Wind,
  'laundry': WashingMachine,
  'heating': Flame,
  'microwave': Microwave,
  'refrigerator': Refrigerator,
  'fridge': Refrigerator,
  'coffee': Coffee,
  'bar': Wine,
  'lounge': Armchair,
  'room service': UtensilsCrossed,
  'security': Shield,
  'terrace': Sun,
  'balcony': Sun,
  'safe': Lock,
};

const getAmenityIcon = (amenityName: string) => {
  const normalizedName = amenityName.toLowerCase().trim();
  
  // Try exact match first
  if (amenityIconMap[normalizedName]) {
    return amenityIconMap[normalizedName];
  }
  
  // Try partial matches
  for (const key in amenityIconMap) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return amenityIconMap[key];
    }
  }
  
  // Default icon for unknown amenities
  return Plus;
};

const renderAmenityItem = (amenity: string, isSelected: boolean, onToggle: () => void) => {
  const IconComponent = getAmenityIcon(amenity);

  return (
    <TouchableOpacity 
      key={amenity} 
      className={`flex-row items-center justify-between p-4 border rounded-lg ${
        isSelected ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
      }`}
      onPress={onToggle}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <IconComponent 
          size={20} 
          color={isSelected ? "#000" : "#8A8A8A"} 
          strokeWidth={2} 
        />
        <Text 
          className={`text-base ${isSelected ? 'text-black' : 'text-gray-700'}`}
          style={{ fontFamily: 'PlusJakartaSans-Medium' }}
          numberOfLines={1}
        >
          {amenity}
        </Text>
      </View>
      
      {/* Checkbox */}
      <View className="ml-2">
        {isSelected ? (
          <CheckSquare size={20} color="#000" />
        ) : (
          <Square size={20} color="#8A8A8A" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export function AmenitiesFilterActionSheet({ sheetId, payload }: AmenitiesFilterActionSheetProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(payload?.currentAmenities || []);
  const availableAmenities = payload?.availableAmenities || [];
 
  useEffect(() => {
    console.log('selectedAmenities', selectedAmenities);
  }, [selectedAmenities]);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApply = () => {
    payload?.onAmenitiesSelect(selectedAmenities);
    handleClose();
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(item => item !== amenity)
        : [...prev, amenity]
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
    >
      <View className="rounded-t-2xl bg-white pt-3 h-[80%]">
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
          {availableAmenities.length > 0 ? (
            <FlatList
              data={availableAmenities}
              keyExtractor={(item, index) => `${item}_${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                paddingBottom: 100, // Space for apply button
              }}
              renderItem={({ item }) => (
                <View className="mb-3">
                  {renderAmenityItem(
                    item, 
                    selectedAmenities.includes(item), 
                    () => toggleAmenity(item)
                  )}
                </View>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-lg text-gray-500 text-center mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                No amenities available
              </Text>
              <Text className="text-sm text-gray-400 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Amenities will appear here based on your search results
              </Text>
            </View>
          )}

          {/* Apply Button - Fixed at bottom */}
          <View className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-white">
            <TouchableOpacity
              onPress={handleApply}
              className="w-full h-12 bg-black rounded-lg items-center justify-center"
              disabled={availableAmenities.length === 0}
            >
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Apply {selectedAmenities.length > 0 ? `(${selectedAmenities.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}