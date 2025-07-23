import React, { useState, useRef, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { LocationSearchInput } from './LocationSearchInput';
import { DateRangePicker } from './DateRangePicker';
import { TimeRangePicker } from './TimeRangePicker';
import { GuestSelector } from './GuestSelector';
import { router } from 'expo-router';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'country' | 'recent' | 'current';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

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

interface SearchData {
  location: Location | null;
  dateRange: DateRange;
  timeRange: TimeRange;
  guests: GuestCounts;
  bookingType: 'daily' | 'hourly';
}

interface SearchActionSheetProps {
  sheetId: string;
  payload?: {
    onSearch?: (searchData: SearchData) => void;
  };
}

export function SearchActionSheet({ sheetId, payload }: SearchActionSheetProps) {
  const activeTabRef = useRef(0);

  // Create proper default values
  const createDefaultSearchData = (): SearchData => {
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    const dayAfterTomorrow = new Date(Date.now() + 3*24*60*60*1000);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    
    // Default time slots (9 AM to 5 PM tomorrow)
    const defaultStartTime = new Date(tomorrow);
    defaultStartTime.setHours(9, 0, 0, 0);
    const defaultEndTime = new Date(tomorrow);
    defaultEndTime.setHours(17, 0, 0, 0);

    return {
      location: null,
      dateRange: { 
        startDate: tomorrow.toISOString(), 
        endDate: dayAfterTomorrow.toISOString() 
      },
      timeRange: { 
        selectedDate: tomorrowDateString,
        startDateTime: defaultStartTime.toISOString(),
        endDateTime: defaultEndTime.toISOString(),
        startTime: '09:00',
        endTime: '17:00'
      },
      guests: { adults: 1, children: 0, infants: 0 },
      bookingType: 'daily'
    };
  };

  const [searchData, setSearchData] = useState<SearchData>(createDefaultSearchData);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize tab styles on mount
  useEffect(() => {
    setTimeout(() => updateTabStyles(0), 100);
  }, []);

  const isSearchEnabled = searchData.location && 
    (activeTabRef.current === 0 
      ? (searchData.dateRange.startDate && searchData.dateRange.endDate)
      : (searchData.timeRange.selectedDate && searchData.timeRange.startDateTime && searchData.timeRange.endDateTime)
    );

  useEffect(() => {
    console.log('searchData ', searchData);
  }, [searchData]);

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
          color: '#64748B' // text-slate-600
        }
      });
      hourlyText.setNativeProps({
        style: {
          color: '#64748B' // text-slate-600
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
    console.log('tab is ', tab);
    activeTabRef.current = tab;
    updateTabStyles(tab);
    
    setSearchData(prev => {
      const newBookingType = tab === 0 ? 'daily' : 'hourly';
      
      // If switching to hourly and timeRange is incomplete, set defaults
      if (tab === 1) {
        const tomorrow = new Date(Date.now() + 24*60*60*1000);
        const tomorrowDateString = tomorrow.toISOString().split('T')[0];
        
        const defaultStartTime = new Date(tomorrow);
        defaultStartTime.setHours(9, 0, 0, 0);
        const defaultEndTime = new Date(tomorrow);
        defaultEndTime.setHours(17, 0, 0, 0);

        const updatedTimeRange = {
          selectedDate: prev.timeRange.selectedDate || tomorrowDateString,
          startDateTime: prev.timeRange.startDateTime || defaultStartTime.toISOString(),
          endDateTime: prev.timeRange.endDateTime || defaultEndTime.toISOString(),
          startTime: prev.timeRange.startTime || '09:00',
          endTime: prev.timeRange.endTime || '17:00'
        };

        return { 
          ...prev, 
          bookingType: newBookingType,
          timeRange: updatedTimeRange
        };
      }
      
      // If switching to daily, ensure dateRange has values
      if (tab === 0) {
        const tomorrow = new Date(Date.now() + 24*60*60*1000);
        const dayAfterTomorrow = new Date(Date.now() + 3*24*60*60*1000);
        
        const updatedDateRange = {
          startDate: prev.dateRange.startDate || tomorrow.toISOString(),
          endDate: prev.dateRange.endDate || dayAfterTomorrow.toISOString()
        };

        return { 
          ...prev, 
          bookingType: newBookingType,
          dateRange: updatedDateRange
        };
      }

      return { ...prev, bookingType: newBookingType };
    });
  };

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleSearch = () => {
    if (!isSearchEnabled) return;

    setIsSearching(true);

    // Simulate search API call
    setTimeout(() => {
      // Pass the complete search data to the parent component
      if (payload?.onSearch) {
        payload.onSearch(searchData);
      }

      // Close the sheet
      handleClose();

      setIsSearching(false);
    }, 1000);
  };

  const handleLocationSelect = (location: Location) => {
    setSearchData(prev => ({ ...prev, location }));
  };

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSearchData(prev => ({ ...prev, dateRange }));
  };

  const handleTimeRangeSelect = (timeRange: TimeRange) => {
    setSearchData(prev => ({ ...prev, timeRange }));
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  };

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
      snapPoints={[100]}
      initialSnapIndex={0}
    >
      <View className="flex-col items-stretch bg-white" style={{ minHeight: 600 }}>
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center pt-3">
          <View className="h-1.5 w-10 rounded-full bg-gray-200" />
        </View>

        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-col">
            <View className="flex-row items-center justify-between px-4 py-4 pb-2">
              <TouchableOpacity
                onPress={handleClose}
                className="flex size-10 items-center justify-center rounded-full bg-slate-100"
              >
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text
                className="text-lg text-slate-900"
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Search
              </Text>
              <View className="size-10" />
            </View>

            {/* Tabs */}
            <View className="px-4 mb-4">
              <View className="flex-row bg-gray-100 rounded-xl p-1">
                <TouchableOpacity
                  ref={dailyTabRef}
                  onPress={() => handleTabPress(0)}
                  className="flex-1 py-3 px-4 rounded-lg"
                >
                  <Text
                    ref={dailyTextRef}
                    className="text-center text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  ref={hourlyTabRef}
                  onPress={() => handleTabPress(1)}
                  className="flex-1 py-3 px-4 rounded-lg"
                >
                  <Text
                    ref={hourlyTextRef}
                    className="text-center text-sm"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Hourly
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

       

            {/* Form Fields */}
            <View className="px-4">
              {/* Where */}
              <View className="mb-6">
                <Text
                  className="text-sm text-slate-900 mb-2"
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  Where
                </Text>
                <LocationSearchInput
                  value={searchData.location?.name || ''}
                  googleApiKey='AIzaSyDBFyJk1ZsnnqxLC43WT_-OSCFZaG0OaNM'
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search destinations"
                />
              </View>

              {/* When - Show DateRangePicker for Daily, TimeRangePicker for Hourly */}
              <View className="mb-6">
                <Text
                  className="text-sm text-slate-900 mb-2"
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
                  className="text-sm text-slate-900 mb-2"
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
          </View>

          {/* Footer with Search Button */}
          <View className="bg-white px-4 pb-6">
            <TouchableOpacity
              onPress={handleSearch}
              className={`flex h-14 w-full items-center justify-center rounded-xl shadow-lg ${isSearchEnabled && !isSearching
                  ? 'bg-[#FF5A5F]'
                  : 'bg-gray-300'
                }`}
              style={{
                shadowColor: isSearchEnabled ? '#FF5A5F' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isSearchEnabled ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
              disabled={!isSearchEnabled || isSearching}
            >
              {isSearching ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="white" />
                  <Text
                    className="text-base text-white tracking-wide"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    Searching...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Search size={20} color="white" />
                  <Text
                    className={`text-base tracking-wide ${isSearchEnabled ? 'text-white' : 'text-gray-500'
                      }`}
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                  >
                    Search
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}