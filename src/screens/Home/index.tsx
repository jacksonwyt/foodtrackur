import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { CalendarStrip } from '../../components/items/CalendarStrip';
import { CalorieSummary } from '../../components/cards/CalorieSummary';
import { MacroTiles } from '../../components/cards/MacroTiles';
import { SubscriptionBanner } from '../../components/cards/SubscriptionBanner';
import { RecentlyLogged } from '../../components/cards/RecentlyLogged';
import { Logo } from '../../components/items/Logo';
import { Streaks } from '../../components/items/Streaks';
import { useHomeSummaryData } from '../../hooks/useHomeSummaryData';
import { useHomeRecentItems } from '../../hooks/useHomeRecentItems';
import { useHomeNavigation } from '../../hooks/useHomeNavigation';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { dailyData, isLoading: isLoadingSummary, error: errorSummary } = useHomeSummaryData(selectedDate);
  const { recentItems, isLoading: isLoadingRecent, error: errorRecent } = useHomeRecentItems(selectedDate);
  const {
    navigateToSubscription,
    navigateToFoodLog,
    navigateToAddMeal,
    navigateToFoodItem,
    navigateToSettings,
  } = useHomeNavigation();

  const isLoading = isLoadingSummary || isLoadingRecent;
  const error = errorSummary || errorRecent;

  if (isLoading) {
    return (
      <Screen style={styles.centered}><ActivityIndicator size="large" /></Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.centered}><Text>Error loading data: {error.message}</Text></Screen>
    );
  }
  
  if (!dailyData || !recentItems) {
      return (
        <Screen style={styles.centered}><Text>No data available.</Text></Screen>
      );
  }

  return (
    <Screen style={styles.screenContainer}>
      <View style={styles.header}>
        <Logo />
        <View style={styles.headerRight}>
          <Streaks currentStreak={12} />
          <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <CalendarStrip
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        <View style={styles.summaryContainer}>
          <CalorieSummary
            consumed={dailyData.calories.consumed}
            goal={dailyData.calories.goal}
          />
        </View>

        <SubscriptionBanner 
          onPress={navigateToSubscription}
          trialEndsAt={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
          discount={80}
        />

        <View style={styles.macrosContainer}>
          <MacroTiles
            protein={dailyData.macros.protein}
            carbs={dailyData.macros.carbs}
            fat={dailyData.macros.fat}
          />
        </View>

        <RecentlyLogged
          items={recentItems}
          onItemPress={navigateToFoodItem}
          onViewAllPress={navigateToFoodLog}
          onAddPress={navigateToAddMeal}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsButton: {
    padding: 4,
  },
  calendarContainer: {
    marginTop: 10,
  },
  summaryContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  macrosContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 