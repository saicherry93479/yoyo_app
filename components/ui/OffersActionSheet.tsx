
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { X, Tag, Percent } from 'lucide-react-native';

interface Offer {
  id: string;
  name: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  code: string;
  validUntil?: string;
}

interface OffersActionSheetProps extends SheetProps {
  payload?: {
    currentOffers?: string[];
    onOffersSelect?: (offers: string[]) => void;
  };
}

const availableOffers: Offer[] = [
  {
    id: '1',
    name: 'save70',
    title: 'Save 70% Off',
    description: 'Get 70% discount on your booking',
    discountType: 'percentage',
    discountValue: 70,
    code: 'SAVE70',
    validUntil: '2024-12-31'
  },
  {
    id: '2', 
    name: 'welcome50',
    title: 'Welcome Offer',
    description: 'New user special - 50% off first booking',
    discountType: 'percentage',
    discountValue: 50,
    code: 'WELCOME50'
  },
  {
    id: '3',
    name: 'flat1000',
    title: 'Flat ₹1000 Off',
    description: 'Instant discount of ₹1000 on bookings above ₹5000',
    discountType: 'fixed',
    discountValue: 1000,
    code: 'FLAT1000'
  },
  {
    id: '4',
    name: 'weekend25',
    title: 'Weekend Special',
    description: '25% off on weekend bookings',
    discountType: 'percentage',
    discountValue: 25,
    code: 'WEEKEND25'
  },
  {
    id: '5',
    name: 'earlybird',
    title: 'Early Bird Discount',
    description: '30% off for advance bookings',
    discountType: 'percentage',
    discountValue: 30,
    code: 'EARLYBIRD'
  }
];

export default function OffersActionSheet({ sheetId, payload }: OffersActionSheetProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>(payload?.currentOffers || []);

  const handleOfferToggle = (offerName: string) => {
    setSelectedOffers(prev => {
      if (prev.includes(offerName)) {
        return prev.filter(name => name !== offerName);
      } else {
        return [...prev, offerName];
      }
    });
  };

  const handleApply = () => {
    payload?.onOffersSelect?.(selectedOffers);
  };

  const handleClear = () => {
    setSelectedOffers([]);
  };

  return (
    <ActionSheet id={sheetId} snapPoints={[80]} useBottomSafeAreaPadding>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={handleClear}>
            <Text 
              className="text-gray-600" 
              style={{ fontFamily: 'PlusJakartaSans-Medium' }}
            >
              Clear
            </Text>
          </TouchableOpacity>
          <Text 
            className="text-xl text-gray-900" 
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
          >
            Offers & Deals
          </Text>
          <TouchableOpacity onPress={() => payload?.onOffersSelect?.(selectedOffers)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Offers List */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="py-4">
            <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Available Offers
            </Text>
            <Text className="text-gray-600 mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Select offers to apply to your search results
            </Text>

            <View className="space-y-4">
              {availableOffers.map((offer) => {
                const isSelected = selectedOffers.includes(offer.name);
                
                return (
                  <TouchableOpacity
                    key={offer.id}
                    className={`p-4 rounded-2xl border-2 ${
                      isSelected 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                    onPress={() => handleOfferToggle(offer.name)}
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                          isSelected ? 'bg-black' : 'bg-gray-100'
                        }`}>
                          {offer.discountType === 'percentage' ? (
                            <Percent size={18} color={isSelected ? 'white' : '#6B7280'} />
                          ) : (
                            <Tag size={18} color={isSelected ? 'white' : '#6B7280'} />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text 
                            className={`text-lg mb-1 ${isSelected ? 'text-black' : 'text-gray-900'}`}
                            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                          >
                            {offer.title}
                          </Text>
                          <Text 
                            className="text-gray-600 text-sm mb-2" 
                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                          >
                            {offer.description}
                          </Text>
                          <View className="flex-row items-center">
                            <View className="bg-gray-100 px-2 py-1 rounded">
                              <Text 
                                className="text-xs text-gray-700" 
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                              >
                                {offer.code}
                              </Text>
                            </View>
                            {offer.validUntil && (
                              <Text 
                                className="text-xs text-gray-500 ml-2" 
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                              >
                                Valid till {new Date(offer.validUntil).toLocaleDateString()}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        isSelected ? 'bg-black border-black' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <View className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-6 py-4 border-t border-gray-100">
          <TouchableOpacity
            className="w-full bg-black py-4 rounded-2xl items-center"
            onPress={handleApply}
          >
            <Text 
              className="text-white text-lg" 
              style={{ fontFamily: 'PlusJakartaSans-Bold' }}
            >
              Apply {selectedOffers.length > 0 ? `(${selectedOffers.length})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}
