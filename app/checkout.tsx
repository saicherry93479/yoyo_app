import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShadowVisible: false,
            headerTitle: () => (
                <Text className="text-xl text-[#121516]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>CHECKOUT</Text>
            ),
            headerTitleAlign: 'center',
        });
    }, [navigation]);
    const BackIcon = () => (
        <Svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
        </Svg>
    );

    const RoomIcon = () => (
        <Svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <Path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H80V80H48ZM96,208V160H160v48Zm80-128v64H96V80a16,16,0,0,1,16-16h48A16,16,0,0,1,176,80ZM48,96H80v48H48Zm160,96H176V160h32v32Zm0-48H176V96h32v48Z" />
        </Svg>
    );

    const VisaIcon = () => (
        <Svg width="48" height="32" viewBox="0 0 38 24">
            <Path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07" />
            <Path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff" />
            <Path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm-5.5 7.5c.3-1.1.5-1.8.6-2.2l-2.8-5.3h2.2l1.2 2.8 1.1-2.8h2l-2.1 6.6c-.2.6-.4 1.1-.7 1.6l-1.9-1.6c.2-.5.4-.9.5-1.3zm-14.2-7.5h-2.2l-3.6 8.9c-.2.5-.3.7-.3.7h1.6l.5-1.4h2.5l.3 1.4h1.9l-2.1-8.9zm-2.2 5.6l1-2.5.8 2.5h-1.8z" fill="#01579B" />
            <Path d="M12.2 12.2c-.3-2.5-.9-4.8-2.8-4.8s-2.5 2.3-2.8 4.8c.2-2.3.8-4.1 2.3-4.1s2.1 1.8 2.3 4.1zm-3.9 5.3c.3.4.8.6 1.3.6s1-.2 1.3-.6c-.2.4-.6.7-1.3.7s-1.1-.3-1.3-.7z" fill="#F79E1B" />
        </Svg>
    );

    const ChevronIcon = () => (
        <Svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <Path d="M96,48H208a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm112,56H96a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Zm0,64H96a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16ZM48,80a20,20,0,1,0-20-20A20,20,0,0,0,48,80Zm0,64a20,20,0,1,0-20-20A20,20,0,0,0,48,144Zm0,64a20,20,0,1,0-20-20A20,20,0,0,0,48,208Z" />
        </Svg>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-between">
                {/* Header */}
              

                {/* Scrollable Content */}
                <ScrollView className="flex-1 px-6 py-6">
                    {/* Room Card */}
                    <View className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <View className="w-24 h-24 rounded-xl overflow-hidden">
                            <Image
                                source={{
                                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFPMR2qOcqvc2StCtGaa7NWcqX_cY0EQtWk4lqBdXM_crXbVqONxmPO0EMIGpbIRNtrrSvQU0S3yQU6FX51O-RfFJ0C7B3KNEm80etZX3nUvp2dyVr09Ap4QlAJHEPPdu4Hjp22eJAfpXR8gkSGicqsDK_XJcvIOmNDRtDnOeTO7mmNjyt3-jQ_AeyK8Gy2iUA3urgvym3vEOsqDqZQN0Mr3OoeG8DK_sx59bhlMYK3RvL8l3keMXLU4E9KyyGy3LVn-v2QOwy9Q"
                                }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-gray-500 text-xs uppercase tracking-wider" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                                The Grand Majestic Hotel
                            </Text>
                            <Text className="text-[#161312] text-lg  mt-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Deluxe King Room
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <View className="text-gray-500">
                                    <RoomIcon />
                                </View>
                                <Text className="text-gray-500 text-sm ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    1 Room
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-100 -mx-6 mb-6" />

                    {/* Your Trip Section */}
                    <View className="mb-6">
                        <Text className="text-[#161312] text-lg  mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Your Trip
                        </Text>
                        <View className="gap-4">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Dates
                                    </Text>
                                    <Text className="text-[#161312] font-semibold" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        July 15 - 20, 2024
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-[#e1a9a1] text-sm " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Guests
                                    </Text>
                                    <Text className="text-[#161312] font-semibold" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        2 guests
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-[#e1a9a1] text-sm " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-100 -mx-6 mb-6" />

                    {/* Price Details Section */}
                    <View className="mb-6">
                        <Text className="text-[#161312] text-lg  mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Price Details
                        </Text>
                        <View className="gap-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    5 nights
                                </Text>
                                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    $1,250.00
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Taxes and fees
                                </Text>
                                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    $125.00
                                </Text>
                            </View>
                            <View className="border-t border-gray-100 pt-2">
                                <View className="flex-row justify-between">
                                    <Text className="text-[#161312] text-base " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                        Total
                                    </Text>
                                    <Text className="text-[#161312] text-base " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                        $1,375.00
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-100 -mx-6 mb-6" />

                    {/* Pay with Section */}
                    {/* <View className="mb-6">
                        <Text className="text-[#161312] text-lg  mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Pay with
                        </Text>
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <View className="flex-row items-center">
                                <VisaIcon />
                                <Text className="text-[#161312] font-semibold ml-4" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    Visa ending in 1234
                                </Text>
                            </View>
                            <View className="text-gray-400">
                                <ChevronIcon />
                            </View>
                        </TouchableOpacity>
                    </View> */}

                    {/* Divider */}
                    <View className="h-px bg-gray-100 -mx-6 mb-6" />

                    {/* Cancellation Policy Section */}
                    <View className="mb-6">
                        <Text className="text-[#161312] text-lg  mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Cancellation Policy
                        </Text>
                        <Text className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Cancel before{' '}
                            <Text className="font-semibold text-gray-800" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Jul 10, 2024
                            </Text>
                            {' '}for a partial refund. After that, this reservation is non-refundable.{' '}
                            <Text className="text-[#e1a9a1] " style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Learn more
                            </Text>
                        </Text>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="px-4 py-4 border-t border-gray-100 bg-white">
                    <TouchableOpacity className="bg-[#e1a9a1] rounded-full h-14 flex-row items-center justify-center shadow-lg">
                        <Text className="text-white text-base  tracking-wide" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Confirm and Pay
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CheckoutScreen;