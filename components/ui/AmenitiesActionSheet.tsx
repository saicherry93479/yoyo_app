import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
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
  payload?: {
    amenities?: string[];
  };
}

export function AmenitiesActionSheet({ sheetId, payload }: AmenitiesActionSheetProps) {
  const hotelAmenities = payload?.amenities || [];

  // Helper function to get amenity display info
  const getAmenityDisplayInfo = (amenityCode: string) => {
    const amenityMap: Record<string, { name: string; icon: React.ComponentType<any> }> = {
      'business_center': { name: 'Business Center', icon: Shield },
      'parking': { name: 'Parking', icon: Car },
      'restaurant': { name: 'Restaurant', icon: UtensilsCrossed },
      'wifi': { name: 'Free Wi-Fi', icon: Wifi },
      'pool': { name: 'Swimming Pool', icon: Waves },
      'gym': { name: 'Fitness Center', icon: Dumbbell },
      'spa': { name: 'Spa', icon: Wind },
      'room_service': { name: 'Room Service', icon: Coffee },
      'laundry': { name: 'Laundry', icon: WashingMachine },
      'concierge': { name: 'Concierge', icon: Shield },
      'tv': { name: 'Television', icon: Tv },
      'kitchen': { name: 'Kitchen', icon: ChefHat },
      'ac': { name: 'Air Conditioning', icon: Wind },
      'fireplace': { name: 'Fireplace', icon: Flame },
      'microwave': { name: 'Microwave', icon: Microwave },
      'refrigerator': { name: 'Refrigerator', icon: Refrigerator },
      'coffee': { name: 'Coffee Maker', icon: Coffee },
      'outdoor': { name: 'Outdoor Seating', icon: Sun },
      'smoke': { name: 'Smoke Alarm', icon: Shield },
      'fire': { name: 'Fire Alarm', icon: AlertTriangle },
      'lock': { name: 'Secure Lock', icon: Lock }
    };
    
    return amenityMap[amenityCode.toLowerCase()] || { 
      name: amenityCode.charAt(0).toUpperCase() + amenityCode.slice(1).replace(/_/g, ' '), 
      icon: Plus 
    };
  };
  
  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  // Get amenities to display - prioritize hotel amenities, fall back to all amenities
  const amenitiesToShow = hotelAmenities.length > 0 
    ? hotelAmenities.map((code, index) => {
        const info = getAmenityDisplayInfo(code);
        return {
          id: `${code}_${index}`, // Ensure unique keys
          name: info.name,
          icon: info.icon
        };
      })
    : amenities;

  const renderAmenityItem = (amenity: Amenity) => {
    const IconComponent = amenity.icon;
    
    return (
      <View key={amenity.id} className="flex-row items-center gap-4 py-3">
        <IconComponent size={24} color="#8A8A8A" strokeWidth={2} />
        <Text className="text-base text-black " style={{ fontFamily: 'PlusJakartaSans-Medium' }}>{amenity.name}</Text>
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
    // gestureEnabled={true}
    closable={true}
    closeOnTouchBackdrop={true}
  >
    <View className="rounded-t-2xl bg-white  pt-3 ">
      
      {/* Handle */}
      <View className="flex h-5 w-full items-center justify-center">
        <View className="h-1.5 w-10 rounded-full bg-gray-200" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 ">
        <Text className="text-2xl text-black " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          What this place offers
        </Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <X size={24} color="#8A8A8A" />
        </TouchableOpacity>
      </View>

      {/* Amenities List using FlatList */}
      <FlatList
        data={amenitiesToShow}
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

      {/* Close Button */}
      {/* <View className="border-t border-gray-200 bg-white px-4 py-4 sticky botttom-0">
        <TouchableOpacity 
          onPress={handleClose}
          className="flex h-12 w-full items-center justify-center rounded-full bg-black"
        >
          <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Close
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  </ActionSheet>
  );
}