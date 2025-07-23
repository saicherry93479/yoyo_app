
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { DateRangePicker } from './DateRangePicker';
import { GuestSelector } from './GuestSelector';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
}

interface EditStayData {
  guests: GuestCounts;
  checkIn: string;
  checkOut: string;
}

interface EditStayActionSheetProps {
  sheetId: string;
  payload?: {
    searchData?: EditStayData;
    onSearch?: (newSearchData: EditStayData) => void;
  };
}

export function EditStayActionSheet({ sheetId, payload }: EditStayActionSheetProps) {
  const initialData = payload?.searchData || {
    guests: { adults: 2, children: 0, infants: 0 },
    checkIn: new Date(Date.now() + 24*60*60*1000).toISOString(),
    checkOut: new Date(Date.now() + 3*24*60*60*1000).toISOString()
  };

  const [searchData, setSearchData] = useState<EditStayData>(initialData);

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApply = () => {
    if (payload?.onSearch) {
      payload.onSearch(searchData);
    }
    handleClose();
  };

  const handleDateRangeSelect = (dateRange: DateRange) => {
    if (dateRange.startDate && dateRange.endDate) {
      setSearchData(prev => ({
        ...prev,
        checkIn: dateRange.startDate!,
        checkOut: dateRange.endDate!
      }));
    }
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  };

  const isApplyEnabled = searchData.checkIn && searchData.checkOut;

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
            Edit Stay
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="px-6 pb-6">
          {/* When */}
          <View className="mb-6">
            <Text 
              className="text-sm text-gray-900 mb-3" 
              style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
            >
              When
            </Text>
            <DateRangePicker
              value={{
                startDate: searchData.checkIn,
                endDate: searchData.checkOut
              }}
              onDateRangeSelect={handleDateRangeSelect}
              placeholder="Check-in - Check-out"
            />
          </View>

          {/* Who */}
          <View className="mb-6">
            <Text 
              className="text-sm text-gray-900 mb-3" 
              style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
            >
              Who
            </Text>
            <GuestSelector
              value={searchData.guests}
              onGuestCountChange={handleGuestCountChange}
              placeholder="1 guest"
            />
          </View>
        </View>

        {/* Footer with Apply Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <TouchableOpacity 
            onPress={handleApply}
            className={`flex h-12 w-full items-center justify-center rounded-lg ${
              isApplyEnabled ? 'bg-[#171717]' : 'bg-gray-300'
            }`}
            disabled={!isApplyEnabled}
          >
            <Text 
              className={`text-base ${
                isApplyEnabled ? 'text-white' : 'text-gray-500'
              }`}
              style={{ fontFamily: 'PlusJakartaSans-Bold' }}
            >
              Apply Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}
