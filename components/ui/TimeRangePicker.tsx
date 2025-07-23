import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
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

export function TimeRangePicker({ 
  value, 
  onTimeRangeSelect, 
  placeholder = "Select time range",
  maxHours = 12 
}: TimeRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<TimeRange>(value);

  // Generate time slots (24-hour format)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeString);
        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const getDisplayText = () => {
    if (selectedTimes.startTime && selectedTimes.endTime) {
      return `${formatTime(selectedTimes.startTime)} - ${formatTime(selectedTimes.endTime)}`;
    } else if (selectedTimes.startTime) {
      return `${formatTime(selectedTimes.startTime)} - End time`;
    }
    return placeholder;
  };

  const calculateHoursDifference = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;
    
    // Handle next day scenario
    if (endTotalMinutes <= startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  const handleTimeSelect = (timeValue: string, type: 'start' | 'end') => {
    if (type === 'start') {
      const newSelectedTimes = { ...selectedTimes, startTime: timeValue };
      
      // Reset end time if it's before start time
      if (selectedTimes.endTime && timeValue >= selectedTimes.endTime) {
        newSelectedTimes.endTime = null;
      }
      
      setSelectedTimes(newSelectedTimes);
    } else {
      // Validate max hours constraint
      if (selectedTimes.startTime) {
        const hoursDiff = calculateHoursDifference(selectedTimes.startTime, timeValue);
        if (hoursDiff > maxHours) {
          Alert.alert(
            'Invalid Time Range',
            `Maximum booking duration is ${maxHours} hours.`,
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      setSelectedTimes({ ...selectedTimes, endTime: timeValue });
    }
  };

  const handleConfirm = () => {
    if (selectedTimes.startTime && selectedTimes.endTime) {
      onTimeRangeSelect(selectedTimes);
      setIsModalVisible(false);
    }
  };

  const handleClear = () => {
    const clearedTimes = { startTime: null, endTime: null };
    setSelectedTimes(clearedTimes);
    onTimeRangeSelect(clearedTimes);
  };

  const timeSlots = generateTimeSlots();

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

          {/* Time Selection */}
          <View className="flex-1 px-4 py-4">
            <View className="flex-row mb-4">
              {/* Start Time */}
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Start Time
                </Text>
                <View className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-3 justify-center">
                  <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    {selectedTimes.startTime ? formatTime(selectedTimes.startTime) : 'Select'}
                  </Text>
                </View>
              </View>

              {/* End Time */}
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  End Time
                </Text>
                <View className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-3 justify-center">
                  <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    {selectedTimes.endTime ? formatTime(selectedTimes.endTime) : 'Select'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Time Slots Grid */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Available Times
                </Text>
                
                <View className="flex-row flex-wrap justify-between">
                  {timeSlots.map((slot) => {
                    const isStartSelected = selectedTimes.startTime === slot.value;
                    const isEndSelected = selectedTimes.endTime === slot.value;
                    const isDisabled = selectedTimes.startTime && slot.value <= selectedTimes.startTime && !isStartSelected;
                    
                    return (
                      <TouchableOpacity
                        key={slot.value}
                        className={`w-[48%] mb-2 py-3 px-4 rounded-lg border ${
                          isStartSelected || isEndSelected
                            ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                            : isDisabled
                            ? 'bg-gray-100 border-gray-200'
                            : 'bg-white border-gray-200'
                        }`}
                        onPress={() => {
                          if (isDisabled) return;
                          
                          if (!selectedTimes.startTime || isStartSelected) {
                            handleTimeSelect(slot.value, 'start');
                          } else if (!selectedTimes.endTime || isEndSelected) {
                            handleTimeSelect(slot.value, 'end');
                          } else {
                            // Reset and start new selection
                            handleTimeSelect(slot.value, 'start');
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <Text 
                          className={`text-center text-sm ${
                            isStartSelected || isEndSelected
                              ? 'text-white'
                              : isDisabled
                              ? 'text-gray-400'
                              : 'text-gray-900'
                          }`}
                          style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                        >
                          {slot.display}
                        </Text>
                        {isStartSelected && (
                          <Text className="text-center text-xs text-white mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Start
                          </Text>
                        )}
                        {isEndSelected && (
                          <Text className="text-center text-xs text-white mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            End
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              className={`w-full h-12 rounded-lg items-center justify-center ${
                selectedTimes.startTime && selectedTimes.endTime 
                  ? 'bg-[#FF5A5F]' 
                  : 'bg-gray-200'
              }`}
              onPress={handleConfirm}
              disabled={!selectedTimes.startTime || !selectedTimes.endTime}
            >
              <Text 
                className={`text-base ${
                  selectedTimes.startTime && selectedTimes.endTime 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
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