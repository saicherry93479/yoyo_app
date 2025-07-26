
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Star } from 'lucide-react-native';

interface RatingFilterActionSheetProps {
  sheetId: string;
  payload?: {
    currentRating: number;
    onRatingSelect: (rating: number) => void;
  };
}

export function RatingFilterActionSheet({ sheetId, payload }: RatingFilterActionSheetProps) {
  const [selectedRating, setSelectedRating] = useState(payload?.currentRating || 0);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleRatingSelect = (rating: number) => {
    const newRating = selectedRating === rating ? 0 : rating;
    setSelectedRating(newRating);
    payload?.onRatingSelect(newRating);
    handleClose();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < rating ? '#FCD34D' : '#D1D5DB'}
        fill={i < rating ? '#FCD34D' : '#D1D5DB'}
      />
    ));
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
            Minimum Rating
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Rating Options */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className={`p-4 rounded-lg border mb-3 ${selectedRating === 0
              ? 'bg-gray-50 border-gray-300'
              : 'bg-white border-gray-200'
              }`}
            onPress={() => handleRatingSelect(0)}
          >
            <Text
              className={`text-base ${selectedRating === 0 ? 'text-black' : 'text-gray-700'}`}
              style={{ fontFamily: 'PlusJakartaSans-Medium' }}
            >
              Any Rating
            </Text>
          </TouchableOpacity>

          <View className="gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                className={`flex-row items-center p-4 rounded-lg border ${selectedRating === rating
                  ? 'bg-gray-50 border-gray-300'
                  : 'bg-white border-gray-200'
                  }`}
                onPress={() => handleRatingSelect(rating)}
              >
                <View className="flex-row mr-3">
                  {renderStars(rating)}
                </View>
                <Text
                  className={`text-base ${selectedRating === rating ? 'text-black' : 'text-gray-700'}`}
                  style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                  {rating}+ stars
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
