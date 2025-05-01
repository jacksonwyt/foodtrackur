import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { format, isSameDay } from 'date-fns';
import { useCalendarStripData } from '../../hooks/useCalendarStripData';
import { useCalendarStripScroll } from '../../hooks/useCalendarStripScroll';

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  numberOfDays?: number;
}

const ITEM_WIDTH = 45;
const ITEM_MARGIN = 6;

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDate,
  onDateSelect,
  numberOfDays = 14,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const { today, dates, selectedIndex } = useCalendarStripData({
    selectedDate,
    numberOfDays,
  });

  useCalendarStripScroll({
    scrollViewRef,
    selectedIndex,
    itemWidth: ITEM_WIDTH,
    itemMargin: ITEM_MARGIN,
  });

  const renderDateBubble = (date: Date) => {
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, today);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        onPress={() => onDateSelect(date)}
        style={[
          styles.dateBubble,
          isSelected && styles.selectedBubble,
          isToday && styles.todayBubble,
        ]}
      >
        <Text style={[
          styles.dayText,
          isSelected && styles.selectedText,
          isToday && styles.todayText,
        ]}>
          {format(date, 'EEE')}
        </Text>
        <Text style={[
          styles.dateText,
          isSelected && styles.selectedText,
          isToday && styles.todayText,
        ]}>
          {format(date, 'd')}
        </Text>
        {isToday && <View style={styles.todayDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
      >
        {dates.map(renderDateBubble)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 75,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: ITEM_MARGIN,
  },
  dateBubble: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN,
    borderRadius: ITEM_WIDTH / 2,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBubble: {
    backgroundColor: '#111',
  },
  todayBubble: {
    borderWidth: 1.5,
    borderColor: '#000',
  },
  dayText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  todayText: {
    color: '#000',
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B6B',
  },
}); 