import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Calendar, CalendarList, DateData } from 'react-native-calendars';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onDateRangeSelect: (dateRange: DateRange) => void;
  placeholder?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export function DateRangePicker({ value, onDateRangeSelect, placeholder = "When's your trip?" }: DateRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateRange>(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayText = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      const startFormatted = formatDate(selectedDates.startDate);
      const endFormatted = formatDate(selectedDates.endDate);
      return `${startFormatted} - ${endFormatted}`;
    } else if (selectedDates.startDate) {
      return `${formatDate(selectedDates.startDate)} - Add end date`;
    }
    return placeholder;
  };

  const onDayPress = (day: DateData) => {
    const dateString = day.dateString;
    
    if (!selectedDates.startDate || (selectedDates.startDate && selectedDates.endDate)) {
      // Start new selection
      setSelectedDates({ startDate: dateString, endDate: null });
    } else if (selectedDates.startDate && !selectedDates.endDate) {
      // Set end date
      if (new Date(dateString) < new Date(selectedDates.startDate)) {
        // If selected date is before start date, make it the new start date
        setSelectedDates({ startDate: dateString, endDate: null });
      } else {
        // Set as end date
        setSelectedDates({ ...selectedDates, endDate: dateString });
      }
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    
    if (selectedDates.startDate) {
      marked[selectedDates.startDate] = {
        startingDay: true,
        color: '#FF5A5F',
        textColor: 'white',
      };
    }
    
    if (selectedDates.endDate) {
      marked[selectedDates.endDate] = {
        endingDay: true,
        color: '#FF5A5F',
        textColor: 'white',
      };
    }
    
    // Mark dates in between
    if (selectedDates.startDate && selectedDates.endDate) {
      const start = new Date(selectedDates.startDate);
      const end = new Date(selectedDates.endDate);
      
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (dateString !== selectedDates.startDate && dateString !== selectedDates.endDate) {
          marked[dateString] = {
            color: '#FFE5E6',
            textColor: '#FF5A5F',
          };
        }
      }
    }
    
    return marked;
  };

  const handleConfirm = () => {
    onDateRangeSelect(selectedDates);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    const clearedDates = { startDate: null, endDate: null };
    setSelectedDates(clearedDates);
    onDateRangeSelect(clearedDates);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <TouchableOpacity
        className="relative"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
          <CalendarIcon size={20} color="#94A3B8" />
        </View>
        <View className="w-full h-14 rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 justify-center">
          <Text 
            className={`text-base ${selectedDates.startDate ? 'text-slate-900' : 'text-slate-400'}`}
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
              Select dates
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View className="flex-1">
            <CalendarList
              onDayPress={onDayPress}
              markingType="period"
              markedDates={getMarkedDates()}
              minDate={today}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#FF5A5F',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#FF5A5F',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#FF5A5F',
                selectedDotColor: '#ffffff',
                arrowColor: '#FF5A5F',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#2d4150',
                indicatorColor: '#FF5A5F',
                textDayFontFamily: 'PlusJakartaSans-Regular',
                textMonthFontFamily: 'PlusJakartaSans-SemiBold',
                textDayHeaderFontFamily: 'PlusJakartaSans-Medium',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              horizontal={true}
              pagingEnabled={true}
              calendarWidth={screenWidth}
            />
          </View>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              className={`w-full h-12 rounded-lg items-center justify-center ${
                selectedDates.startDate && selectedDates.endDate 
                  ? 'bg-[#FF5A5F]' 
                  : 'bg-gray-200'
              }`}
              onPress={handleConfirm}
              disabled={!selectedDates.startDate || !selectedDates.endDate}
            >
              <Text 
                className={`text-base ${
                  selectedDates.startDate && selectedDates.endDate 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                Confirm dates
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}