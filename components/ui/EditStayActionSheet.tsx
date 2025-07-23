import React, { useState, useRef, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { DateRangePicker } from './DateRangePicker';
import { TimeRangePicker } from './TimeRangePicker';
import { GuestSelector } from './GuestSelector';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface TimeRange {
  selectedDate: string | null;
  startDateTime: string | null; // Full ISO datetime string
  endDateTime: string | null;   // Full ISO datetime string
  startTime: string | null;     // Display time (for UI)
  endTime: string | null;       // Display time (for UI)
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
  bookingType: 'daily' | 'hourly';
  dateRange: DateRange;
  timeRange: TimeRange;
}

interface EditStayActionSheetProps {
  sheetId: string;
  payload?: {
    searchData?: EditStayData;
    onSearch?: (newSearchData: EditStayData) => void;
  };
}

export function EditStayActionSheet({ sheetId, payload }: EditStayActionSheetProps) {
  const activeTabRef = useRef(0);
  
  // Create proper default values based on booking type
  const createDefaultData = (existingData?: EditStayData): EditStayData => {
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    const dayAfterTomorrow = new Date(Date.now() + 3*24*60*60*1000);
    
    if (existingData) {
      return {
        ...existingData,
        // Ensure all required fields exist
        dateRange: existingData.dateRange || {
          startDate: existingData.checkIn || tomorrow.toISOString(),
          endDate: existingData.checkOut || dayAfterTomorrow.toISOString()
        },
        timeRange: existingData.timeRange || {
          selectedDate: tomorrow.toISOString().split('T')[0],
          startDateTime: null,
          endDateTime: null,
          startTime: null,
          endTime: null
        }
      };
    }

    return {
      guests: { adults: 2, children: 0, infants: 0 },
      checkIn: tomorrow.toISOString(),
      checkOut: dayAfterTomorrow.toISOString(),
      bookingType: 'daily',
      dateRange: {
        startDate: tomorrow.toISOString(),
        endDate: dayAfterTomorrow.toISOString()
      },
      timeRange: {
        selectedDate: tomorrow.toISOString().split('T')[0],
        startDateTime: null,
        endDateTime: null,
        startTime: null,
        endTime: null
      }
    };
  };

  const [searchData, setSearchData] = useState<EditStayData>(() => 
    createDefaultData(payload?.searchData)
  );

  // Set initial tab based on booking type
  useEffect(() => {
    if (payload?.searchData?.bookingType) {
      const tabIndex = payload.searchData.bookingType === 'daily' ? 0 : 1;
      activeTabRef.current = tabIndex;
      setTimeout(() => updateTabStyles(tabIndex), 100);
    }
  }, []);

  const updateTabStyles = (newTab: number) => {
    // Get references to the tab elements
    const dailyTab = dailyTabRef.current;
    const hourlyTab = hourlyTabRef.current;
    const dailyText = dailyTextRef.current;
    const hourlyText = hourlyTextRef.current;

    if (dailyTab && hourlyTab && dailyText && hourlyText) {
      // Reset both tabs
      dailyTab.setNativeProps({
        style: {
          backgroundColor: 'transparent',
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 0,
        }
      });
      hourlyTab.setNativeProps({
        style: {
          backgroundColor: 'transparent',
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 0,
        }
      });

      // Reset text colors
      dailyText.setNativeProps({
        style: {
          color: Colors['light'].icon
        }
      });
      hourlyText.setNativeProps({
        style: {
          color: Colors['light'].icon
        }
      });

      // Apply active styles to selected tab
      if (newTab === 0) {
        dailyTab.setNativeProps({
          style: {
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }
        });
        dailyText.setNativeProps({
          style: {
            color: '#0F172A' // text-slate-900
          }
        });
      } else {
        hourlyTab.setNativeProps({
          style: {
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }
        });
        hourlyText.setNativeProps({
          style: {
            color: '#0F172A' // text-slate-900
          }
        });
      }
    }
  };

  const handleTabPress = (tab: number) => {
    activeTabRef.current = tab;
    updateTabStyles(tab);
    setSearchData(prev => ({ 
      ...prev, 
      bookingType: tab === 0 ? 'daily' : 'hourly' 
    }));
  };

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleApply = () => {
    if (payload?.onSearch) {
      // Update checkIn/checkOut based on active booking type
      let updatedData = { ...searchData };
      
      if (activeTabRef.current === 0) {
        // Daily booking - use date range
        if (searchData.dateRange.startDate && searchData.dateRange.endDate) {
          updatedData.checkIn = searchData.dateRange.startDate;
          updatedData.checkOut = searchData.dateRange.endDate;
        }
      } else {
        // Hourly booking - use time range
        if (searchData.timeRange.startDateTime && searchData.timeRange.endDateTime) {
          updatedData.checkIn = searchData.timeRange.startDateTime;
          updatedData.checkOut = searchData.timeRange.endDateTime;
        }
      }
      
      payload.onSearch(updatedData);
    }
    handleClose();
  };

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSearchData(prev => ({
      ...prev,
      dateRange,
      // Update legacy fields for backward compatibility
      checkIn: dateRange.startDate || prev.checkIn,
      checkOut: dateRange.endDate || prev.checkOut
    }));
  };

  const handleTimeRangeSelect = (timeRange: TimeRange) => {
    setSearchData(prev => ({
      ...prev,
      timeRange,
      // Update legacy fields for backward compatibility
      checkIn: timeRange.startDateTime || prev.checkIn,
      checkOut: timeRange.endDateTime || prev.checkOut
    }));
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  };

  // Validation based on active tab
  const isApplyEnabled = activeTabRef.current === 0 
    ? (searchData.dateRange.startDate && searchData.dateRange.endDate)
    : (searchData.timeRange.selectedDate && searchData.timeRange.startDateTime && searchData.timeRange.endDateTime);

  // Refs for tab elements
  const dailyTabRef = useRef<TouchableOpacity>(null);
  const hourlyTabRef = useRef<TouchableOpacity>(null);
  const dailyTextRef = useRef<Text>(null);
  const hourlyTextRef = useRef<Text>(null);

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
              ref={dailyTabRef}
              onPress={() => handleTabPress(0)}
              className="flex-1 py-3 px-4 rounded-lg bg-white shadow-sm"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                ref={dailyTextRef}
                className="text-center text-sm text-slate-900"
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={hourlyTabRef}
              onPress={() => handleTabPress(1)}
              className="flex-1 py-3 px-4 rounded-lg bg-transparent"
              style={{
                shadowColor: 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 0,
              }}
            >
              <Text
                ref={hourlyTextRef}
                className="text-center text-sm text-slate-600"
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Hourly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6 pb-6">
          {/* When - Show DateRangePicker for Daily, TimeRangePicker for Hourly */}
          <View className="mb-6">
            <Text 
              className="text-sm text-gray-900 mb-3" 
              style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
            >
              When
            </Text>
            {activeTabRef.current === 0 ? (
              <DateRangePicker
                value={searchData.dateRange}
                onDateRangeSelect={handleDateRangeSelect}
                placeholder="Check-in - Check-out"
              />
            ) : (
              <TimeRangePicker
                value={searchData.timeRange}
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
              isApplyEnabled ? 'bg-black' : 'bg-gray-300'
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