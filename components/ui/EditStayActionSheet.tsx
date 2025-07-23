
import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { DateRangePicker } from './DateRangePicker';
import { TimeRangePicker } from './TimeRangePicker';
import { GuestSelector } from './GuestSelector';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface TimeRange {
  startTime: string | null;
  endTime: string | null;
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
  timeRange: TimeRange;
  bookingType: 'daily' | 'hourly';
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
    checkOut: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
    timeRange: { startTime: null, endTime: null },
    bookingType: 'daily'
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

  const handleTimeRangeSelect = (timeRange: TimeRange) => {
    setSearchData(prev => ({ ...prev, timeRange }));
  };

  const handleBookingTypeChange = (bookingType: 'daily' | 'hourly') => {
    setSearchData(prev => ({ ...prev, bookingType }));
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  };

  const isApplyEnabled = searchData.bookingType === 'daily' 
    ? (searchData.checkIn && searchData.checkOut)
    : (searchData.timeRange.startTime && searchData.timeRange.endTime);

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
          {/* Booking Type Tabs */}
          <View className="mb-6">
            <View className="flex-row bg-gray-100 rounded-lg p-1">
              <TouchableOpacity
                className={`flex-1 py-2 rounded-md items-center ${
                  searchData.bookingType === 'daily' ? 'bg-white shadow-sm' : ''
                }`}
                onPress={() => handleBookingTypeChange('daily')}
              >
                <Text className={`text-sm ${searchData.bookingType === 'daily' ? 'text-gray-900' : 'text-gray-600'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded-md items-center ${
                  searchData.bookingType === 'hourly' ? 'bg-white shadow-sm' : ''
                }`}
                onPress={() => handleBookingTypeChange('hourly')}
              >
                <Text className={`text-sm ${searchData.bookingType === 'hourly' ? 'text-gray-900' : 'text-gray-600'}`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Hourly
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* When - Date Range for Daily */}
          {searchData.bookingType === 'daily' && (
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
          )}

          {/* When - Time Range for Hourly */}
          {searchData.bookingType === 'hourly' && (
            <View className="mb-6">
              <Text 
                className="text-sm text-gray-900 mb-3" 
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Time Range
              </Text>
              <TimeRangePicker
                value={searchData.timeRange}
                onTimeRangeSelect={handleTimeRangeSelect}
                placeholder="Start time - End time"
                maxHours={12}
              />
            </View>
          )}

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
