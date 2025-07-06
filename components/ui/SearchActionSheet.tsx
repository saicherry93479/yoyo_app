import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { X, Search, Calendar, Users } from 'lucide-react-native';

interface SearchData {
  destination: string;
  dates: string;
  guests: string;
}

interface SearchActionSheetProps {
  sheetId: string;
  payload?: {
    onSearch?: (searchData: SearchData) => void;
  };
}

export function SearchActionSheet({ sheetId, payload }: SearchActionSheetProps) {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('1 guest');

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleSearch = () => {
    const searchData: SearchData = {
      destination,
      dates,
      guests
    };
    
    if (payload?.onSearch) {
      payload.onSearch(searchData);
    }
    
    handleClose();
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
                <View className="relative">
                  <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                    <Search size={20} color="#94A3B8" />
                  </View>
                  <TextInput
                    className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-12 pr-4 py-3 text-base"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    placeholder="Search destinations"
                    placeholderTextColor="#94A3B8"
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
              </View>

              {/* When */}
              <View className="mb-6">
                <Text 
                  className="text-sm text-slate-900 mb-2" 
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  When
                </Text>
                <View className="relative">
                  <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                    <Calendar size={20} color="#94A3B8" />
                  </View>
                  <TextInput
                    className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-12 pr-4 py-3 text-base"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    placeholder="Check in - Check out"
                    placeholderTextColor="#94A3B8"
                    value={dates}
                    onChangeText={setDates}
                  />
                </View>
              </View>

              {/* Who */}
              <View className="mb-6">
                <Text 
                  className="text-sm text-slate-900 mb-2" 
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  Who
                </Text>
                <View className="relative">
                  <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                    <Users size={20} color="#94A3B8" />
                  </View>
                  <TextInput
                    className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-12 pr-4 py-3 text-base"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    placeholder="1 guest"
                    placeholderTextColor="#94A3B8"
                    value={guests}
                    onChangeText={setGuests}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Footer with Search Button */}
          <View className="bg-white px-4 pb-6">
            <TouchableOpacity 
              onPress={handleSearch}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#FF5A5F] shadow-lg"
              style={{
                shadowColor: '#FF5A5F',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text 
                className="text-base text-white tracking-wide" 
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}

// Usage example:
// 
// To show the search action sheet:
// SheetManager.show('search', {
//   payload: {
//     onSearch: (data) => {
//       console.log('Search data:', data);
//       // Handle search logic here
//     }
//   }
// });
// 
// In your sheets registration:
// registerSheet('search', SearchActionSheet);