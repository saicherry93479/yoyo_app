import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Users, Plus, Minus, X } from 'lucide-react-native';

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
}

interface GuestSelectorProps {
  value: GuestCounts;
  onGuestCountChange: (guests: GuestCounts) => void;
  placeholder?: string;
}

export function GuestSelector({ value, onGuestCountChange, placeholder = "Add guests" }: GuestSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [guestCounts, setGuestCounts] = useState<GuestCounts>(value);

  const getTotalGuests = () => {
    return guestCounts.adults + guestCounts.children;
  };

  const getDisplayText = () => {
    const total = getTotalGuests();
    if (total === 0) return placeholder;
    
    let text = `${total} guest${total > 1 ? 's' : ''}`;
    if (guestCounts.infants > 0) {
      text += `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? 's' : ''}`;
    }
    return text;
  };

  const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
    setGuestCounts(prev => {
      const newCounts = { ...prev };
      
      if (increment) {
        newCounts[type] += 1;
      } else {
        newCounts[type] = Math.max(0, newCounts[type] - 1);
      }
      
      // Ensure at least 1 adult
      if (type === 'adults' && newCounts.adults === 0) {
        newCounts.adults = 1;
      }
      
      return newCounts;
    });
  };

  const handleConfirm = () => {
    onGuestCountChange(guestCounts);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    const clearedCounts = { adults: 1, children: 0, infants: 0 };
    setGuestCounts(clearedCounts);
    onGuestCountChange(clearedCounts);
  };

  const GuestRow = ({ 
    title, 
    description, 
    count, 
    onIncrement, 
    onDecrement, 
    minValue = 0 
  }: {
    title: string;
    description: string;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    minValue?: number;
  }) => (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1">
        <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
          {title}
        </Text>
        <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {description}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          className={`w-8 h-8 rounded-full border items-center justify-center ${
            count <= minValue 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 bg-white active:bg-gray-50'
          }`}
          onPress={onDecrement}
          disabled={count <= minValue}
        >
          <Minus 
            size={16} 
            color={count <= minValue ? '#D1D5DB' : '#6B7280'} 
          />
        </TouchableOpacity>
        
        <Text className="text-base text-gray-900 w-8 text-center" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
          {count}
        </Text>
        
        <TouchableOpacity
          className="w-8 h-8 rounded-full border border-gray-300 bg-white items-center justify-center active:bg-gray-50"
          onPress={onIncrement}
        >
          <Plus size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
          <Users size={20} color="#94A3B8" />
        </View>
        <View className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 justify-center">
          <Text 
            className={`text-base ${getTotalGuests() > 0 ? 'text-slate-900' : 'text-slate-400'}`}
            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          >
            {getDisplayText()}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={handleClear}>
              <Text className="text-base text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Clear
              </Text>
            </TouchableOpacity>
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Who's coming?
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Guest Selection */}
          <View className="flex-1 px-4">
            <GuestRow
              title="Adults"
              description="Ages 13 or above"
              count={guestCounts.adults}
              onIncrement={() => updateGuestCount('adults', true)}
              onDecrement={() => updateGuestCount('adults', false)}
              minValue={1}
            />
            
            <View className="h-px bg-gray-200" />
            
            <GuestRow
              title="Children"
              description="Ages 2-12"
              count={guestCounts.children}
              onIncrement={() => updateGuestCount('children', true)}
              onDecrement={() => updateGuestCount('children', false)}
            />
            
            <View className="h-px bg-gray-200" />
            
            <GuestRow
              title="Infants"
              description="Under 2"
              count={guestCounts.infants}
              onIncrement={() => updateGuestCount('infants', true)}
              onDecrement={() => updateGuestCount('infants', false)}
            />
          </View>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              className="w-full h-12 rounded-lg bg-[#FF5A5F] items-center justify-center"
              onPress={handleConfirm}
            >
              <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Confirm guests
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}