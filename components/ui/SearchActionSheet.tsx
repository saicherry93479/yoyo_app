import React, { useState, useCallback } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { LocationSearchInput } from './LocationSearchInput';
import { DateRangePicker } from './DateRangePicker';
import { TimeRangePicker } from './TimeRangePicker';
import { GuestSelector } from './GuestSelector';

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

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
}

interface TimeRange {
  startTime: string | null;
  endTime: string | null;
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
    onNavigateToSearch?: (searchData: SearchData) => void;
    initialData?: SearchData;
  };
}

export function SearchActionSheet({ sheetId, payload }: SearchActionSheetProps) {
  const [searchData, setSearchData] = useState<SearchData>(payload?.initialData || {
    location: null,
    dateRange: { startDate: null, endDate: null },
    timeRange: { startTime: null, endTime: null },
    guests: { adults: 1, children: 0, infants: 0 },
    bookingType: 'hourly'
  });
  const [isSearching, setIsSearching] = useState(false);

  const isSearchEnabled = searchData.location && 
    (searchData.bookingType === 'daily' 
      ? (searchData.dateRange.startDate && searchData.dateRange.endDate)
      : (searchData.timeRange.startTime && searchData.timeRange.endTime)
    );

  const handleClose = useCallback(() => {
    SheetManager.hide(sheetId);
  }, [sheetId]);

  const handleSearch = useCallback(() => {
    if (!isSearchEnabled) return;

    setIsSearching(true);

    // Simulate search API call
    setTimeout(() => {
      // Pass the complete search data to the callback
      if (payload?.onSearch) {
        payload.onSearch(searchData);
      }

      // Close the sheet first
      handleClose();

      setIsSearching(false);
    }, 1000);
  }, [isSearchEnabled, payload, searchData, handleClose]);

  const handleLocationSelect = useCallback((location: Location) => {
    setSearchData(prev => ({ ...prev, location }));
  }, []);

  const handleDateRangeSelect = useCallback((dateRange: DateRange) => {
    setSearchData(prev => ({ ...prev, dateRange }));
  }, []);

  const handleTimeRangeSelect = useCallback((timeRange: TimeRange) => {
    setSearchData(prev => ({ ...prev, timeRange }));
  }, []);

  const handleBookingTypeChange = useCallback((bookingType: 'daily' | 'hourly') => {
    try {
      setSearchData(prev => ({ 
        ...prev, 
        bookingType,
        // Reset time/date ranges when switching types to avoid conflicts
        dateRange: bookingType === 'daily' ? prev.dateRange : { startDate: null, endDate: null },
        timeRange: bookingType === 'hourly' ? prev.timeRange : { startTime: null, endTime: null }
      }));
    } catch (error) {
      console.warn('Error changing booking type:', error);
    }
  }, []);

  const handleGuestCountChange = useCallback((guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
  }, []);

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

            {/* Form Fields */}
            <View className="px-4">
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

              {/* When - Date Range for Daily */}
              {searchData.bookingType === 'daily' && (
                <View className="mb-6">
                  <Text 
                    className="text-sm text-slate-900 mb-2" 
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    When
                  </Text>
                  <DateRangePicker
                    value={searchData.dateRange}
                    onDateRangeSelect={handleDateRangeSelect}
                    placeholder="Check-in - Check-out"
                  />
                </View>
              )}

              {/* When - Time Range for Hourly */}
              {searchData.bookingType === 'hourly' && (
                <View className="mb-6">
                  <Text 
                    className="text-sm text-slate-900 mb-2" 
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
              className={`flex h-14 w-full items-center justify-center rounded-xl shadow-lg ${
                isSearchEnabled && !isSearching 
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
                    className={`text-base tracking-wide ${
                      isSearchEnabled ? 'text-white' : 'text-gray-500'
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