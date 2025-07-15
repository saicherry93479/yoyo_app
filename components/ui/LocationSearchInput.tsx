import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MapPin, Search, X, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'country' | 'address' | 'hotel' | 'landmark' | 'current';
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  rating?: number;
}

interface LocationSearchInputProps {
  value: string;
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  showCurrentLocation?: boolean;
  countryCode?: string;
  googleApiKey: string;
}

export function LocationSearchInput({
  value,
  onLocationSelect,
  placeholder = "Search destinations",
  showCurrentLocation = true,
  countryCode = 'in',
  googleApiKey
}: LocationSearchInputProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const googlePlacesRef = useRef<any>(null);

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setIsModalVisible(false);
    setSearchText('');
    setSuggestions([]);
  };

  const getCurrentLocation = async () => {
    if (!showCurrentLocation) return;

    setIsGettingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find your current location',
          [
            {
              text: 'Open Settings',
              onPress: () => Location.requestForegroundPermissionsAsync(),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setIsGettingLocation(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;

      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean).join(', ');

        const location: Location = {
          id: 'current_location',
          name: 'Current Location',
          description: formattedAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          type: 'current',
          coordinates: { lat: latitude, lng: longitude },
        };

        handleLocationSelect(location);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Unable to get your location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨';
      case 'landmark':
        return '🏛️';
      case 'city':
        return '🏙️';
      case 'current':
        return '📍';
      default:
        return '📍';
    }
  };

  const renderSuggestionItem = (location: Location) => (
    <TouchableOpacity
      key={location.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: 'white',
      }}
      onPress={() => handleLocationSelect(location)}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>
        {getLocationIcon(location.type)}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          color: '#0F172A',
          fontWeight: '600',
          marginBottom: 2,
          fontFamily: 'PlusJakartaSans-SemiBold'
        }}>
          {location.name}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#64748B',
          fontFamily: 'PlusJakartaSans-Regular'
        }}>
          {location.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCurrentLocationButton = () => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#F0F9FF',
      }}
      onPress={getCurrentLocation}
      disabled={isGettingLocation}
    >
      <View style={{ marginRight: 12 }}>
        {isGettingLocation ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Navigation size={20} color="#3B82F6" />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          color: '#2563EB',
          fontWeight: '600',
          fontFamily: 'PlusJakartaSans-SemiBold'
        }}>
          {isGettingLocation ? 'Getting location...' : 'Use current location'}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#3B82F6',
          fontFamily: 'PlusJakartaSans-Regular'
        }}>
          Find places near you
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
          <MapPin size={20} color="#94A3B8" />
        </View>
        <View className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 justify-center">
          <Text 
            className={`text-base ${value ? 'text-slate-900' : 'text-slate-400'}`}
            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          >
            {value || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Search Location
            </Text>
            <View className="w-6" />
          </View>

          {/* Search Input */}
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="relative">
              <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
                <Search size={20} color="#94A3B8" />
              </View>
              <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                placeholder={placeholder}
                predefinedPlaces={[]}
                onPress={(data, details = null) => {
                  setIsLoading(true);

                  let locationType: Location['type'] = 'address';
                  if (data.types?.includes('locality') || data.types?.includes('administrative_area_level_1')) {
                    locationType = 'city';
                  } else if (data.types?.includes('country')) {
                    locationType = 'country';
                  } else if (data.types?.includes('establishment')) {
                    locationType = 'hotel';
                  } else if (data.types?.includes('tourist_attraction')) {
                    locationType = 'landmark';
                  }

                  const location: Location = {
                    id: data.place_id || Math.random().toString(),
                    name: data.structured_formatting?.main_text || data.description,
                    description: data.structured_formatting?.secondary_text || data.description,
                    type: locationType,
                    coordinates: details?.geometry?.location ? {
                      lat: details.geometry.location.lat,
                      lng: details.geometry.location.lng
                    } : undefined,
                    placeId: data.place_id,
                    rating: details?.rating
                  };

                  setIsLoading(false);
                  handleLocationSelect(location);
                }}
                query={{
                  key: googleApiKey,
                  language: 'en',
                  components: `country:${countryCode}`,
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                debounce={300}
                timeout={20000}
                minLength={2}
                nearbyPlacesAPI="GooglePlacesSearch"
                GooglePlacesDetailsQuery={{
                  fields: 'geometry,formatted_address,name,rating,types,address_components',
                }}
                styles={{
                  container: {
                    flex: 0,
                    zIndex: 1,
                  },
                  textInputContainer: {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    height: 50,
                    paddingHorizontal: 0,
                  },
                  textInput: {
                    height: 50,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    backgroundColor: '#F8FAFC',
                    paddingLeft: 48,
                    paddingRight: 16,
                    fontSize: 16,
                    color: '#0F172A',
                    fontFamily: 'PlusJakartaSans-Regular',
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 12,
                    marginTop: 8,
                    maxHeight: 300,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  row: {
                    backgroundColor: 'white',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F1F5F9',
                  },
                  separator: {
                    height: 1,
                    backgroundColor: '#F1F5F9',
                  },
                  description: {
                    fontSize: 16,
                    color: '#0F172A',
                    fontWeight: '600',
                    fontFamily: 'PlusJakartaSans-SemiBold',
                  },
                  predefinedPlacesDescription: {
                    fontSize: 14,
                    color: '#64748B',
                    fontFamily: 'PlusJakartaSans-Regular',
                  },
                }}
                textInputProps={{
                  placeholderTextColor: '#94A3B8',
                  onChangeText: (text) => {
                    setSearchText(text);
                  },
                  value: searchText,
                  autoFocus: true,
                  returnKeyType: 'search',
                  clearButtonMode: 'while-editing',
                }}
                renderLeftButton={() => (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 16,
                    justifyContent: 'center',
                    zIndex: 10,
                  }}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#94A3B8" />
                    ) : (
                      <Search size={20} color="#94A3B8" />
                    )}
                  </View>
                )}
                listEmptyComponent={() => (
                  <View style={{ padding: 16 }}>
                    <Text style={{
                      textAlign: 'center',
                      color: '#6B7280',
                      fontSize: 14,
                      fontFamily: 'PlusJakartaSans-Regular'
                    }}>
                      {searchText.length > 0 ? 'No results found' : 'Start typing to search'}
                    </Text>
                  </View>
                )}
                onFail={(error) => {
                  console.error('GooglePlacesAutocomplete error:', error);
                  Alert.alert('Search Error', 'Unable to search locations. Please try again.');
                }}
                keyboardShouldPersistTaps="handled"
                listViewDisplayed="auto"
                keepResultsAfterBlur={false}
                suppressDefaultStyles={false}
              />
            </View>
          </View>

          {/* Current Location Option */}
          {showCurrentLocation && searchText.length === 0 && (
            <View className="flex-1">
              <ScrollView>
                {renderCurrentLocationButton()}
                
                {/* Helper text */}
                <View className="p-4">
                  <Text style={{
                    color: '#64748B',
                    fontSize: 14,
                    textAlign: 'center',
                    fontFamily: 'PlusJakartaSans-Regular'
                  }}>
                    Search for cities, hotels, landmarks, or addresses
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}

          {/* Empty state when searching */}
          {searchText.length === 0 && !showCurrentLocation && (
            <View className="flex-1 justify-center items-center p-8">
              <Search size={48} color="#CBD5E1" />
              <Text style={{
                color: '#64748B',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 16,
                fontFamily: 'PlusJakartaSans-Regular'
              }}>
                Search for your destination
              </Text>
              <Text style={{
                color: '#94A3B8',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
                fontFamily: 'PlusJakartaSans-Regular'
              }}>
                Type a city, hotel, or landmark name
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}