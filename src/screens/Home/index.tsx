import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CalendarStrip} from '../../components/items/CalendarStrip';
import {CalorieSummary} from '../../components/cards/CalorieSummary';
import {MacroTiles} from '../../components/cards/MacroTiles';
import {Logo} from '../../components/items/Logo';
import {Streaks} from '../../components/items/Streaks';
import {RecentlyLogged} from '../../components/cards/RecentlyLogged';
import {FoodLogItem} from '../../components/items/FoodLogListItem';
import {WaterIntakeCard} from '../../components/cards/WaterIntakeCard';
import {useHomeSummaryData} from '../../hooks/useHomeSummaryData';
import {useHomeNavigation} from '../../hooks/useHomeNavigation';
import {Ionicons} from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/navigation';
import {formatISODate, parseISODate} from '../../utils/dateUtils';
import {useTheme} from '../../hooks/useTheme';
import {AppText as Text} from '../../components/common/AppText';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;
type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const theme = useTheme();

  // Derive selected date from route params, defaulting to today
  const routeSelectedDateISO = route.params?.selectedDateISO;
  // Memoize initial date string to avoid re-calculating `new Date()` on every render before params are set
  const initialDefaultDateISO = useMemo(() => formatISODate(new Date()), []);
  const currentSelectedISO = routeSelectedDateISO || initialDefaultDateISO;
  // Memoize the parsed Date object
  const currentDisplayDate = useMemo(() => parseISODate(currentSelectedISO), [currentSelectedISO]);

  // State for water intake
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyWaterTarget = 8; // Target glasses of water per day

  const {
    dailyData,
    isLoading: isLoadingSummary,
    error: errorSummary,
    refetchData, // Kept for potential future use with refreshTimestamp
  } = useHomeSummaryData(currentDisplayDate); // Pass the derived Date object

  const {navigateToSettings} = useHomeNavigation();

  // Handler for CalendarStrip date selection
  const handleDateSelect = (dateFromCalendar: Date) => {
    const newSelectedDateISO = formatISODate(dateFromCalendar);
    // Only set params if the date string actually changes to prevent unnecessary re-renders/loops
    if (newSelectedDateISO !== currentSelectedISO) {
      navigation.setParams({selectedDateISO: newSelectedDateISO});
      setWaterIntake(0); // Reset water intake when date changes
    }
  };
  
  // Simplified useEffect for refreshTimestamp if it's passed via params.
  // This needs careful handling to avoid loops if refetchData itself causes param changes.
  // For now, it assumes refetchData is idempotent or the timestamp is cleared by the caller.
  useEffect(() => {
    if (route.params?.refreshTimestamp) {
      // console.log('HomeScreen: refreshTimestamp detected, refetching data for', currentDisplayDate);
      void refetchData();
      // Clear the timestamp to prevent re-triggering
      navigation.setParams({ refreshTimestamp: undefined });
    }
  }, [route.params?.refreshTimestamp, refetchData, navigation]); // Added navigation

  // Commenting out the old useEffects that managed selectedDate state and param syncing
  // useEffect(() => {
  //   const newSelectedDateISO = formatISODate(selectedDate);
  //   if (route.params?.selectedDateISO !== newSelectedDateISO) {
  //     navigation.setParams({selectedDateISO: newSelectedDateISO});
  //   }
  // }, [selectedDate, navigation, route.params?.selectedDateISO]);

  // useEffect(() => {
  //   const {selectedDateISO, refreshTimestamp} = route.params || {};
  //   if (selectedDateISO) {
  //     const newSelectedDate = parseISODate(selectedDateISO);
  //     if (newSelectedDate.getTime() !== selectedDate.getTime()) {
  //       setSelectedDate(newSelectedDate);
  //     } else if (refreshTimestamp) {
  //       void refetchData();
  //     }
  //   } else if (refreshTimestamp) {
  //     void refetchData();
  //   }
  // }, [route.params, selectedDate, refetchData]);

  const isLoading = isLoadingSummary;
  const error = errorSummary;

  // Water intake handlers
  const handleIncrementWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, dailyWaterTarget));
  };

  const handleDecrementWater = () => {
    setWaterIntake(prev => Math.max(prev - 1, 0));
  };

  // Dummy data and functions for RecentlyLogged
  const recentlyLoggedItems: FoodLogItem[] = useMemo(() => {
    if (!dailyData?.recentLogs) {
      return [];
    }
    // Transform FoodLog to FoodLogItem
    return dailyData.recentLogs.map(log => ({
      id: String(log.id), // Assuming id is a number in FoodLog and string in FoodLogItem
      name: log.food_name,
      calories: log.calories,
      timestamp: log.created_at, // Assuming created_at is a string like FoodLogItem expects
      mealType: log.meal_type,
      // Add other transformations if necessary
    }));
  }, [dailyData?.recentLogs]);

  const handleItemPress = (item: FoodLogItem) => {
    console.log('Pressed item:', item);
    // navigation.navigate('FoodDetailScreen', { foodId: item.id }); // Example navigation
  };
  const handleViewAllPress = () => {
    console.log('View All pressed');
    // navigation.navigate('AllLoggedFoodScreen'); // Example navigation
  };
  const handleAddPress = () => {
    console.log('Add new meal pressed, navigating to FoodDB');
    // Navigate to FoodDBMain, ensuring to pass initialDate if required by FoodDBMain
    // The currentSelectedISO seems appropriate for the initialDate
    navigation.navigate('FoodDBNav', { screen: 'FoodDBMain', params: { initialDate: currentSelectedISO } });
  };

  const styles = makeStyles(theme);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Error loading data: {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  if (!dailyData) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Ionicons name="leaf-outline" size={48} color={theme.colors.onSurfaceMedium} />
        <Text style={styles.noDataText}>No data available for this day.</Text>
        <Text style={styles.noDataSubText}>Try selecting another date or logging your meals.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Logo />
        <View style={styles.headerRight}>
          <Streaks currentStreak={12} />
          <TouchableOpacity
            onPress={navigateToSettings}
            style={styles.settingsButton}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <CalendarStrip
            selectedDate={currentDisplayDate}
            onDateSelect={handleDateSelect}
          />
        </View>

        <View style={styles.summaryContainer}>
          <CalorieSummary
            consumed={dailyData.calories.consumed}
            goal={dailyData.calories.goal}
          />
        </View>

        <View style={styles.macrosContainer}>
          <MacroTiles
            protein={dailyData.macros.protein}
            carbs={dailyData.macros.carbs}
            fat={dailyData.macros.fat}
          />
        </View>

        <View style={styles.waterIntakeContainer}>
          <WaterIntakeCard
            currentIntake={waterIntake}
            targetIntake={dailyWaterTarget}
            onIncrement={handleIncrementWater}
            onDecrement={handleDecrementWater}
          />
        </View>

        <View style={styles.recentlyLoggedContainer}>
          <RecentlyLogged
            items={recentlyLoggedItems}
            onItemPress={handleItemPress}
            onViewAllPress={handleViewAllPress}
            onAddPress={handleAddPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface HomeStyles {
  screenContainer: ViewStyle;
  scrollView: ViewStyle;
  scrollViewContent: ViewStyle;
  header: ViewStyle;
  headerRight: ViewStyle;
  settingsButton: ViewStyle;
  calendarContainer: ViewStyle;
  summaryContainer: ViewStyle;
  macrosContainer: ViewStyle;
  waterIntakeContainer: ViewStyle;
  centeredContainer: ViewStyle;
  errorText: TextStyle;
  noDataText: TextStyle;
  noDataSubText: TextStyle;
  recentlyLoggedContainer: ViewStyle;
}

const makeStyles = (theme: ReturnType<typeof useTheme>): HomeStyles => {
  console.log('[HomeScreen makeStyles] theme:', JSON.stringify(theme, null, 2));
  return StyleSheet.create<HomeStyles>({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    settingsButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    calendarContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    summaryContainer: {
      marginBottom: theme.spacing.lg,
    },
    macrosContainer: {
      marginBottom: theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium,
    },
    waterIntakeContainer: {
      marginBottom: theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium,
    },
    recentlyLoggedContainer: {
      // Remove outer container styling for RecentlyLogged to allow its own styling to take full effect.
      // The RecentlyLogged component itself has marginHorizontal and marginVertical, so this container
      // might not need much styling, or specific overrides if necessary.
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.sizes.body,
      textAlign: 'center',
    },
    noDataText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.sizes.bodyLarge,
      color: theme.colors.text,
      textAlign: 'center',
    },
    noDataSubText: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurfaceMedium,
      textAlign: 'center',
    },
  });
};

export default HomeScreen;
