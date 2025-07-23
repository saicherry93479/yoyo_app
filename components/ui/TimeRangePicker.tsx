import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Clock, Calendar, X, RotateCcw } from 'lucide-react-native';

interface TimeRange {
  selectedDate: string | null;
  startDateTime: string | null; // Full ISO datetime string
  endDateTime: string | null;   // Full ISO datetime string
  startTime: string | null;     // Display time (for UI)
  endTime: string | null;       // Display time (for UI)
}

interface TimeRangePickerProps {
  value: TimeRange;
  onTimeRangeSelect: (timeRange: TimeRange) => void;
  placeholder?: string;
}

export function TimeRangePicker({ 
  value, 
  onTimeRangeSelect, 
  placeholder = "Select date and time range"
}: TimeRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<TimeRange>(value);
  const [currentStep, setCurrentStep] = useState<'date' | 'time'>('date');
  const [timeSelectionMode, setTimeSelectionMode] = useState<'start' | 'end' | null>(null);

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      dates.push({
        value: dateString,
        display: displayDate,
        isToday: i === 0
      });
    }
    return dates;
  };

  // Generate time slots from selected date 12:00 AM to next day 12:00 PM (36 hours)
  const generateTimeSlots = () => {
    const slots = [];
    
    if (!selectedData.selectedDate) return slots;
    
    const selectedDate = new Date(selectedData.selectedDate + 'T00:00:00');
    
    // Generate 36 hours of slots (from 12:00 AM to next day 12:00 PM)
    for (let hour = 0; hour < 36; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(selectedDate);
        slotDate.setHours(hour, minute, 0, 0);
        
        const currentHour = hour % 24;
        const isNextDay = hour >= 24;
        
        const timeString = `${currentHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeString, isNextDay);
        
        slots.push({ 
          value: timeString,
          display: displayTime,
          actualHour: hour,
          fullDateTime: slotDate.toISOString(),
          isNextDay
        });
      }
    }
    return slots;
  };

  const formatTime = (timeString: string, isNextDay: boolean = false) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const nextDayIndicator = isNextDay ? ' +1' : '';
    return `${displayHour}:${minute} ${period}${nextDayIndicator}`;
  };

  const getDisplayText = () => {
    if (selectedData.selectedDate && selectedData.startTime && selectedData.endTime) {
      const date = new Date(selectedData.selectedDate);
      const dateDisplay = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      return `${dateDisplay}: ${selectedData.startTime} - ${selectedData.endTime}`;
    } else if (selectedData.selectedDate) {
      const date = new Date(selectedData.selectedDate);
      const dateDisplay = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return `${dateDisplay}: Select time range`;
    }
    return placeholder;
  };

  const handleDateSelect = (dateValue: string) => {
    setSelectedData({
      selectedDate: dateValue,
      startDateTime: null,
      endDateTime: null,
      startTime: null,
      endTime: null
    });
    setCurrentStep('time');
    setTimeSelectionMode(null);
  };

  const handleTimeSelect = (slot: any) => {
    if (timeSelectionMode === 'start' || (!selectedData.startDateTime && !timeSelectionMode)) {
      // Select start time
      setSelectedData({
        ...selectedData,
        startDateTime: slot.fullDateTime,
        startTime: slot.display,
        // Clear end time if it's before the new start time
        endDateTime: selectedData.endDateTime && new Date(selectedData.endDateTime) <= new Date(slot.fullDateTime) ? null : selectedData.endDateTime,
        endTime: selectedData.endDateTime && new Date(selectedData.endDateTime) <= new Date(slot.fullDateTime) ? null : selectedData.endTime
      });
      setTimeSelectionMode(null);
    } else if (timeSelectionMode === 'end' || (!selectedData.endDateTime && selectedData.startDateTime)) {
      // Select end time - validate it's after start time
      if (selectedData.startDateTime && new Date(slot.fullDateTime) <= new Date(selectedData.startDateTime)) {
        Alert.alert(
          'Invalid Time Range',
          'End time must be after start time.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      setSelectedData({
        ...selectedData,
        endDateTime: slot.fullDateTime,
        endTime: slot.display
      });
      setTimeSelectionMode(null);
    }
  };

  const handleConfirm = () => {
    if (selectedData.selectedDate && selectedData.startDateTime && selectedData.endDateTime) {
      console.log('selectdata ',selectedData)
      onTimeRangeSelect(selectedData);
      setIsModalVisible(false);
    }
  };

  const handleClear = () => {
    const clearedData = { 
      selectedDate: null, 
      startDateTime: null, 
      endDateTime: null,
      startTime: null,
      endTime: null
    };
    setSelectedData(clearedData);
    onTimeRangeSelect(clearedData);
    setCurrentStep('date');
    setTimeSelectionMode(null);
  };

  const handleClearTimes = () => {
    setSelectedData({
      ...selectedData,
      startDateTime: null,
      endDateTime: null,
      startTime: null,
      endTime: null
    });
    setTimeSelectionMode(null);
  };

  const handleBackToDate = () => {
    setCurrentStep('date');
    setTimeSelectionMode(null);
  };

  const handleEditStartTime = () => {
    setTimeSelectionMode('start');
  };

  const handleEditEndTime = () => {
    setTimeSelectionMode('end');
  };

  const dateOptions = generateDateOptions();
  const timeSlots = generateTimeSlots();

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => {
          setIsModalVisible(true);
          setCurrentStep(selectedData.selectedDate ? 'time' : 'date');
          setTimeSelectionMode(null);
        }}
      >
        <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
          {currentStep === 'date' || !selectedData.selectedDate ? (
            <Calendar size={20} color="#94A3B8" />
          ) : (
            <Clock size={20} color="#94A3B8" />
          )}
        </View>
        <View className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 justify-center">
          <Text 
            className={`text-base ${selectedData.selectedDate ? 'text-slate-900' : 'text-slate-400'}`}
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
              {currentStep === 'date' ? 'Select date' : 'Select time range'}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {currentStep === 'date' ? (
            /* Date Selection */
            <View className="flex-1 px-4 py-4">
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                  <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    Choose a date
                  </Text>
                  
                  <View className="space-y-2">
                    {dateOptions.map((date) => {
                      const isSelected = selectedData.selectedDate === date.value;
                      
                      return (
                        <TouchableOpacity
                          key={date.value}
                          className={`w-full py-4 px-4 rounded-lg border ${
                            isSelected
                              ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                              : 'bg-white border-gray-200'
                          }`}
                          onPress={() => handleDateSelect(date.value)}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text 
                              className={`text-base ${
                                isSelected ? 'text-white' : 'text-gray-900'
                              }`}
                              style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            >
                              {date.display}
                            </Text>
                            {date.isToday && (
                              <Text 
                                className={`text-sm ${
                                  isSelected ? 'text-white' : 'text-[#FF5A5F]'
                                }`}
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                              >
                                Today
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : (
            /* Time Selection */
            <View className="flex-1 px-4 py-4">
              {/* Selected Date Display */}
              <TouchableOpacity 
                className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg"
                onPress={handleBackToDate}
              >
                <Calendar size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  {selectedData.selectedDate && new Date(selectedData.selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <Text className="text-xs text-gray-400 ml-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  (Tap to change)
                </Text>
              </TouchableOpacity>

              {/* Time Selection Mode Indicator */}
              {timeSelectionMode && (
                <View className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Text className="text-sm text-blue-700 text-center" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    {timeSelectionMode === 'start' ? 'Select start time' : 'Select end time'}
                  </Text>
                </View>
              )}

              {/* Current Selection Display with Edit Options */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                      Start Time
                    </Text>
                    {selectedData.startTime && (
                      <TouchableOpacity onPress={handleEditStartTime}>
                        <Text className="text-xs text-[#FF5A5F]" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                          Change
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity 
                    className={`h-12 rounded-lg border px-3 justify-center ${
                      timeSelectionMode === 'start' ? 'border-[#FF5A5F] bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={handleEditStartTime}
                  >
                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      {selectedData.startTime || 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1 ml-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                      End Time
                    </Text>
                    {selectedData.endTime && (
                      <TouchableOpacity onPress={handleEditEndTime}>
                        <Text className="text-xs text-[#FF5A5F]" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                          Change
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity 
                    className={`h-12 rounded-lg border px-3 justify-center ${
                      timeSelectionMode === 'end' ? 'border-[#FF5A5F] bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={handleEditEndTime}
                  >
                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      {selectedData.endTime || 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Clear Times Button */}
              {(selectedData.startTime || selectedData.endTime) && (
                <TouchableOpacity 
                  className="flex-row items-center justify-center mb-4 p-2 bg-gray-100 rounded-lg"
                  onPress={handleClearTimes}
                >
                  <RotateCcw size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                    Clear selected times
                  </Text>
                </TouchableOpacity>
              )}

              {/* Time Slots Grid */}
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                  <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    Available Times (12:00 AM - Next Day 12:00 PM)
                  </Text>
                  
                  <View className="flex-row flex-wrap justify-between">
                    {timeSlots.map((slot) => {
                      const isStartSelected = selectedData.startDateTime === slot.fullDateTime;
                      const isEndSelected = selectedData.endDateTime === slot.fullDateTime;
                      const isDisabled = selectedData.startDateTime && 
                        new Date(slot.fullDateTime) <= new Date(selectedData.startDateTime) && 
                        !isStartSelected &&
                        timeSelectionMode !== 'start';
                      
                      return (
                        <TouchableOpacity
                          key={slot.fullDateTime}
                          className={`w-[48%] mb-2 py-3 px-4 rounded-lg border ${
                            isStartSelected || isEndSelected
                              ? 'bg-[#FF5A5F] border-[#FF5A5F]'
                              : isDisabled
                              ? 'bg-gray-100 border-gray-200'
                              : 'bg-white border-gray-200'
                          }`}
                          onPress={() => {
                            if (isDisabled) return;
                            handleTimeSelect(slot);
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
          )}

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            {currentStep === 'date' ? (
              <TouchableOpacity
                className={`w-full h-12 rounded-lg items-center justify-center ${
                  selectedData.selectedDate 
                    ? 'bg-[#FF5A5F]' 
                    : 'bg-gray-200'
                }`}
                onPress={() => selectedData.selectedDate && setCurrentStep('time')}
                disabled={!selectedData.selectedDate}
              >
                <Text 
                  className={`text-base ${
                    selectedData.selectedDate 
                      ? 'text-white' 
                      : 'text-gray-400'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  Continue to time selection
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`w-full h-12 rounded-lg items-center justify-center ${
                  selectedData.selectedDate && selectedData.startDateTime && selectedData.endDateTime 
                    ? 'bg-[#FF5A5F]' 
                    : 'bg-gray-200'
                }`}
                onPress={handleConfirm}
                disabled={!selectedData.selectedDate || !selectedData.startDateTime || !selectedData.endDateTime}
              >
                <Text 
                  className={`text-base ${
                    selectedData.selectedDate && selectedData.startDateTime && selectedData.endDateTime 
                      ? 'text-white' 
                      : 'text-gray-400'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  Confirm selection
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}