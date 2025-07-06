import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// Add Circle Outline Icon
const AddCircleOutlineIcon = ({ size = 24, color = "#6B7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill={color} />
  </Svg>
);

// Heart/Favorite Icon
const FavoriteIcon = ({ size = 24, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
  </Svg>
);

const WishlistScreen = () => {

    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShadowVisible: false,
          headerTitle: () => (
            <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>WhishLists</Text>
          ),
          headerTitleAlign: 'center',
        });
      }, [navigation]);
  const wishlistItems = [
    {
      id: 1,
      location: "Kyoto, Japan",
      type: "Entire cabin",
      dates: "Mar 18 - 22",
      price: "$250",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz8FUZn4utBj-BsdWdx0zuhGNB7AcdzF6MPa-Yo_USJpUd5yCxmwt3eFYXqggKy6eAd9-jWfNA0-bBTp7x0l2qG3aA-oGzyd3K8IgCB3h04B_Svb5uajfSkKSnvTXNi7eSJSPLTyGFtku4BX60MFKB48kBs23xh43n_es_sIPD-1GG96gLmI7mZ8Izd7hnKPAKvg5FHWuyqM-SuINh1tvN1kDkEgWh4YRzhgBgMwU1lxUYdKbd4kX4jz5Mm-rVXOC8ga01dS31zA"
    },
    {
      id: 2,
      location: "Santorini, Greece",
      type: "Beachfront villa",
      dates: "Aug 26 - 30",
      price: "$480",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLlATEfBog3Cff42YfKgtzx7JtVLbKRTaNhEpTd4rka30tpYeT_sf_3QsF3aF-Ww2IPzO7ReBnt6TwqGrIgacHtcyeNaeKxcyns161-ONOoGOu44C_i50Irfy4CjuEoWlJ7oNq7US9KbDSBcL7LjhxFDgfFpZm3kWOar6L7JU9vadhBIirvMlMVYdQ4-69EMQxG6PoBiVwuqypSfBu93OtHuNfkvFG4Y1hyiQWRqLsfIIwJjWQujK9p7g_--uO800Me8c2gDayJg"
    },
    {
      id: 3,
      location: "Rio de Janeiro, Brazil",
      type: "Penthouse apartment",
      dates: "Jun 29 - Jul 3",
      price: "$320",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApEtNg86i6My7-ux27lHtrPI85e8kYLMhn9UirsvK_0vcmpJ9LS4rJROkf8hjMwQ-s3eO0GPPTHMObHEhad8ZUpiHrdpFOJ0enNYKqfiK-5Zq0AwMHsM4gEZjAO9fEvZ5igPPcaifljYLBClgjj4Dx8pGt44K1I2AiTUfX_fYKMpWPMfckaV0zRb3NxLBIvPXmZloGwT0cRe3SW677FsrYNvJ3g2gPBlahZVbDuMnZXfixM419MOAf5RlDlDvXrTa6U8srmfV2Eg"
    },
    {
      id: 4,
      location: "Barcelona, Spain",
      type: "Chic city apartment",
      dates: "Aug 4 - 8",
      price: "$180",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZZ06W77syx4VO6fDACpQH_S-aQSOy5k76-Be2O7syXg-GqxrXcf2DoAnjiYLAhBWNfganWKOcNmcPKMPbZCd9v3Psh7_O0-jjQJTy36s8p8ufwJ17kdlXxh-gzJ5dp_-NZN-5v3lJtz0nuqgquuTvDIWEnEQj-1t5UXORZg7JUazyqAgiJywTB3MmUck0JRyQqMp5ow7NiPZFvNgOYkS-6ooK0pHVXy-t5MaLrh537D5AO4m53Kp0ocE54hDAjG6cQDc3KSvgMg"
    }
  ];

  return (
  
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
     

        {/* Wishlist Items */}
        <View className="px-4 gap-4 ">
          {wishlistItems.map((item) => (
            <View key={item.id} className="flex-row items-start bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              
              <View className="flex-1 ml-4 justify-center">
                <Text 
                  className="text-gray-900 text-lg leading-tight mb-1"
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  {item.location}
                </Text>
                <Text 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                >
                  {item.type}
                </Text>
                <Text 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                >
                  {item.dates}
                </Text>
                <View className="flex-row items-baseline mt-1">
                  <Text 
                    className="text-gray-900 text-base"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    {item.price}
                  </Text>
                  <Text 
                    className="text-gray-900 text-base ml-1"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    night
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity className="p-2">
                <FavoriteIcon size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

  );
};

export default WishlistScreen;