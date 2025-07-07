import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { LocationSearchInput } from './LocationSearchInput';
import { DateRangePicker } from './DateRangePicker';
import { GuestSelector } from './GuestSelector';
import { router } from 'expo-router';
import { SheetManager as ActionSheetManager } from 'react-native-actions-sheet';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'country' | 'recent';
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

interface SearchData {
  location: Location | null;
  dateRange: DateRange;
  guests: GuestCounts;
}

interface SearchActionSheetProps {
  sheetId: string;
  payload?: {
    onSearch?: (searchData: SearchData) => void;
  };
}

export function SearchActionSheet({ sheetId, payload }: SearchActionSheetProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    location: null,
    dateRange: { startDate: null, endDate: null },
    guests: { adults: 1, children: 0, infants: 0 }
  });
  const [isSearching, setIsSearching] = useState(false);

  const isSearchEnabled = searchData.location && searchData.dateRange.startDate && searchData.dateRange.endDate;

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleSearch = () => {
    if (!isSearchEnabled) return;
    
    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      if (payload?.onSearch) {
        payload.onSearch({
          destination: searchData.location?.name || '',
            guests: searchData.guests.adults + searchData.guests.children,
            query: searchData.location?.name || ''
          guests: `${searchData.guests.adults + searchData.guests.children} guests`
        });
      }
      
      // Navigate to explore tab with search results
      router.push({
        pathname: '/(tabs)/search',
          payload.onSearch(searchData);
        }
      });
      
      // Close the sheet
      handleClose();
      
      setIsSearching(false);
    }, 1500);
  };
    
  const handleLocationSelect = (location: Location) => {
    setSearchData(prev => ({ ...prev, location }));
  };

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSearchData(prev => ({ ...prev, dateRange }));
  };

  const handleGuestCountChange = (guests: GuestCounts) => {
    setSearchData(prev => ({ ...prev, guests }));
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
      snapPoints={[100]}
      initialSnapIndex={0}
    >
      <View className="flex-col items-stretch bg-white" >
        {/* Handle */}
       

        <View className="justify-between">
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
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search destinations"
                />
              </View>

              {/* When */}
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
