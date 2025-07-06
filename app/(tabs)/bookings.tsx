import React, { useState, useLayoutEffect } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { Svg, Path } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"

// Plus Icon Component
const PlusIcon = ({ size = 24, color = "#1990E5" }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
)

export default function MyTripsApp() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const navigation = useNavigation()

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible:false,
      headerTitle: () => <View className="flex-row items-center justify-between p-4">
        <View className="w-8"></View>
        <Text className="text-xl font-bold text-center flex-1 text-gray-900">My Trips</Text>
        <TouchableOpacity className="flex items-center justify-center w-8 h-8 rounded-full">
          <PlusIcon size={24} color="#1990E5" />
        </TouchableOpacity>
      </View>
    })
  }, [navigation])

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">


        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 text-center py-3 ${activeTab === 'upcoming' ? 'border-b-2 border-[#1990E5]' : ''}`}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`text-center font-semibold ${activeTab === 'upcoming' ? 'text-[#1990E5]' : 'text-gray-500'}`}>
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 text-center py-3 ${activeTab === 'past' ? 'border-b-2 border-[#1990E5]' : ''}`}
            onPress={() => setActiveTab('past')}
          >
            <Text className={`text-center font-semibold ${activeTab === 'past' ? 'text-[#1990E5]' : 'text-gray-500'}`}>
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-gray-50 p-6">
        <View className="flex-1 flex-col items-center justify-center text-center">
          {/* Luggage Illustration */}
          <View className="mb-6">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDox-c6lfmOvbsmJjoLOTALNua-eoPBhBVBs3K_lYX2mgtaJqF16CCts-UnDW19GlMUJhDFY_kVYuV9WVvUSSp64phjcmM1KLKiT2alSy9x_BO3-TOKYoFzsL3_f2aslXz6ohnEyKbmQU2bIdGNSKk2BvAOQ43-89sQvDxsqFkKo1dNu0FGysXJZtrWYiMnrWllUH7dVB0y1cc8fOqfrGrrcHKhrg_pfudl89OBZEIWFApGFUETVxILMM4Oa0eRfxMj9h0WeWdNfQ"
              }}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
          </Text>

          {/* Description */}
          <Text className="text-gray-600 max-w-xs mx-auto mb-8 text-center">
            {activeTab === 'upcoming'
              ? "It looks like you haven't booked anything yet. Let's find your next destination!"
              : "You haven't completed any trips yet. Start exploring to create amazing memories!"
            }
          </Text>

          {/* CTA Button */}
          <TouchableOpacity className="w-full max-w-xs items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#1990E5] shadow-lg">
            <Text className="text-white text-base font-bold">
              Start Exploring
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}