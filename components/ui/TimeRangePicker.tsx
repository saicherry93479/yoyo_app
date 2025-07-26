import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Clock, Calendar, X, ChevronRight, MapPin } from 'lucide-react-native';

interface TimeRange {
  selectedDate: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  startTime: string | null;
  endTime: string | null;
}

interface TimeRangePickerProps {
  value: TimeRange;
  onTimeRangeSelect: (timeRange: TimeRange) => void;
  placeholder?: string;
  minHours?: number; // Minimum booking duration in hours
  visible?: boolean; // External control for modal visibility
  onClose?: () => void; // Callback when modal should close
}

export function TimeRangePicker({ 
  value, 
  onTimeRangeSelect, 
  placeholder = "Select check-in & check-out",
  minHours = 2,
  visible = false,
  onClose
}: TimeRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [selectedData, setSelectedData] = useState<TimeRange>(value);
  const [currentStep, setCurrentStep] = useState<'date' | 'checkin' | 'checkout'>('date');

  // Update modal visibility when prop changes
  useEffect(() => {
    setIsModalVisible(visible);
    if (visible) {
      setCurrentStep('date');
      setSelectedData(value);
    }
  }, [visible, value]);

  // Get current time rounded to next hour
  const getCurrentTimeSlot = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0); // Round to next hour
    return now;
  };

  // Generate available dates (today + next 7 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      let displayDate;
      
      if (i === 0) {
        displayDate = 'Today';
      } else if (i === 1) {
        displayDate = 'Tomorrow';
      } else {
        displayDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
      
      dates.push({
        value: dateString,
        display: displayDate,
        fullDate: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return dates;
  };

  // Generate time slots based on selected date
  const generateTimeSlots = (isCheckout = false) => {
    const slots = [];
    
    if (!selectedData.selectedDate) return slots;
    
    const [year, month, day] = selectedData.selectedDate.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const isToday = selectedData.selectedDate === new Date().toISOString().split('T')[0];
    
    if (isCheckout && selectedData.startDateTime) {
      // For checkout, generate fixed duration options: 3hrs, 6hrs, 9hrs
      const checkinTime = new Date(selectedData.startDateTime);
      const durations = [3, 6, 9]; // Fixed duration options in hours
      
      durations.forEach(duration => {
        const checkoutTime = new Date(checkinTime.getTime() + duration * 60 * 60 * 1000);
        
        // Check if checkout time is valid (not too late in the day)
        if (checkoutTime.getHours() <= 21) { // Don't allow checkout after 9 PM
          const timeString = `${checkoutTime.getHours().toString().padStart(2, '0')}:00`;
          const isNextDay = checkoutTime.getDate() !== checkinTime.getDate();
          const displayTime = formatTime(timeString, isNextDay);
          
          const localDateTime = checkoutTime.getFullYear() + '-' + 
            String(checkoutTime.getMonth() + 1).padStart(2, '0') + '-' + 
            String(checkoutTime.getDate()).padStart(2, '0') + 'T' + 
            String(checkoutTime.getHours()).padStart(2, '0') + ':00:00';
          
          slots.push({ 
            value: timeString,
            display: `${displayTime} (${duration}hrs)`,
            fullDateTime: localDateTime,
            isNextDay,
            actualDate: checkoutTime,
            duration
          });
        }
      });
      
      return slots;
    }
    
    // For check-in, generate hourly slots
    let startHour = 6; // Start from 6 AM
    
    // If today, start from current time + 1 hour but not before 6 AM
    if (isToday) {
      const currentSlot = getCurrentTimeSlot();
      startHour = Math.max(6, currentSlot.getHours());
    }
    
    // Generate check-in slots from 6 AM to 6 PM (18:00)
    for (let hour = startHour; hour <= 18; hour++) {
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hour, 0, 0, 0);
      
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = formatTime(timeString, false);
      
      const localDateTime = slotDate.getFullYear() + '-' + 
        String(slotDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(slotDate.getDate()).padStart(2, '0') + 'T' + 
        String(slotDate.getHours()).padStart(2, '0') + ':00:00';
      
      slots.push({ 
        value: timeString,
        display: displayTime,
        fullDateTime: localDateTime,
        isNextDay: false,
        actualDate: slotDate
      });
    }
    
    return slots;
  };

  const formatTime = (timeString: string, isNextDay: boolean = false) => {
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const nextDayIndicator = isNextDay ? ' +1' : '';
    return `${displayHour}:00 ${period}${nextDayIndicator}`;
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
      return `${dateDisplay}: Select times`;
    }
    return placeholder;
  };

  const calculateDuration = () => {
    if (!selectedData.startDateTime || !selectedData.endDateTime) return '';
    
    const start = new Date(selectedData.startDateTime);
    const end = new Date(selectedData.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} min`;
    } else if (diffHours === 1) {
      return '1 hour';
    } else if (diffHours % 1 === 0) {
      return `${diffHours} hours`;
    } else {
      const hours = Math.floor(diffHours);
      const minutes = Math.round((diffHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const handleDateSelect = (dateValue: string) => {
    setSelectedData({
      selectedDate: dateValue,
      startDateTime: null,
      endDateTime: null,
      startTime: null,
      endTime: null
    });
    setCurrentStep('checkin');
  };

  const handleCheckinSelect = (slot: any) => {
    setSelectedData({
      ...selectedData,
      startDateTime: slot.fullDateTime,
      startTime: slot.display,
      endDateTime: null,
      endTime: null
    });
    setCurrentStep('checkout');
  };

  const handleCheckoutSelect = (slot: any) => {
    const start = new Date(selectedData.startDateTime!);
    const end = new Date(slot.fullDateTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < minHours) {
      Alert.alert(
        'Minimum Booking Duration',
        `Minimum booking duration is ${minHours} hours.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedData({
      ...selectedData,
      endDateTime: slot.fullDateTime,
      endTime: slot.display
    });
  };

  const handleConfirm = () => {
    if (selectedData.selectedDate && selectedData.startDateTime && selectedData.endDateTime) {
      onTimeRangeSelect(selectedData);
      setIsModalVisible(false);
      onClose?.();
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
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    onClose?.();
  };

  const dateOptions = generateDateOptions();
  const checkinSlots = generateTimeSlots(false);
  const checkoutSlots = generateTimeSlots(true);

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => {
          setIsModalVisible(true);
          setCurrentStep('date'); // Always start from step 1
        }}
      >
        <View className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
          <View className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-black rounded-full items-center justify-center mr-3">
              <Clock size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                HOURLY BOOKING
              </Text>
              <Text 
                className={`text-sm ${selectedData.selectedDate ? 'text-gray-900' : 'text-gray-400'}`}
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                {getDisplayText()}
              </Text>
              {selectedData.startDateTime && selectedData.endDateTime && (
                <Text className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Duration: {calculateDuration()}
                </Text>
              )}
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white px-6 py-5 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClear}>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                  Clear
                </Text>
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {currentStep === 'date' ? 'Select Date' : 
                   currentStep === 'checkin' ? 'Check-in Time' : 'Check-out Time'}
                </Text>
                <Text className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Step {currentStep === 'date' ? '1' : currentStep === 'checkin' ? '2' : '3'} of 3
                </Text>
              </View>
              <TouchableOpacity onPress={handleModalClose}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Progress Bar */}
            <View className="flex-row mt-5 space-x-2">
              <View className={`flex-1 h-1.5 rounded-full ${currentStep === 'date' || currentStep === 'checkin' || currentStep === 'checkout' ? 'bg-black' : 'bg-gray-200'}`} />
              <View className={`flex-1 h-1.5 rounded-full ${currentStep === 'checkin' || currentStep === 'checkout' ? 'bg-black' : 'bg-gray-200'}`} />
              <View className={`flex-1 h-1.5 rounded-full ${currentStep === 'checkout' && selectedData.endDateTime ? 'bg-black' : 'bg-gray-200'}`} />
            </View>

            {/* Step Navigation */}
            <View className="flex-row justify-center mt-4 space-x-8">
              <TouchableOpacity 
                className="items-center"
                onPress={() => setCurrentStep('date')}
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center ${
                  currentStep === 'date' ? 'bg-black' : 'bg-gray-200'
                }`}>
                  <Text className={`text-sm ${currentStep === 'date' ? 'text-white' : 'text-gray-600'}`} 
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}>1</Text>
                </View>
                <Text className={`text-xs mt-1 ${currentStep === 'date' ? 'text-black' : 'text-gray-500'}`} 
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Date</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="items-center"
                onPress={() => selectedData.selectedDate && setCurrentStep('checkin')}
                disabled={!selectedData.selectedDate}
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center ${
                  currentStep === 'checkin' ? 'bg-black' : selectedData.selectedDate ? 'bg-gray-300' : 'bg-gray-200'
                }`}>
                  <Text className={`text-sm ${currentStep === 'checkin' ? 'text-white' : 'text-gray-600'}`} 
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}>2</Text>
                </View>
                <Text className={`text-xs mt-1 ${currentStep === 'checkin' ? 'text-black' : 'text-gray-500'}`} 
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Check-in</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="items-center"
                onPress={() => selectedData.startDateTime && setCurrentStep('checkout')}
                disabled={!selectedData.startDateTime}
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center ${
                  currentStep === 'checkout' ? 'bg-black' : selectedData.startDateTime ? 'bg-gray-300' : 'bg-gray-200'
                }`}>
                  <Text className={`text-sm ${currentStep === 'checkout' ? 'text-white' : 'text-gray-600'}`} 
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}>3</Text>
                </View>
                <Text className={`text-xs mt-1 ${currentStep === 'checkout' ? 'text-black' : 'text-gray-500'}`} 
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}>Check-out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
            {currentStep === 'date' && (
              <View>
                <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  When would you like to book?
                </Text>
                <Text className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Choose your preferred date
                </Text>

                <View className="flex gap-y-4">
                  {dateOptions.map((date) => {
                    const isSelected = selectedData.selectedDate === date.value;
                    
                    return (
                      <TouchableOpacity
                        key={date.value}
                        className={`bg-white rounded-3xl border-2 ${
                          isSelected ? 'border-black shadow-lg' : 'border-gray-100 shadow-sm'
                        }`}
                        onPress={() => handleDateSelect(date.value)}
                      >
                        <View className="p-6">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <View className={`w-5 h-5 rounded-full border-2 mr-5 ${
                                isSelected ? 'bg-black border-black' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <View className="w-1.5 h-1.5 bg-white rounded-full self-center mt-1.5" />
                                )}
                              </View>
                              <View>
                                <Text 
                                  className={`text-lg ${isSelected ? 'text-black' : 'text-gray-900'}`}
                                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                >
                                  {date.display}
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                  {date.fullDate}
                                </Text>
                              </View>
                            </View>
                            {(date.isToday || date.isTomorrow) && (
                              <View className={`px-4 py-2 rounded-full ${
                                date.isToday ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <Text 
                                  className={`text-xs font-bold ${
                                    date.isToday ? 'text-green-700' : 'text-blue-700'
                                  }`}
                                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                >
                                  {date.isToday ? 'TODAY' : 'TOMORROW'}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {currentStep === 'checkin' && (
              <View>
                <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                      {selectedData.selectedDate && dateOptions.find(d => d.value === selectedData.selectedDate)?.fullDate}
                    </Text>
                  </View>
                </View>

                <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  What time do you want to check-in?
                </Text>
                <Text className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Select your check-in time (same day only)
                </Text>

                <View className="flex-row flex-wrap justify-between">
                  {checkinSlots.map((slot) => {
                    const isSelected = selectedData.startDateTime === slot.fullDateTime;
                    
                    return (
                      <TouchableOpacity
                        key={slot.fullDateTime}
                        className={`w-[31%] mb-4 py-5 px-3 rounded-2xl border-2 ${
                          isSelected
                            ? 'bg-black border-black shadow-lg'
                            : 'bg-white border-gray-100 shadow-sm'
                        }`}
                        onPress={() => handleCheckinSelect(slot)}
                      >
                        <Text 
                          className={`text-center text-sm ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                          style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                        >
                          {slot.display}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {currentStep === 'checkout' && (
              <View>
                <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Calendar size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                        {selectedData.selectedDate && dateOptions.find(d => d.value === selectedData.selectedDate)?.fullDate}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-gray-500 mr-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                        Check-in:
                      </Text>
                      <Text className="text-sm text-black" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        {selectedData.startTime}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  What time do you want to check-out?
                </Text>
                <Text className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Minimum booking: {minHours} hours
                </Text>

                <View className="flex-row flex-wrap justify-between">
                  {checkoutSlots.map((slot) => {
                    const isSelected = selectedData.endDateTime === slot.fullDateTime;
                    const startTime = new Date(selectedData.startDateTime!);
                    const slotTime = new Date(slot.fullDateTime);
                    const diffHours = (slotTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    
                    return (
                      <TouchableOpacity
                        key={slot.fullDateTime}
                        className={`w-[31%] mb-4 py-5 px-3 rounded-2xl border-2 ${
                          isSelected
                            ? 'bg-black border-black shadow-lg'
                            : 'bg-white border-gray-100 shadow-sm'
                        }`}
                        onPress={() => handleCheckoutSelect(slot)}
                      >
                        <Text 
                          className={`text-center text-sm ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                          style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                        >
                          {slot.display}
                        </Text>
                        {isSelected && diffHours > 0 && (
                          <Text className="text-center text-xs text-white mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            {Math.round(diffHours)}h duration
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="bg-white px-6 py-4 border-t border-gray-100">
            <TouchableOpacity
              className={`w-full h-14 rounded-2xl items-center justify-center ${
                (currentStep === 'date' && selectedData.selectedDate) ||
                (currentStep === 'checkin' && selectedData.startDateTime) ||
                (currentStep === 'checkout' && selectedData.endDateTime)
                  ? 'bg-black' 
                  : 'bg-gray-200'
              }`}
              onPress={() => {
                if (currentStep === 'date' && selectedData.selectedDate) {
                  setCurrentStep('checkin');
                } else if (currentStep === 'checkin' && selectedData.startDateTime) {
                  setCurrentStep('checkout');
                } else if (currentStep === 'checkout' && selectedData.endDateTime) {
                  handleConfirm();
                }
              }}
              disabled={
                (currentStep === 'date' && !selectedData.selectedDate) ||
                (currentStep === 'checkin' && !selectedData.startDateTime) ||
                (currentStep === 'checkout' && !selectedData.endDateTime)
              }
            >
              <Text 
                className={`text-sm ${
                  (currentStep === 'date' && selectedData.selectedDate) ||
                  (currentStep === 'checkin' && selectedData.startDateTime) ||
                  (currentStep === 'checkout' && selectedData.endDateTime)
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                {currentStep === 'checkout' ? 'Confirm Booking' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}