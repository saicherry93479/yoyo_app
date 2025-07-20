import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileSliders as Sliders, Star, Wifi, Car, Utensils, Waves, Dumbbell, Space as Spa } from 'lucide-react-native';

interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  amenities: string[];
  propertyType: string[];
  sortBy: string;
}

interface FiltersActionSheetProps {
  sheetId: string;
  payload?: {
    currentFilters: FilterOptions;
    onApplyFilters: (filters: FilterOptions) => void;
  };
}

const priceRanges = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: 999999 },
];

const amenitiesList = [
  { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
  { id: 'spa', label: 'Spa', icon: Spa },
];

const propertyTypes = [
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Business Hotel',
  'Luxury Hotel',
  'Budget Hotel'
];

const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'distance', label: 'Distance' },
];

const defaultFilters: FilterOptions = {
  priceRange: { min: 0, max: 999999 },
  rating: 0,
  amenities: [],
  propertyType: [],
  sortBy: 'recommended'
};

export function FiltersActionSheet({ sheetId, payload }: FiltersActionSheetProps) {
  // Ensure we always have a complete FilterOptions object
  const initialFilters = payload?.currentFilters
    ? {
      priceRange: payload.currentFilters.priceRange || defaultFilters.priceRange,
      rating: payload.currentFilters.rating || defaultFilters.rating,
      amenities: payload.currentFilters.amenities || defaultFilters.amenities,
      propertyType: payload.currentFilters.propertyType || defaultFilters.propertyType,
      sortBy: payload.currentFilters.sortBy || defaultFilters.sortBy
    }
    : defaultFilters;

  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  console.log('payload ', payload);
  console.log('initial filters ', initialFilters);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApplyFilters = () => {
    payload?.onApplyFilters(filters);
    handleClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = { ...defaultFilters };
    setFilters(clearedFilters);
  };

  const toggleAmenity = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type]
    }));
  };

  const selectPriceRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const selectRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const renderStars = (count: number, selected: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < selected ? '#FCD34D' : '#D1D5DB'}
        fill={i < selected ? '#FCD34D' : '#D1D5DB'}
      />
    ));
  };

  return (
    <ActionSheet
      id={sheetId}
      // isModal={false}
      // backgroundInteractionEnabled
      // snapPoints={[80]}
      // gestureEnabled={false}
      // closable={true}
      // closeOnTouchBackdrop={true}
      // disableDragBeyondMinimumSnapPoint
      // containerStyle={{
      //   borderWidth: 1,
      //   borderColor: '#f0f0f0',
      // }}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      // gestureEnabled={true}
      closable={true}
      closeOnTouchBackdrop={true}
      snapPoints={[80]}
    >
      <View className="rounded-t-2xl bg-white pt-3 " >
        {/* Handle */}
        <View>
          <View className="flex h-5 w-full items-center justify-center">
            <View className="h-1.5 w-10 rounded-full bg-gray-200" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <TouchableOpacity onPress={handleClearFilters}>
              <Text className="text-base text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Clear all
              </Text>
            </TouchableOpacity>
            <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Filters
            </Text>
            <TouchableOpacity onPress={handleClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters Content - Fixed scrolling */}
        <View className=" flex-col justify-between h-[80%]">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >

            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Sort by
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className={`px-4 py-2 rounded-full border ${filters.sortBy === option.id
                      ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                      : 'bg-white border-gray-300'
                      }`}
                    onPress={() => setFilters(prev => ({ ...prev, sortBy: option.id }))}
                  >
                    <Text
                      className={`text-sm ${filters.sortBy === option.id ? 'text-white' : 'text-gray-700'
                        }`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Price range
              </Text>
              <View className="gap-2">
                {priceRanges.map((range, index) => {
                  // Safe comparison with proper null checks
                  const isSelected = filters.priceRange &&
                    filters.priceRange.min === range.min &&
                    filters.priceRange.max === range.max;

                  return (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 rounded-lg border ${isSelected
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200'
                        }`}
                      onPress={() => selectPriceRange(range.min, range.max)}
                    >
                      <Text
                        className={`text-base ${isSelected
                          ? 'text-red-700'
                          : 'text-gray-700'
                          }`}
                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>


            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Minimum rating
              </Text>
              <View className="gap-2">
                {[4, 3, 2, 1].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    className={`flex-row items-center p-3 rounded-lg border ${filters.rating === rating
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                      }`}
                    onPress={() => selectRating(rating)}
                  >
                    <View className="flex-row mr-2">
                      {renderStars(5, rating)}
                    </View>
                    <Text
                      className={`text-base ${filters.rating === rating ? 'text-red-700' : 'text-gray-700'
                        }`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      {rating}+ stars
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Amenities
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {amenitiesList.map((amenity) => {
                  const IconComponent = amenity.icon;
                  const isSelected = filters.amenities.includes(amenity.id);

                  return (
                    <TouchableOpacity
                      key={amenity.id}
                      className={`flex-row items-center px-3 py-2 rounded-full border ${isSelected
                        ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                        : 'bg-white border-gray-300'
                        }`}
                      onPress={() => toggleAmenity(amenity.id)}
                    >
                      <IconComponent
                        size={16}
                        color={isSelected ? 'white' : '#6B7280'}
                      />
                      <Text
                        className={`text-sm ml-2 ${isSelected ? 'text-white' : 'text-gray-700'
                          }`}
                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                      >
                        {amenity.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>


            {/* <View className="px-6 py-4">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Property type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-2 rounded-full border ${filters.propertyType.includes(type)
                      ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                      : 'bg-white border-gray-300'
                      }`}
                    onPress={() => togglePropertyType(type)}
                  >
                    <Text
                      className={`text-sm ${filters.propertyType.includes(type) ? 'text-white' : 'text-gray-700'
                        }`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
          </ScrollView>

          <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="w-full h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
            >
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}