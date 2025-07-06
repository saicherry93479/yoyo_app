import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Wifi, Waves, Car, Tv, ChefHat, WashingMachine, Wind, Flame, Dumbbell, Microwave, Refrigerator, Coffee, Wine, Armchair, UtensilsCrossed, Shield, TriangleAlert as AlertTriangle, Plus, Sun, Lock, X } from 'lucide-react-native';

interface Amenity {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const amenities: Amenity[] = [
  { id: 'wifi', name: 'Wifi', icon: Wifi },
  { id: 'pool', name: 'Pool', icon: Waves },
  { id: 'parking', name: 'Parking', icon: Car },
  { id: 'tv', name: 'TV', icon: Tv },
  { id: 'kitchen', name: 'Kitchen', icon: ChefHat },
  { id: 'washer', name: 'Washer', icon: WashingMachine },
  { id: 'ac', name: 'Air conditioning', icon: Wind },
  { id: 'fireplace', name: 'Fireplace', icon: Flame },
  { id: 'gym', name: 'Gym', icon: Dumbbell },
  { id: 'stove', name: 'Stove', icon: ChefHat },
  { id: 'oven', name: 'Oven', icon: ChefHat },
  { id: 'microwave', name: 'Microwave', icon: Microwave },
  { id: 'refrigerator', name: 'Refrigerator', icon: Refrigerator },
  { id: 'coffee', name: 'Coffee maker', icon: Coffee },
  { id: 'wine', name: 'Wine glasses', icon: Wine },
  { id: 'outdoor', name: 'Outdoor seating', icon: Sun },
  { id: 'sofa', name: 'Sofa', icon: Armchair },
  { id: 'dining', name: 'Dining table', icon: UtensilsCrossed },
  { id: 'smoke', name: 'Smoke alarm', icon: Shield },
  { id: 'fire', name: 'Fire alarm', icon: AlertTriangle },
  { id: 'carbon', name: 'Carbon monoxide alarm', icon: AlertTriangle },
  { id: 'firstaid', name: 'First aid kit', icon: Plus },
  { id: 'extinguisher', name: 'Fire extinguisher', icon: AlertTriangle },
  { id: 'lock', name: 'Lock on bedroom door', icon: Lock },
];

interface AmenitiesActionSheetProps {
  sheetId: string;
}

export function AmenitiesActionSheet({ sheetId }: AmenitiesActionSheetProps) {
  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const renderAmenityItem = (amenity: Amenity) => {
    const IconComponent = amenity.icon;
    
    return (
      <View key={amenity.id} className="flex-row items-center gap-4">
        <IconComponent size={24} color="#1F2937" strokeWidth={2} />
        <Text className="text-base font-medium text-gray-700">{amenity.name}</Text>
      </View>
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
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-2xl font-bold text-gray-900">What this place offers</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Amenities Grid */}
        <ScrollView 
          className=" px-4"
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 500 }}
        >
          <View className="grid grid-cols-2 gap-x-4 gap-y-6 pb-6">
            {amenities.map((amenity, index) => (
              <View 
                key={amenity.id}
                className={`${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}
              >
                {renderAmenityItem(amenity)}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Close Button */}
        <View className="mt-4 border-t border-gray-200 bg-white px-4 py-3">
          <TouchableOpacity 
            onPress={handleClose}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#FF5A5F]"
          >
            <Text className="text-base font-bold text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}