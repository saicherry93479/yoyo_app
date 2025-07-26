
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface PriceFilterActionSheetProps {
  sheetId: string;
  payload?: {
    currentPriceRange: { min: number; max: number } | undefined;
    onPriceSelect: (priceRange: { min: number; max: number }) => void;
  };
}

const priceRanges = [
  { label: 'Any Price', min: 0, max: 999999 },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { label: 'Above ₹20,000', min: 20000, max: 999999 },
];

export function PriceFilterActionSheet({ sheetId, payload }: PriceFilterActionSheetProps) {
  const [selectedRange, setSelectedRange] = useState(payload?.currentPriceRange);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handlePriceSelect = (min: number, max: number) => {
    const priceRange = { min, max };
    setSelectedRange(priceRange);
    payload?.onPriceSelect(priceRange);
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
      snapPoints={[60]}
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
            Price Range
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Price Options */}
        <View className="px-6 py-4">
          <View className="gap-2">
            {priceRanges.map((range, index) => {
              const isSelected = selectedRange &&
                selectedRange.min === range.min &&
                selectedRange.max === range.max;

              return (
                <TouchableOpacity
                  key={index}
                  className={`p-4 rounded-lg border ${isSelected
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200'
                    }`}
                  onPress={() => handlePriceSelect(range.min, range.max)}
                >
                  <Text
                    className={`text-base ${isSelected
                      ? 'text-black'
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
      </View>
    </ActionSheet>
  );
}
