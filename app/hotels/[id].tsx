import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

const HotelDetails = () => {

    const navigation = useNavigation()

    useLayoutEffect(()=>{
            navigation.setOptions({
                headerShown:false
            })
    },[navigation])
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Header with Background Image */}
      <View className="relative">
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2uTYzO0L3GRFX4La-rHJ76ayo4lExcSUVa6ryaKYO8ge2RCA-q7wVtU0nPk5Qmu5u_CH0xfCTkES_rUNauPJwL9wbZvoutemXXl6nDkPrEUNJUn69e7a8srMGLqNbk6hDXsmgo35YB_ZXHIKvAdTP-0_gApz7vdej-CDaJQLFfynYPRZ3zKxpGFiqQDkMikLC_cxm_jd8WyGmiE9LW7cPBGs6dlti4cbt5O6Nhknf5CfwLK5bKQfJpjZpKM_48hTHbtoMqqP1gA'
          }}
          className="w-full h-80"
          resizeMode="cover"
        />
        
        {/* Overlay */}
        <View className="absolute inset-0 bg-black/40" />
        
        {/* Header Controls */}
        <View className="absolute top-12 left-0 right-0 flex-row items-center justify-between px-4">
          <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          
          <Text className="text-lg text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Details</Text>
          
          <View className="w-10" />
        </View>
        
        {/* Image Indicators */}
        <View className="absolute bottom-5 left-0 right-0 flex-row justify-center gap-2">
          <View className="w-8 h-2 bg-white rounded-full" />
          <View className="w-2 h-2 bg-white/50 rounded-full" />
          <View className="w-2 h-2 bg-white/50 rounded-full" />
          <View className="w-2 h-2 bg-white/50 rounded-full" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Hotel Info */}
        <View className="p-5 pb-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                The Grand Budapest Hotel
              </Text>
              <Text className="mt-1 text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                123 Main Street, Budapest
              </Text>
            </View>
            
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={20} color="#facc15" />
              <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View className="border-t border-b border-stone-200 p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Amenities</Text>
          
          <View className="mt-4 flex-row flex-wrap">
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="wifi" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Free Wi-Fi</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="water" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Swimming Pool</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="fitness" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Fitness Center</Text>
              </View>
            </View>
            
            <View className="w-1/2 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-stone-100 rounded-full items-center justify-center">
                  <Ionicons name="leaf" size={24} color="#57534e" />
                </View>
                <Text className="text-stone-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>Spa</Text>
              </View>
            </View>
          </View>
          
          {/* <TouchableOpacity className="mt-5 flex-row items-center justify-between"> */}
            <TouchableOpacity 
              className="flex-row items-center justify-between w-full"
              onPress={() => SheetManager.show('amenities')}
            >
              <Text className="text-base text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                View All Amenities
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        {/* </View> */}

        {/* Reviews */}
        <View className="border-b border-stone-200 p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Reviews</Text>
          
          <View className="mt-4 flex-row items-center gap-8">
            <View className="items-center gap-1">
              <Text className="text-5xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>4.8</Text>
              <View className="flex-row gap-0.5">
                <Ionicons name="star" size={16} color="#facc15" />
                <Ionicons name="star" size={16} color="#facc15" />
                <Ionicons name="star" size={16} color="#facc15" />
                <Ionicons name="star" size={16} color="#facc15" />
                <Ionicons name="star-outline" size={16} color="#d6d3d1" />
              </View>
              <Text className="text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>234 reviews</Text>
            </View>
            
            <View className="flex-1">
              {[
                { rating: 5, percentage: 70 },
                { rating: 4, percentage: 20 },
                { rating: 3, percentage: 5 },
                { rating: 2, percentage: 3 },
                { rating: 1, percentage: 2 },
              ].map((item) => (
                <View key={item.rating} className="flex-row items-center gap-3 mb-2">
                  <Text className="text-sm text-stone-700 w-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{item.rating}</Text>
                  <View className="flex-1 h-1.5 bg-stone-200 rounded-full">
                    <View
                      className="h-1.5 bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>
                  <Text className="text-sm text-stone-500 w-8" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity  onPress={() => SheetManager.show('reviews')} className="mt-5 flex-row items-center justify-between">
            <Text className="text-base text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              View All Reviews
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Room Upgrades */}
        <View className="p-5">
          <Text className="text-lg text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Room Upgrades</Text>
          
          <View className="mt-4 gap-4">
            <View className="flex-row items-center gap-4 p-4 border border-stone-200 rounded-xl">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfyxfIOBMacLOyDlVCThN5uSQcxXIdinGXTfJL1NdGuYdvSZIH0e2nJnJSK4yF6lxWXqzrYy7_xxzlnqQUvQYb0bF7GQFU3AFhRBQHaDhvvzZNe2R4BAH7IP_Z6FzLumUd89uEwhNhCk3S65lKcxHTuYVLuuu7996kRmkDgzRrwYkdgl-RR8iT2qHgSmksoRmUetDWYFwCaFeql3ZroQDRzXd-ddoQD4Sj2dZQaXT5kxvbvlp3cZ7quXlOE3KTDy2Em6t720jmsg'
                }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-sm text-red-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Upgrade Available
                </Text>
                <Text className="mt-0.5 text-base text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Deluxe Suite
                </Text>
                <Text className="mt-1 text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Spacious suite with city view
                </Text>
                <TouchableOpacity onPressIn={() => SheetManager.show('upgraderoom')} className="mt-2 flex-row items-center gap-1">
                  <Text className="text-sm text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Upgrade</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1c1917" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="flex-row items-center gap-4 p-4 border border-stone-200 rounded-xl">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6VQ0j4vJGSCenenE0QY6NkP5OOTHVd6FEhWho3iSckPS_xK-Lh0Lot36o39q-Lbr4ycSSLoP_Bdx6WP5nqZet8Qnf876Yw4-13VbCxjLRodyTWL2wxbIrdVkwSsXAlUl2QJDYg7HmfI5b2G9Jda-eeyW8mSt2jvoNJ6FjTOUQguK5Zb8dyC6hOYVb40qDvKsSSkMbb_DMhLjOQdqT-wVnpZ_VOKB0MlQXpfa27qqewUkxmKKYUnIOcT9p1h5kSZt7RDPeNFWyOw'
                }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-sm text-stone-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Room Available
                </Text>
                <Text className="mt-0.5 text-base text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Executive Room
                </Text>
                <Text className="mt-1 text-sm text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Business-class room
                </Text>
                <TouchableOpacity onPressIn={() => SheetManager.show('upgraderoom')} className="mt-2 flex-row items-center gap-1">
                  <Text className="text-sm text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Book</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1c1917" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View className="bg-white p-4 shadow-lg border-t border-stone-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl text-stone-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>$250</Text>
            <Text className="text-stone-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>/night</Text>
          </View>
          
          <TouchableOpacity  onPressIn={()=>router.push('checkout')} className="bg-red-600 px-6 py-3 rounded-full">
            <Text className="text-base text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HotelDetails;