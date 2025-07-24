import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
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

function setTimeToNoon(dateStr: string): string {
  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0); 
  // returns local time string like "2025-07-25T12:00:00"
  return date.toISOString().split('T')[0] + 'T12:00:00';
}

export function DateRangePicker({
  value,
  onDateRangeSelect,
  placeholder = "When's your trip?",
}: DateRangePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateRange>(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDisplayText = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      return `${formatDate(selectedDates.startDate)} - ${formatDate(
        selectedDates.endDate
      )}`;
    } else if (selectedDates.startDate) {
      return `${formatDate(selectedDates.startDate)} - Add end date`;
    }
    return placeholder;
  };

  const onDayPress = (day: DateData) => {
    const dateString = day.dateString; // yyyy-MM-dd

    if (!selectedDates.startDate || (selectedDates.startDate && selectedDates.endDate)) {
      // Start new selection
      setSelectedDates({
        startDate: setTimeToNoon(dateString),
        endDate: null,
      });
    } else if (selectedDates.startDate && !selectedDates.endDate) {
      if (new Date(dateString) < new Date(selectedDates.startDate)) {
        setSelectedDates({
          startDate: setTimeToNoon(dateString),
          endDate: null,
        });
      } else {
        setSelectedDates({
          ...selectedDates,
          endDate: setTimeToNoon(dateString),
        });
      }
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};

    if (selectedDates.startDate) {
      marked[selectedDates.startDate.split('T')[0]] = {
        startingDay: true,
        color: '#000000',
        textColor: 'white',
      };
    }

    if (selectedDates.endDate) {
      marked[selectedDates.endDate.split('T')[0]] = {
        endingDay: true,
        color: '#000000',
        textColor: 'white',
      };
    }

    if (selectedDates.startDate && selectedDates.endDate) {
      const start = new Date(selectedDates.startDate);
      const end = new Date(selectedDates.endDate);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (
          dateString !== selectedDates.startDate.split('T')[0] &&
          dateString !== selectedDates.endDate.split('T')[0]
        ) {
          marked[dateString] = {
            color: '#000000',
            textColor: '#000000',
          };
        }
      }
    }
    return marked;
  };

  const handleConfirm = () => {
    const normalizedRange: DateRange = {
      startDate: selectedDates.startDate
        ? setTimeToNoon(selectedDates.startDate)
        : null,
      endDate: selectedDates.endDate
        ? setTimeToNoon(selectedDates.endDate)
        : null,
    };
    onDateRangeSelect(normalizedRange);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    const clearedDates = { startDate: null, endDate: null };
    setSelectedDates(clearedDates);
    onDateRangeSelect(clearedDates);
  };

  // Get the initial date to show in calendar
  const getInitialDate = () => {
    if (selectedDates.startDate) {
      return selectedDates.startDate.split('T')[0]; // Convert to YYYY-MM-DD format
    }
    return new Date().toISOString().split('T')[0]; // Default to today
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <TouchableOpacity className="relative" onPress={() => setIsModalVisible(true)}>
        <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 z-10">
          <CalendarIcon size={20} color="#8A8A8A" />
        </View>
        <View className="w-full h-14 rounded-lg border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 justify-center">
          <Text
            className={`text-base ${
              selectedDates.startDate ? 'text-black ' : 'text-gray-500 '
            }`}
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
        <View className="flex-1 bg-white ">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 ">
            <TouchableOpacity onPress={handleClear}>
              <Text
                className="text-base text-gray-600 "
                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
              >
                Clear
              </Text>
            </TouchableOpacity>
            <Text
              className="text-lg text-black "
              style={{ fontFamily: 'PlusJakartaSans-Bold' }}
            >
              Select dates
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#8A8A8A" />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View className="flex-1 px-4 py-4">
            <Calendar
              onDayPress={onDayPress}
              markingType="period"
              markedDates={getMarkedDates()}
              minDate={today}
              initialDate={getInitialDate()} // Add this line
              enableSwipeMonths={true}
              hideArrows={false}
              hideExtraDays={true}
              disableMonthChange={false}
              firstDay={1}
              hideDayNames={false}
              showWeekNumbers={false}
              onPressArrowLeft={(subtractMonth) => subtractMonth()}
              onPressArrowRight={(addMonth) => addMonth()}
              disableArrowLeft={false}
              disableArrowRight={false}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#8A8A8A',
                textSectionTitleDisabledColor: '#D1D5DB',
                selectedDayBackgroundColor: '#000000',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#000000',
                dayTextColor: '#000000',
                textDisabledColor: '#D1D5DB',
                dotColor: '#000000',
                selectedDotColor: '#ffffff',
                arrowColor: '#000000',
                disabledArrowColor: '#D1D5DB',
                monthTextColor: '#000000',
                indicatorColor: '#000000',
                textDayFontFamily: 'PlusJakartaSans-Regular',
                textMonthFontFamily: 'PlusJakartaSans-SemiBold',
                textDayHeaderFontFamily: 'PlusJakartaSans-Medium',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13,
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '500',
              }}
            />
          </View>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200 ">
            <TouchableOpacity
              className={`w-full h-12 rounded-lg items-center justify-center ${
                selectedDates.startDate && selectedDates.endDate
                  ? 'bg-black '
                  : 'bg-gray-200 '
              }`}
              onPress={handleConfirm}
              disabled={!selectedDates.startDate || !selectedDates.endDate}
            >
              <Text
                className={`text-base ${
                  selectedDates.startDate && selectedDates.endDate
                    ? 'text-white '
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