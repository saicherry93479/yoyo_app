import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MapPin, Clock } from 'lucide-react-native';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'country' | 'recent';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationSearchInputProps {
  value: string;
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
}

// Recent searches stored locally
const recentSearches: Location[] = [
  { id: 'r1', name: 'Goa', description: 'India', type: 'recent' },
  { id: 'r2', name: 'Mumbai', description: 'Maharashtra, India', type: 'recent' },
  { id: 'r3', name: 'Delhi', description: 'National Capital Territory, India', type: 'recent' },
];

export function LocationSearchInput({ value, onLocationSelect, placeholder = "Where are you going?" }: LocationSearchInputProps) {
  const [showRecents, setShowRecents] = useState(false);

  const handleLocationSelect = (location: Location) => {
    setShowRecents(false);
    onLocationSelect(location);
  };

  const getLocationIcon = (type: string) => {
    if (type === 'recent') {
      return <Clock size={20} color="#6B7280" />;
    }
    return <MapPin size={20} color="#6B7280" />;
  };

  return (
    <View className="relative">
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={(data, details = null) => {
          const location: Location = {
            id: data.place_id || Math.random().toString(),
            name: data.structured_formatting?.main_text || data.description,
            description: data.structured_formatting?.secondary_text || data.description,
            type: 'city',
            coordinates: details?.geometry?.location ? {
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng
            } : undefined
          };
          onLocationSelect(location);
        }}
        query={{
          key: 'AIzaSyDBFyJk1ZsnnqxLC43WT_-OSCFZaG0OaNM',
          language: 'en',
          types: '(cities)',
          components: 'country:in', // Restrict to India
        }}
        fetchDetails={true}
        enablePoweredByContainer={false}
        styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            height: 56,
          },
          textInput: {
            height: 56,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            backgroundColor: '#F8FAFC',
            paddingLeft: 48,
            paddingRight: 16,
            fontSize: 16,
            fontFamily: 'PlusJakartaSans-Regular',
            color: '#0F172A',
          },
          predefinedPlacesDescription: {
            color: '#1982C4',
            fontFamily: 'PlusJakartaSans-Medium',
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            marginTop: 4,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            maxHeight: 320,
          },
          row: {
            backgroundColor: 'white',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          },
          description: {
            fontFamily: 'PlusJakartaSans-Regular',
            fontSize: 16,
            color: '#374151',
          },
          separator: {
            height: 1,
            backgroundColor: '#F3F4F6',
          },
        }}
        textInputProps={{
          onFocus: () => setShowRecents(true),
          onBlur: () => setTimeout(() => setShowRecents(false), 150),
          placeholderTextColor: '#94A3B8',
        }}
        renderLeftButton={() => (
          <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
            <MapPin size={20} color="#94A3B8" />
          </View>
        )}
        predefinedPlaces={showRecents ? recentSearches.map(location => ({
          description: location.name,
          geometry: { location: { lat: 0, lng: 0 } },
          place_id: location.id,
          structured_formatting: {
            main_text: location.name,
            secondary_text: location.description,
          }
        })) : []}
        predefinedPlacesAlwaysVisible={showRecents}
        renderRow={(rowData) => {
          const isRecent = recentSearches.some(r => r.id === rowData.place_id);
          return (
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50">
              <View className="mr-3">
                {isRecent ? (
                  <Clock size={20} color="#6B7280" />
                ) : (
                  <MapPin size={20} color="#6B7280" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {rowData.structured_formatting?.main_text || rowData.description}
                </Text>
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  {rowData.structured_formatting?.secondary_text || ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}