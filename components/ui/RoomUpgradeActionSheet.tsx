import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { X } from 'lucide-react-native';

interface Room {
  id: string;
  name: string;
  image: string;
  features: string;
  pricePerNight: number;
  isCurrent?: boolean;
}

interface RoomUpgradeData {
  currentRoom: Room;
  upgradeOptions: Room[];
}

const mockRoomData: RoomUpgradeData = {
  currentRoom: {
    id: 'current',
    name: 'Deluxe Room',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCROdGI9lEadN4VgumREhHepKnXLiPCnY2iesGShlNlwyH2NWLnSB5cE6KbsnuPkmfvsNNBmQKHRkbPYmeA6RUADf7L6iRlll5cmS-jSFD1iLvooFTA-o1uyuWAjdymwqd6yW060SwbQqgxDsG1R0CIHMHCNWMSChpZC27bsuR-o1ReNM-bFewZN6ah9TX50ma-aq3J22x7YKnJies1AIU8D4T1kUauetQeOrZkRZEMHojp7EUIkd9pElqC3sUUAzMsPZeP9voX0w',
    features: '1 King Bed',
    pricePerNight: 0,
    isCurrent: true,
  },
  upgradeOptions: [
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5e3pjxJ-dsPjEHObFyhrempcttb637eznJuhu0cvPphdoh0yAfrhE4L8_Hxl4XxN-wcevXQGVYNW_e2etdEql8n-zfzhLqsqGkaO-iCDjyUz1tQaVZlk4VmOn5jDSRgMhGT4Y8ECfmT6ClnD6NHFVmGGTUxdvYAoWAqf7gvyXb8p4ZFaR1JjD9Mk7-Ou23ys6D6QP24FVNXw30c45GGek2yt5-zCOfgnPzVavj5LUfuHDPQYCfsszeZEpbc_fYTLgySNrs_76_Q',
      features: '350 sq ft · Free WiFi · City View',
      pricePerNight: 25,
    },
    {
      id: 'executive',
      name: 'Executive Suite',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlFbnUU28YAt5IUNhtI6SJtHwRyx9zB8yPXvZJTpRcNHCS87mbbytgFU4JIx9aaOC4L0ykL89-vAJM507kZqUCGvHD1yryck9SDcOSvNANvEQc1_4L42jkfYt0efj8Y4tTUH0QAZhU6W1sFa6FKRA2BszGFla01C0Se0S_719MTJqZoLT0iEn7DkVvRE-l3yRZXXSQuJ2QA_WBQynZh2Ny5r4bIOCYUYBy9O6-tq7c4WAl0GbjKNfBSu2QxaL_bJNhnMXaRW85g',
      features: '400 sq ft · Free WiFi · Balcony',
      pricePerNight: 45,
    },
    {
      id: 'presidential',
      name: 'Presidential Suite',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMAhrZ1lH8-MFJks-PV0HjhEHgt8M24qTc-KAkFyoG8lyLftZ-98I5R6Ec_L2aNobsHkDEeRqNAyCFsXanmXIRGhAT_rdyEa-dC4gK-gyNx3axrVKwBYa4bgouBg9bOmzWyaj6-PRFNypeTT3zES5oUlK1sdQClqE2DZAJAuEoXESAF6REvykdcc9YMmwekHiIQX4kJeW9y1B4axbySr5CAAfDPDLjvc0anNEdkTrcHl1j3Rd5LUfEjs2bmCEUTnLXrv9IwSlWbA',
      features: '500 sq ft · Free WiFi · Ocean View',
      pricePerNight: 75,
    },
  ],
};

interface RoomUpgradeActionSheetProps {
  sheetId: string;
  roomData?: RoomUpgradeData;
  onRoomSelect?: (room: Room) => void;
  onNoThanks?: () => void;
  payload?: {
    roomData?: RoomUpgradeData;
    selectedRoom?: Room;
    onRoomSelect?: (room: Room) => void;
  };
}

export function RoomUpgradeActionSheet({ 
  sheetId, 
  roomData,
  onRoomSelect,
  onNoThanks,
  payload 
}: RoomUpgradeActionSheetProps) {
  const actualRoomData = payload?.roomData || roomData || mockRoomData;
  const selectedRoom = payload?.selectedRoom;
  const handleRoomSelection = payload?.onRoomSelect || onRoomSelect;

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleRoomSelect = (room: Room) => {
    handleRoomSelection?.(room);
    handleClose();
  };

  const handleNoThanks = () => {
    onNoThanks?.();
    handleClose();
  };

  // Get base price for comparison (current or selected room)
  const getBasePrice = () => {
    if (selectedRoom) return selectedRoom.pricePerNight;
    return actualRoomData.currentRoom?.pricePerNight || 0;
  };

  // Calculate price difference
  const getPriceDifference = (roomPrice: number) => {
    const basePrice = getBasePrice();
    return roomPrice - basePrice;
  };

  const renderCurrentRoom = () => {
    const currentRoom = selectedRoom || actualRoomData.currentRoom;
    if (!currentRoom) return null;

    return (
      <View className="flex-row items-center gap-4 bg-white px-6 py-4 border-b border-gray-200">
        <Image
          source={{ uri: currentRoom.image }}
          className="w-16 h-16 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
            {selectedRoom ? 'Selected room' : 'Your current room'}
          </Text>
          <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {currentRoom.name}
          </Text>
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {currentRoom.features}
          </Text>
        </View>
      </View>
    );
  };

  const renderRoomOption = (room: Room, isCurrentlySelected: boolean = false) => {
    const priceDiff = getPriceDifference(room.pricePerNight);
    const isCurrentRoom = room.id === actualRoomData.currentRoom?.id;
    const isSelectedRoom = selectedRoom?.id === room.id;
    const shouldShowSelected = isCurrentlySelected || isSelectedRoom || (isCurrentRoom && !selectedRoom);

    return (
      <TouchableOpacity
        key={room.id}
        onPress={() => handleRoomSelect(room)}
        className={`flex-row items-center gap-4 p-4 border rounded-xl ${
          shouldShowSelected ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}
      >
        <Image
          source={{ uri: room.image }}
          className="w-20 h-20 rounded-lg"
          style={{ resizeMode: 'cover' }}
        />
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {room.name}
            </Text>
            {shouldShowSelected && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {room.features}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              ₹{room.pricePerNight.toLocaleString()}/night
            </Text>
            {priceDiff !== 0 && (
              <Text className={`text-sm ${priceDiff > 0 ? 'text-red-600' : 'text-green-600'}`} style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                {priceDiff > 0 ? '+' : ''}₹{Math.abs(priceDiff).toLocaleString()}/night
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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
    >
      <View className="flex-col items-stretch rounded-t-2xl bg-white">
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center pt-3">
          <View className="h-1.5 w-10 rounded-full bg-gray-300" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-2xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>Upgrade your room</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Current Room */}
        {renderCurrentRoom()}

        {/* Room Options */}
        <ScrollView 
          className="px-6 py-6"
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 400 }}
        >
          <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Available Rooms
          </Text>
          <View className="gap-4">
            {/* Show current room in the list if not selected */}
            {actualRoomData.currentRoom && !selectedRoom && (
              renderRoomOption(actualRoomData.currentRoom, true)
            )}
            {/* Show all upgrade options */}
            {actualRoomData.upgradeOptions?.map(room => renderRoomOption(room))}
            {/* Show selected room if it's different from current */}
            {selectedRoom && selectedRoom.id !== actualRoomData.currentRoom?.id && (
              renderRoomOption(selectedRoom, true)
            )}
          </View>
        </ScrollView>

        {/* No Thanks Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleNoThanks}
            className="w-full h-12 rounded-full bg-gray-100 items-center justify-center"
          >
            <Text className="text-base text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>No thanks</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-5 bg-white" />
      </View>
    </ActionSheet>
  );
}