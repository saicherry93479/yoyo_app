import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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

// Mock location data - in production, this would come from a real API like Google Places
const mockLocations: Location[] = [
  { id: '1', name: 'Mumbai', description: 'Maharashtra, India', type: 'city' },
  { id: '2', name: 'Delhi', description: 'National Capital Territory, India', type: 'city' },
  { id: '3', name: 'Bangalore', description: 'Karnataka, India', type: 'city' },
  { id: '4', name: 'Goa', description: 'India', type: 'region' },
  { id: '5', name: 'Kerala', description: 'India', type: 'region' },
  { id: '6', name: 'Rajasthan', description: 'India', type: 'region' },
  { id: '7', name: 'Himachal Pradesh', description: 'India', type: 'region' },
  { id: '8', name: 'Tamil Nadu', description: 'India', type: 'region' },
  { id: '9', name: 'Uttarakhand', description: 'India', type: 'region' },
  { id: '10', name: 'Manali', description: 'Himachal Pradesh, India', type: 'city' },
];

const recentSearches: Location[] = [
  { id: 'r1', name: 'Goa', description: 'India', type: 'recent' },
  { id: 'r2', name: 'Mumbai', description: 'Maharashtra, India', type: 'recent' },
];

export function LocationSearchInput({ value, onLocationSelect, placeholder = "Where are you going?" }: LocationSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSuggestions(recentSearches);
      setShowSuggestions(true);
      return;
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Simulate API call delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setIsLoading(false);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
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
      <View className="relative">
        <View className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
          <MapPin size={20} color="#94A3B8" />
        </View>
        <TextInput
          className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 pl-12 pr-4 py-3 text-base"
          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSuggestions(true)}
        />
      </View>

      {showSuggestions && (
        <View className="absolute top-16 left-0 right-0 bg-white rounded-lg border border-gray-200 shadow-lg z-20 max-h-80">
          {searchQuery.length === 0 && (
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Recent searches
              </Text>
            </View>
          )}
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View className="flex items-center justify-center py-8">
                <ActivityIndicator size="small" color="#FF5A5F" />
                <Text className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Searching locations...
                </Text>
              </View>
            ) : suggestions.length > 0 ? (
              suggestions.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
                  onPress={() => handleLocationSelect(location)}
                >
                  <View className="mr-3">
                    {getLocationIcon(location.type)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                      {location.name}
                    </Text>
                    <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      {location.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="flex items-center justify-center py-8">
                <MapPin size={32} color="#D1D5DB" />
                <Text className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  No locations found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}