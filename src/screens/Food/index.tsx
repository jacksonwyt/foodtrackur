import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/Screen';
import { Calendar, DateData } from 'react-native-calendars';
import { format as formatDate } from 'date-fns';
import { MacroTiles } from '../../components/cards/MacroTiles';
import { FoodLogListItem, FoodLogItem } from '../../components/items/FoodLogListItem';
import { Ionicons } from '@expo/vector-icons';
import { useFoodScreenNavigation } from '@/src/hooks/useFoodScreenNavigation';

interface DailySummaryData {
  calories: { consumed: number; goal: number };
  macros: {
    protein: { consumed: number; goal: number };
    carbs: { consumed: number; goal: number };
    fat: { consumed: number; goal: number };
  };
}

interface MealsData {
  breakfast: FoodLogItem[];
  lunch: FoodLogItem[];
  dinner: FoodLogItem[];
  snack: FoodLogItem[];
}

const MOCK_SUMMARY: DailySummaryData = {
  calories: { consumed: 1500, goal: 2200 },
  macros: {
    protein: { consumed: 80, goal: 120 },
    carbs: { consumed: 180, goal: 250 },
    fat: { consumed: 50, goal: 70 },
  },
};

const MOCK_MEALS: MealsData = {
  breakfast: [
    { id: '1', name: 'Oatmeal', calories: 320, time: '8:00 AM', category: 'breakfast' },
    { id: '4', name: 'Banana', calories: 105, time: '8:05 AM', category: 'breakfast' },
  ],
  lunch: [
    { id: '2', name: 'Chicken Salad', calories: 450, time: '12:30 PM', category: 'lunch' },
  ],
  dinner: [],
  snack: [
    { id: '3', name: 'Protein Shake', calories: 180, time: '3:00 PM', category: 'snack' },
  ],
};

// Define a theme for the calendar
const calendarTheme = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#8E8E93', // Lighter grey for day names (Mon, Tue, etc.)
  selectedDayBackgroundColor: '#007AFF', // App primary blue
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#007AFF', // App primary blue for today
  dayTextColor: '#1C1C1E', // Standard dark text
  textDisabledColor: '#d9e1e8', // Light grey for disabled days
  dotColor: '#007AFF', // Color for marking dots (if used)
  selectedDotColor: '#ffffff',
  arrowColor: '#007AFF', // Arrow color
  monthTextColor: '#1C1C1E', // Month title color
  indicatorColor: 'blue', // Activity indicator color
  // Font styles (adjust if needed based on app theme)
  // textDayFontFamily: 'monospace',
  // textMonthFontFamily: 'monospace',
  // textDayHeaderFontFamily: 'monospace',
  textDayFontWeight: '400' as const, // Regular weight for days
  textMonthFontWeight: '600' as const, // Semi-bold for month
  textDayHeaderFontWeight: '400' as const, // Regular for day names
  textDayFontSize: 16,
  textMonthFontSize: 18, // Slightly larger month title
  textDayHeaderFontSize: 14,
};

const FoodScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { navigateToAddFood, navigateToFoodDetails } = useFoodScreenNavigation();

  const dailyData = MOCK_SUMMARY;
  const mealsData = MOCK_MEALS;

  const handleAddItem = (mealCategory: FoodLogItem['category']) => {
    navigateToAddFood(mealCategory);
  };

  const handleViewItem = (item: FoodLogItem) => {
    navigateToFoodDetails(item.id);
  };

  const handleDayPress = (day: DateData) => {
    const [year, month, date] = day.dateString.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, date));
  };

  const markedDate = useMemo(() => {
    const formatted = formatDate(selectedDate, 'yyyy-MM-dd');
    return {
      [formatted]: {
        selected: true,
        selectedColor: calendarTheme.selectedDayBackgroundColor,
      },
    };
  }, [selectedDate]);

  if (isLoading) {
    return <Screen style={styles.centered}><ActivityIndicator size="large" /></Screen>;
  }

  if (error) {
    return <Screen style={styles.centered}><Text>Error loading data: {error.message}</Text></Screen>;
  }

  const renderMealSection = (title: string, category: FoodLogItem['category'], items: FoodLogItem[]) => (
    <View style={styles.mealSection}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <TouchableOpacity onPress={() => handleAddItem(category)} style={styles.addButton}>
           <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {items.length > 0 ? (
        items.map(item => (
          <FoodLogListItem key={item.id} item={item} onPress={handleViewItem} />
        ))
      ) : (
        <Text style={styles.emptyMealText}>No items logged for {title.toLowerCase()}.</Text>
      )}
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Food Log</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            current={formatDate(selectedDate, 'yyyy-MM-dd')}
            onDayPress={handleDayPress}
            markedDates={markedDate}
            theme={calendarTheme}
          />
        </View>

        <View style={styles.macrosContainer}>
          <MacroTiles
            protein={dailyData.macros.protein}
            carbs={dailyData.macros.carbs}
            fat={dailyData.macros.fat}
          />
        </View>

        {renderMealSection('Breakfast', 'breakfast', mealsData.breakfast)}
        {renderMealSection('Lunch', 'lunch', mealsData.lunch)}
        {renderMealSection('Dinner', 'dinner', mealsData.dinner)}
        {renderMealSection('Snack', 'snack', mealsData.snack)}

      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  macrosContainer: {
    marginTop: 0,
    marginBottom: 24,
  },
  mealSection: {
    marginTop: 0,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
     padding: 4,
  },
  emptyMealText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default FoodScreen; 