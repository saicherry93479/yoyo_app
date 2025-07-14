import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MapPin, Clock, Search, Star, Building, MapIcon, Navigation, Wifi, WifiOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'country' | 'recent' | 'popular' | 'address' | 'hotel' | 'landmark' | 'current';
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  rating?: number;
  category?: string;
  timestamp?: number;
}

interface LocationSearchInputProps {
  value: string;
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  showPopularDestinations?: boolean;
  showRecentSearches?: boolean;
  showCurrentLocation?: boolean;
  countryCode?: string;
  googleApiKey: string;
  maxRecentSearches?: number;
}

// Storage keys
const STORAGE_KEYS = {
  RECENT_SEARCHES: '@hotel_app_recent_searches',
  POPULAR_DESTINATIONS: '@hotel_app_popular_destinations',
  CACHE_TIMESTAMP: '@hotel_app_cache_timestamp',
};

// Cache duration (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Default popular destinations (fallback)
const DEFAULT_POPULAR_DESTINATIONS: Location[] = [
  { 
    id: 'p1', 
    name: 'Goa', 
    description: 'Beach paradise', 
    type: 'popular',
    rating: 4.5,
    coordinates: { lat: 15.2993, lng: 74.1240 }
  },
  { 
    id: 'p2', 
    name: 'Kerala', 
    description: 'God\'s Own Country', 
    type: 'popular',
    rating: 4.7,
    coordinates: { lat: 10.8505, lng: 76.2711 }
  },
  { 
    id: 'p3', 
    name: 'Rajasthan', 
    description: 'Land of Kings', 
    type: 'popular',
    rating: 4.4,
    coordinates: { lat: 27.0238, lng: 74.2179 }
  },
  { 
    id: 'p4', 
    name: 'Manali', 
    description: 'Hill station', 
    type: 'popular',
    rating: 4.3,
    coordinates: { lat: 32.2432, lng: 77.1892 }
  },
  { 
    id: 'p5', 
    name: 'Udaipur', 
    description: 'City of Lakes', 
    type: 'popular',
    rating: 4.6,
    coordinates: { lat: 24.5854, lng: 73.7125 }
  },
  { 
    id: 'p6', 
    name: 'Shimla', 
    description: 'Queen of Hills', 
    type: 'popular',
    rating: 4.2,
    coordinates: { lat: 31.1048, lng: 77.1734 }
  },
];

export function LocationSearchInput({ 
  value, 
  onLocationSelect, 
  placeholder = "Search cities, hotels, or addresses",
  showPopularDestinations = true,
  showRecentSearches = true,
  showCurrentLocation = true,
  countryCode = 'in',
  googleApiKey,
  maxRecentSearches = 10
}: LocationSearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Location[]>(DEFAULT_POPULAR_DESTINATIONS);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const googlePlacesRef = useRef(null);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return unsubscribe;
  }, []);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Load data from AsyncStorage
  const loadCachedData = async () => {
    try {
      // Load recent searches
      const cachedRecent = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (cachedRecent) {
        const parsedRecent = JSON.parse(cachedRecent);
        setRecentSearches(parsedRecent.slice(0, maxRecentSearches));
      }

      // Load popular destinations with cache validation
      const cachedPopular = await AsyncStorage.getItem(STORAGE_KEYS.POPULAR_DESTINATIONS);
      const cacheTimestamp = await AsyncStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
      
      if (cachedPopular && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp);
        const isValidCache = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValidCache) {
          const parsedPopular = JSON.parse(cachedPopular);
          setPopularDestinations(parsedPopular);
        } else {
          refreshPopularDestinations();
        }
      } else {
        refreshPopularDestinations();
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  // Refresh popular destinations
  const refreshPopularDestinations = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.POPULAR_DESTINATIONS, 
        JSON.stringify(DEFAULT_POPULAR_DESTINATIONS)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.CACHE_TIMESTAMP, 
        Date.now().toString()
      );
      setPopularDestinations(DEFAULT_POPULAR_DESTINATIONS);
    } catch (error) {
      console.error('Error refreshing popular destinations:', error);
    }
  };

  // Save recent search to AsyncStorage
  const saveRecentSearch = async (location: Location) => {
    try {
      const searchWithTimestamp = {
        ...location,
        type: 'recent' as const,
        timestamp: Date.now(),
      };

      const updatedRecent = [
        searchWithTimestamp,
        ...recentSearches.filter(item => item.id !== location.id)
      ].slice(0, maxRecentSearches);

      setRecentSearches(updatedRecent);
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES, 
        JSON.stringify(updatedRecent)
      );
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Clear recent searches
  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (!showCurrentLocation) return;
    
    setIsGettingLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find hotels near you',
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
        timeInterval: 10000,
        distanceInterval: 0,
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

        setCurrentLocation(location);
        handleLocationSelect(location);
      } else {
        const location: Location = {
          id: 'current_location',
          name: 'Current Location',
          description: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          type: 'current',
          coordinates: { lat: latitude, lng: longitude },
        };

        setCurrentLocation(location);
        handleLocationSelect(location);
      }
    } catch (error) {
      console.error('Location error:', error);
      
      let errorMessage = 'Unable to get your location';
      if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
        errorMessage = 'Location services are disabled';
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage = 'Location is temporarily unavailable';
      } else if (error.code === 'E_LOCATION_TIMEOUT') {
        errorMessage = 'Location request timed out';
      }
      
      Alert.alert('Location Error', errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setShowSuggestions(false);
    setInputValue(location.name);
    
    if (location.type !== 'current') {
      saveRecentSearch(location);
    }
    
    onLocationSelect(location);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock size={20} color="#6B7280" />;
      case 'popular':
        return <Star size={20} color="#F59E0B" />;
      case 'hotel':
        return <Building size={20} color="#8B5CF6" />;
      case 'landmark':
        return <MapIcon size={20} color="#10B981" />;
      case 'address':
        return <MapPin size={20} color="#EF4444" />;
      case 'current':
        return <Navigation size={20} color="#3B82F6" />;
      default:
        return <MapPin size={20} color="#6B7280" />;
    }
  };

  const renderSuggestionItem = (location: Location) => (
    <TouchableOpacity 
      key={location.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
        backgroundColor: 'white',
      }}
      onPress={() => handleLocationSelect(location)}
    >
      <View style={{ marginRight: 12 }}>
        {getLocationIcon(location.type)}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 16, 
          color: '#111827', 
          fontWeight: '600',
          marginBottom: 2 
        }}>
          {location.name}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#6B7280' 
        }}>
          {location.description}
        </Text>
        {location.rating && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: 4 
          }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ 
              fontSize: 12, 
              color: '#6B7280', 
              marginLeft: 4 
            }}>
              {location.rating}
            </Text>
          </View>
        )}
      </View>
      {location.type === 'popular' && (
        <View style={{
          backgroundColor: '#DBEAFE',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ 
            fontSize: 12, 
            color: '#2563EB',
            fontWeight: '500'
          }}>
            Popular
          </Text>
        </View>
      )}
      {location.type === 'current' && (
        <View style={{
          backgroundColor: '#D1FAE5',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ 
            fontSize: 12, 
            color: '#059669',
            fontWeight: '500'
          }}>
            Current
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCurrentLocationButton = () => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
        backgroundColor: '#EFF6FF',
      }}
      onPress={getCurrentLocation}
      disabled={isGettingLocation || !isOnline}
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
          fontWeight: '600' 
        }}>
          {isGettingLocation ? 'Getting location...' : 'Use current location'}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#3B82F6' 
        }}>
          {!isOnline ? 'No internet connection' : 'Find hotels near you'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, onAction?: () => void, actionText?: string) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
      }}>
        {title}
      </Text>
      {onAction && actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{
            fontSize: 12,
            color: '#2563EB',
            fontWeight: '500',
          }}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={{
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {!isOnline ? (
        <>
          <WifiOff size={32} color="#EF4444" />
          <Text style={{
            color: '#EF4444',
            marginTop: 8,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '500',
          }}>
            No internet connection
          </Text>
          <Text style={{
            color: '#6B7280',
            textAlign: 'center',
            fontSize: 14,
            marginTop: 4,
          }}>
            Check your connection and try again
          </Text>
        </>
      ) : (
        <>
          <Search size={32} color="#9CA3AF" />
          <Text style={{
            color: '#6B7280',
            marginTop: 8,
            textAlign: 'center',
            fontSize: 16,
          }}>
            Search for cities, hotels, landmarks, or addresses
          </Text>
        </>
      )}
    </View>
  );

  // API key validation
  if (!googleApiKey) {
    return (
      <View style={{
        padding: 16,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
        margin: 16,
      }}>
        <Text style={{
          color: '#DC2626',
          fontSize: 16,
          fontWeight: '600',
        }}>
          Error: Google API Key Required
        </Text>
        <Text style={{
          color: '#EF4444',
          fontSize: 14,
          marginTop: 4,
        }}>
          Please provide a valid Google Places API key
        </Text>
      </View>
    );
  }

  return (
    <View style={{ position: 'relative' }}>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder={placeholder}
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
          types: '(cities)|establishment|tourist_attraction',
          components: `country:${countryCode}`,
        }}
        fetchDetails={true}
        enablePoweredByContainer={false}
        debounce={300}
        minLength={2}
        styles={{
          container: {
            flex: 0,
            zIndex: 1,
          },
          textInputContainer: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            height: 56,
          },
          textInput: {
            height: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            backgroundColor: '#F8FAFC',
            paddingLeft: 48,
            paddingRight: 16,
            fontSize: 16,
            color: '#0F172A',
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            marginTop: 4,
            maxHeight: 300,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          row: {
            backgroundColor: 'white',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          },
          separator: {
            height: 1,
            backgroundColor: '#F3F4F6',
          },
          description: {
            fontSize: 16,
            color: '#111827',
            fontWeight: '500',
          },
        }}
        textInputProps={{
          onFocus: () => setShowSuggestions(true),
          onBlur: () => {
            // Delay hiding suggestions to allow for tap events
            setTimeout(() => setShowSuggestions(false), 200);
          },
          placeholderTextColor: '#94A3B8',
          onChangeText: (text) => {
            setInputValue(text);
            // Show suggestions when user starts typing
            if (text.length === 0) {
              setShowSuggestions(true);
            }
          },
          value: inputValue,
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
              fontSize: 14 
            }}>
              No results found
            </Text>
          </View>
        )}
      />
      
      {/* Custom suggestions overlay */}
      {showSuggestions && inputValue.length === 0 && (
        <View style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          marginTop: 4,
          maxHeight: 400,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          zIndex: 1000,
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Current Location Button */}
            {showCurrentLocation && renderCurrentLocationButton()}
            
            {/* Recent Searches */}
            {showRecentSearches && recentSearches.length > 0 && (
              <>
                {renderSectionHeader('Recent Searches', clearRecentSearches, 'Clear')}
                {recentSearches.map(renderSuggestionItem)}
              </>
            )}
            
            {/* Popular Destinations */}
            {showPopularDestinations && popularDestinations.length > 0 && (
              <>
                {renderSectionHeader('Popular Destinations', refreshPopularDestinations, 'Refresh')}
                {popularDestinations.map(renderSuggestionItem)}
              </>
            )}
            
            {/* Empty State */}
            {!showRecentSearches && !showPopularDestinations && !showCurrentLocation && renderEmptyState()}
          </ScrollView>
        </View>
      )}
    </View>
  );
}