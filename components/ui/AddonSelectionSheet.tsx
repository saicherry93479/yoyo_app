import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { X, Plus, Minus, Check } from 'lucide-react-native';

interface Addon {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: string;
}

interface SelectedAddon extends Addon {
  quantity: number;
}

interface AddonSelectionSheetProps {
  sheetId: string;
  payload?: {
    addons: Addon[];
    selectedAddons: SelectedAddon[];
    onAddonsChange: (addons: SelectedAddon[]) => void;
  };
}

export function AddonSelectionSheet({ sheetId, payload }: AddonSelectionSheetProps) {
  const { addons = [], selectedAddons: initialSelected = [], onAddonsChange } = payload || {};
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>(initialSelected);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApply = () => {
    onAddonsChange?.(selectedAddons);
    handleClose();
  };

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(item => item.id === addon.id);
      
      if (existingIndex >= 0) {
        // Remove addon if already selected
        return prev.filter(item => item.id !== addon.id);
      } else {
        // Add addon with quantity 1
        return [...prev, { ...addon, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (addonId: string, increment: boolean) => {
    setSelectedAddons(prev => 
      prev.map(addon => {
        if (addon.id === addonId) {
          const newQuantity = increment ? addon.quantity + 1 : Math.max(1, addon.quantity - 1);
          return { ...addon, quantity: newQuantity };
        }
        return addon;
      })
    );
  };

  const isAddonSelected = (addonId: string) => {
    return selectedAddons.some(addon => addon.id === addonId);
  };

  const getAddonQuantity = (addonId: string) => {
    const addon = selectedAddons.find(addon => addon.id === addonId);
    return addon?.quantity || 0;
  };

  const calculateTotal = () => {
    return selectedAddons.reduce((total, addon) => total + (addon.price * addon.quantity), 0);
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
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Select Add-ons
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Addons List */}
        <ScrollView 
          className="max-h-96 px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4 pb-6">
            {addons.map((addon) => {
              const isSelected = isAddonSelected(addon.id);
              const quantity = getAddonQuantity(addon.id);
              
              return (
                <View key={addon.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <View className="flex-row gap-4 p-4">
                    <Image
                      source={{ uri: addon.image }}
                      className="w-20 h-20 rounded-lg"
                      style={{ resizeMode: 'cover' }}
                    />
                    <View className="flex-1">
                      <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        {addon.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                        {addon.description}
                      </Text>
                      <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        ₹{addon.price}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="px-4 pb-4">
                    {!isSelected ? (
                      <TouchableOpacity
                        onPress={() => handleAddonToggle(addon)}
                        className="flex-row items-center justify-center gap-2 bg-gray-100 rounded-lg py-3"
                      >
                        <Plus size={16} color="#374151" />
                        <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                          Add to booking
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                          <Check size={16} color="#059669" />
                          <Text className="text-green-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                            Added
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity
                            onPress={() => handleQuantityChange(addon.id, false)}
                            className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center"
                            disabled={quantity <= 1}
                          >
                            <Minus size={16} color={quantity <= 1 ? "#d1d5db" : "#374151"} />
                          </TouchableOpacity>
                          
                          <Text className="text-base text-gray-900 w-8 text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            {quantity}
                          </Text>
                          
                          <TouchableOpacity
                            onPress={() => handleQuantityChange(addon.id, true)}
                            className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center"
                          >
                            <Plus size={16} color="#374151" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => handleAddonToggle(addon)}
                            className="ml-2 px-3 py-2 bg-red-100 rounded-lg"
                          >
                            <Text className="text-red-600 text-sm" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                              Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Selected Summary */}
        {selectedAddons.length > 0 && (
          <View className="px-6 py-4 bg-blue-50 border-t border-blue-200">
            <Text className="text-base text-blue-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Selected Add-ons ({selectedAddons.length})
            </Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-blue-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Total per night
              </Text>
              <Text className="text-lg text-blue-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                ₹{calculateTotal().toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View className="px-6 py-4 border-t border-gray-200">
          <TouchableOpacity 
            onPress={handleApply}
            className="w-full h-12 bg-[#FF5A5F] rounded-lg items-center justify-center"
          >
            <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Apply Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}