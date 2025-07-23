import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Clock, X } from 'lucide-react-native';

interface TimeRange {
  startTime: string | null;
  endTime: string | null;
}

interface TimeRangePickerProps {
  value: TimeRange;
  onTimeRangeSelect: (timeRange: TimeRange) => void;
  placeholder?: string;
  maxHours?: number;
}

const timeSlots = [
  '12:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const formatTime = (time: string) => {
  const hour = parseInt(time.split(':')[0]);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
};

export function TimeRangePicker({ 
  value, 
  onTimeRangeSelect, 
  placeholder = "Select time range",
  maxHours = 12 
}: TimeRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<TimeRange>(value);

  const getDisplayText = () => {
    if (selectedTimes.startTime && selectedTimes.endTime) {
      return `${formatTime(selectedTimes.startTime)} - ${formatTime(selectedTimes.endTime)}`;
    } else if (selectedTimes.startTime) {
      return `${formatTime(selectedTimes.startTime)} - Select end time`;
    }
    return placeholder;
  };

  const onTimePress = (time: string) => {
    if (!selectedTimes.startTime || (selectedTimes.startTime && selectedTimes.endTime)) {
      // Start new selection
      setSelectedTimes({ startTime: time, endTime: null });
    } else if (selectedTimes.startTime && !selectedTimes.endTime) {
      const startHour = parseInt(selectedTimes.startTime.split(':')[0]);
      const endHour = parseInt(time.split(':')[0]);
      
      // Calculate hours difference
      let hoursDiff = endHour - startHour;
      if (hoursDiff <= 0) {
        hoursDiff += 24; // Handle next day scenarios
      }
      
      if (hoursDiff > maxHours) {
        // If exceeds max hours, start new selection
        setSelectedTimes({ startTime: time, endTime: null });
      } else if (endHour <= startHour) {
        // If selected time is before start time, make it the new start time
        setSelectedTimes({ startTime: time, endTime: null });
      } else {
        // Set as end time
        setSelectedTimes({ ...selectedTimes, endTime: time });
      }
    }
  };

  const getTimeSlotStyle = (time: string) => {
    const isStartTime = selectedTimes.startTime === time;
    const isEndTime = selectedTimes.endTime === time;
    const isInRange = selectedTimes.startTime && selectedTimes.endTime && 
      isTimeInRange(time, selectedTimes.startTime, selectedTimes.endTime);

    if (isStartTime || isEndTime) {
      return 'bg-[#FF5A5F] border-[#FF5A5F] text-white';
    } else if (isInRange) {
      return 'bg-red-50 border-red-200 text-[#FF5A5F]';
    } else {
      return 'bg-white border-gray-300 text-gray-700';
    }
  };

  const isTimeInRange = (time: string, startTime: string, endTime: string) => {
    const timeHour = parseInt(time.split(':')[0]);
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    if (endHour > startHour) {
      return timeHour > startHour && timeHour < endHour;
    } else {
      // Handle overnight range
      return timeHour > startHour || timeHour < endHour;
    }
  };

  const handleConfirm = () => {
    onTimeRangeSelect(selectedTimes);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    const clearedTimes = { startTime: null, endTime: null };
    setSelectedTimes(clearedTimes);
    onTimeRangeSelect(clearedTimes);
  };

  const isConfirmEnabled = selectedTimes.startTime && selectedTimes.endTime;

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
          <Clock size={20} color="#94A3B8" />
        </View>
        <View className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 justify-center">
          <Text 
            className={`text-base ${selectedTimes.startTime ? 'text-slate-900' : 'text-slate-400'}`}
            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          >
            {getDisplayText()}
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
            <TouchableOpacity onPress={handleClear}>
              <Text className="text-base text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Clear
              </Text>
            </TouchableOpacity>
            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Select time range
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <Text className="text-sm text-blue-800" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Select start and end time (maximum {maxHours} hours)
            </Text>
          </View>

          {/* Time Grid */}
          <ScrollView className="flex-1 px-4 py-4">
            <View className="flex-row flex-wrap gap-3">
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={`${time}-${index}`}
                  className={`px-4 py-3 rounded-lg border min-w-[80px] items-center ${getTimeSlotStyle(time)}`}
                  onPress={() => onTimePress(time)}
                >
                  <Text 
                    className={`text-sm ${getTimeSlotStyle(time).includes('text-white') ? 'text-white' : 
                      getTimeSlotStyle(time).includes('text-[#FF5A5F]') ? 'text-[#FF5A5F]' : 'text-gray-700'}`}
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    {formatTime(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              className={`w-full h-12 rounded-lg items-center justify-center ${
                isConfirmEnabled ? 'bg-[#FF5A5F]' : 'bg-gray-200'
              }`}
              onPress={handleConfirm}
              disabled={!isConfirmEnabled}
            >
              <Text 
                className={`text-base ${isConfirmEnabled ? 'text-white' : 'text-gray-400'}`}
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Confirm time range
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}