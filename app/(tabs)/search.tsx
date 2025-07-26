import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LocationSearchInput } from '@/components/ui/LocationSearchInput';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { TimeRangePicker } from '@/components/ui/TimeRangePicker';
import { GuestSelector } from '@/components/ui/GuestSelector';

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
  startDateTime: string | null;
  endDateTime: string | null;
  startTime: string | null;
  endTime: string | null;
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

// Helper function to create local datetime string without timezone conversion
const createLocalDateTime = (date: Date, hours: number, minutes: number = 0) => {
  const localDate = new Date(date);
  localDate.setHours(hours, minutes, 0, 0);

  // Create ISO string manually to avoid UTC conversion
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hour = String(hours).padStart(2, '0');
  const minute = String(minutes).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:00.000`;
};

// Helper function to format time for display
const formatTimeForDisplay = (hours: number, minutes: number = 0) => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes === 0 ? '00' : String(minutes).padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
};

export default function SearchScreen() {
  const navigation = useNavigation();

  // Create proper default values
  const createDefaultSearchData = (): SearchData => {
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    const dayAfterTomorrow = new Date(Date.now() + 3*24*60*60*1000);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];

    // For daily bookings - set to 12:00 PM (noon) local time
    const dailyStartTime = createLocalDateTime(tomorrow, 12, 0); // 12:00 PM
    const dailyEndTime = createLocalDateTime(dayAfterTomorrow, 12, 0); // 12:00 PM next day

    // For hourly bookings - set to 9 AM to 5 PM local time
    const hourlyStartTime = createLocalDateTime(tomorrow, 9, 0); // 9:00 AM
    const hourlyEndTime = createLocalDateTime(tomorrow, 17, 0); // 5:00 PM

    // Default location (can be user's current location or popular destination)
    const defaultLocation: Location = {
      id: 'default-mumbai',
      name: 'Mumbai, India',
      description: 'Mumbai, Maharashtra, India',
      type: 'city',
      coordinates: {
        lat: 19.0760,
        lng: 72.8777
      }
    };

    return {
      location: defaultLocation,
      dateRange: { 
        startDate: dailyStartTime, // For daily, use 12:00 PM
        endDate: dailyEndTime 
      },
      timeRange: { 
        selectedDate: tomorrowDateString,
        startDateTime: hourlyStartTime, // For hourly, use 9:00 AM
        endDateTime: hourlyEndTime, // For hourly, use 5:00 PM
        startTime: formatTimeForDisplay(9, 0), // '9:00 AM'
        endTime: formatTimeForDisplay(17, 0) // '5:00 PM'
      },
      guests: { adults: 1, children: 0, infants: 0 },
      bookingType: 'daily'
    };
  };

  const [searchData, setSearchData] = useState<SearchData>(createDefaultSearchData);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);

  // Helper function to get tab styles based on active state
  const getTabStyle = (tabIndex: number) => ({
    backgroundColor: activeTab === tabIndex ? 'white' : 'transparent',
    shadowColor: activeTab === tabIndex ? '#000' : 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: activeTab === tabIndex ? 0.1 : 0,
    shadowRadius: 2,
    elevation: activeTab === tabIndex ? 2 : 0,
  });

  const getTextStyle = (tabIndex: number) => ({
    color: activeTab === tabIndex ? '#000000' : '#8A8A8A',
    fontFamily: 'PlusJakartaSans-SemiBold'
  });

  const isSearchEnabled = searchData.location && 
    (activeTab === 0 
      ? (searchData.dateRange.startDate && searchData.dateRange.endDate)
      : (searchData.timeRange.selectedDate && searchData.timeRange.startDateTime && searchData.timeRange.endDateTime)
    );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Text className="text-2xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Search Hotels</Text>
      ),
      headerTitleAlign: 'center',
      headerLeft:()=><Pressable className='pl-4' onPressIn={()=>router.back()}>
          <ArrowLeft></ArrowLeft>
      </Pressable>
    });
  }, [navigation]);

  const handleTabPress = (tab: number) => {
    console.log('tab pressed:', tab);
    setActiveTab(tab);

    setSearchData(prev => {
      const newBookingType = tab === 0 ? 'daily' : 'hourly';

      // If switching to hourly and timeRange is incomplete, set defaults
      if (tab === 1) {
        const tomorrow = new Date(Date.now() + 24*60*60*1000);
        const tomorrowDateString = tomorrow.toISOString().split('T')[0];

        const defaultStartTime = createLocalDateTime(tomorrow, 9, 0); // 9:00 AM
        const defaultEndTime = createLocalDateTime(tomorrow, 17, 0); // 5:00 PM

        const updatedTimeRange = {
          selectedDate: prev.timeRange.selectedDate || tomorrowDateString,
          startDateTime: prev.timeRange.startDateTime || defaultStartTime,
          endDateTime: prev.timeRange.endDateTime || defaultEndTime,
          startTime: prev.timeRange.startTime || formatTimeForDisplay(9, 0),
          endTime: prev.timeRange.endTime || formatTimeForDisplay(17, 0)
        };

        return { 
          ...prev, 
          bookingType: newBookingType,
          timeRange: updatedTimeRange
        };
      }

      // If switching to daily, ensure dateRange has values with 12:00 PM time
      if (tab === 0) {
        const tomorrow = new Date(Date.now() + 24*60*60*1000);
        const dayAfterTomorrow = new Date(Date.now() + 3*24*60*60*1000);

        const updatedDateRange = {
          startDate: prev.dateRange.startDate || createLocalDateTime(tomorrow, 12, 0), // 12:00 PM
          endDate: prev.dateRange.endDate || createLocalDateTime(dayAfterTomorrow, 12, 0) // 12:00 PM
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

  const handleSearch = () => {
    if (!isSearchEnabled) return;

    setIsSearching(true);

    console.log('searchData in search screen', searchData);

    // Navigate to SearchGlobal with the search data
    router.push({
      pathname: '/SearchGlobal',
      params: {
        searchData: JSON.stringify(searchData)
      }
    });

    setIsSearching(false);
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-4">
        {/* Tabs */}
        <View className="mb-6 mt-4">
          <View className="flex-row bg-gray-100 rounded-xl p-1">
            <TouchableOpacity
              onPress={() => handleTabPress(0)}
              className="flex-1 py-3 px-4 rounded-lg"
              style={getTabStyle(0)}
            >
              <Text
                className="text-center text-sm"
                style={getTextStyle(0)}
              >
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTabPress(1)}
              className="flex-1 py-3 px-4 rounded-lg"
              style={getTabStyle(1)}
            >
              <Text
                className="text-center text-sm"
                style={getTextStyle(1)}
              >
                Hourly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="flex-1">
          {/* Where */}
          <View className="mb-6">
            <Text
              className="text-sm text-black mb-2"
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
              className="text-sm text-black mb-2"
              style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
            >
              When
            </Text>
            {activeTab === 0 ? (
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
              className="text-sm text-black mb-2"
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

        {/* Footer with Search Button */}
        <View className="pb-6">
          <TouchableOpacity
            onPress={handleSearch}
            className={`flex h-14 w-full items-center justify-center rounded-xl shadow-lg ${isSearchEnabled && !isSearching
                ? 'bg-black'
                : 'bg-gray-300'
              }`}
            style={{
              shadowColor: isSearchEnabled ? '#000000' : '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isSearchEnabled ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
            disabled={!isSearchEnabled || isSearching}
          >
            <View className="flex-row items-center gap-2">
              <Search size={20} color={isSearchEnabled ? "white" : "#8A8A8A"} />
              <Text
                className={`text-base tracking-wide ${isSearchEnabled ? 'text-white' : 'text-gray-500'
                  }`}
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Search Hotels
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}