import React, {useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {format, isSameDay} from 'date-fns';
import {useCalendarStripData} from '../../hooks/useCalendarStripData';
import {useCalendarStripScroll} from '../../hooks/useCalendarStripScroll';
import {useTheme} from '../../hooks/useTheme';
import {AppText as Text} from '../common/AppText';

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
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);

  const {today, dates, selectedIndex} = useCalendarStripData({
    selectedDate,
    numberOfDays,
  });

  useCalendarStripScroll({
    scrollViewRef: scrollViewRef as React.RefObject<ScrollView>,
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
        ]}>
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedText,
            isToday && styles.todayText,
          ]}>
          {format(date, 'EEE')}
        </Text>
        <Text
          style={[
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
        snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}>
        {dates.map(renderDateBubble)}
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    height: 75,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: ITEM_MARGIN,
    alignItems: 'center',
  },
  dateBubble: {
    width: ITEM_WIDTH,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: ITEM_MARGIN,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBubble: {
    backgroundColor: theme.colors.primary,
  },
  todayBubble: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  dayText: {
    fontSize: theme.typography.sizes.overline,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxs,
  },
  dateText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.onPrimary,
  },
  todayText: {
    color: theme.colors.primary,
  },
  todayDot: {
    position: 'absolute',
    bottom: theme.spacing.xs,
    width: 5,
    height: 5,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
  },
});
