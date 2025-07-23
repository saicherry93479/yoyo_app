
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
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  timeRange?: {
    selectedDate: string | null;
    startDateTime: string | null;
    endDateTime: string | null;
    startTime: string | null;
    endTime: string | null;
  };
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
    dateRange: {
      startDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
      endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString()
    },
    timeRange: {
      selectedDate: null,
      startDateTime: null,
      endDateTime: null,
      startTime: null,
      endTime: null
    },
    bookingType: 'daily'
  };

  const [activeTab, setActiveTab] = useState(initialData.bookingType === 'daily' ? 0 : 1);
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

  const handleTabPress = (tab: number) => {
    setActiveTab(tab);
    setSearchData(prev => ({ 
      ...prev, 
      bookingType: tab === 0 ? 'daily' : 'hourly' 
    }));
  };
  const handleDateRangeSelect = (dateRange: DateRange) => {
    if (dateRange.startDate && dateRange.endDate) {
      setSearchData(prev => ({
        ...prev,
        dateRange: {
          startDate: dateRange.startDate!,
          endDate: dateRange.endDate!
        }
      }));
    }
  };

  const handleTimeRangeSelect = (timeRange: any) => {
    setSearchData(prev => ({
      ...prev,
      timeRange
    }));
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  };

  const isApplyEnabled = searchData.bookingType === 'daily' 
    ? (searchData.dateRange?.startDate && searchData.dateRange?.endDate)
    : (searchData.timeRange?.selectedDate && searchData.timeRange?.startDateTime && searchData.timeRange?.endDateTime);

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

        {/* Tabs */}
        <View className="px-6 mb-4">
          <View className="flex-row bg-gray-100 rounded-xl p-1">
            <TouchableOpacity
              onPress={() => handleTabPress(0)}
              className={`flex-1 py-3 px-4 rounded-lg ${
                activeTab === 0 ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center text-sm ${
                  activeTab === 0 ? 'text-slate-900' : 'text-slate-600'
                }`}
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTabPress(1)}
              className={`flex-1 py-3 px-4 rounded-lg ${
                activeTab === 1 ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center text-sm ${
                  activeTab === 1 ? 'text-slate-900' : 'text-slate-600'
                }`}
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Hourly
              </Text>
            </TouchableOpacity>
          </View>
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
            {activeTab === 0 ? (
              <DateRangePicker
                value={{
                  startDate: searchData.dateRange?.startDate || null,
                  endDate: searchData.dateRange?.endDate || null
                }}
                onDateRangeSelect={handleDateRangeSelect}
                placeholder="Check-in - Check-out"
              />
            ) : (
              <TimeRangePicker
                value={searchData.timeRange || {
                  selectedDate: null,
                  startDateTime: null,
                  endDateTime: null,
                  startTime: null,
                  endTime: null
                }}
                onTimeRangeSelect={handleTimeRangeSelect}
                placeholder="Start time - End time"
              />
            )}
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
              isApplyEnabled ? 'bg-red-600' : 'bg-gray-300'
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
              isApplyEnabled ? 'bg-red-600' : 'bg-gray-300'
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
