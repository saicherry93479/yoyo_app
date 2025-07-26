
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface SortActionSheetProps {
  sheetId: string;
  payload?: {
    currentSort: string;
    onSortSelect: (sortBy: string) => void;
  };
}

const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'distance', label: 'Distance' },
];

export function SortActionSheet({ sheetId, payload }: SortActionSheetProps) {
  const [selectedSort, setSelectedSort] = useState(payload?.currentSort || 'recommended');

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleSortSelect = (sortBy: string) => {
    setSelectedSort(sortBy);
    payload?.onSortSelect(sortBy);
    handleClose();
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
      snapPoints={[50]}
    >
      <View className="rounded-t-2xl bg-white pt-3">
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center">
          <View className="h-1.5 w-10 rounded-full bg-gray-200" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <View className="w-6" />
          <Text className="text-xl text-black" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Sort by
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        <View className="px-6 py-4">
          <View className="gap-4">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row items-center justify-between py-3"
                onPress={() => handleSortSelect(option.id)}
              >
                <Text
                  className="text-base text-gray-900"
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <Check size={20} color="#000000" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
