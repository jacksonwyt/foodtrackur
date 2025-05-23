import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {addFoodLog} from '@/services/foodLogService';
import {FoodDBStackParamList, AppStackParamList} from '@/types/navigation';
import {useTheme} from '@/hooks/useTheme';
import {AppText} from '@/components/common/AppText';
import {AppTextInput} from '@/components/common/AppTextInput';
import {Theme} from '@/constants/theme';

// Define the structure of the food item passed to this screen
// This should be flexible enough for custom foods and processed AI results
export interface FoodLogItemData {
  food_name: string;
  calories: number; // Calories per single defined serving_unit
  protein: number; // Protein per single defined serving_unit
  carbs: number; // Carbs per single defined serving_unit
  fat: number; // Fat per single defined serving_unit
  serving_unit: string; // The unit of the defined serving (e.g., "slice", "100g", "item")
  // serving_size_of_defined_unit?: number; // e.g., if serving_unit is "100g", this would be 100. Optional.
}

// Define ParamList for navigation
// This should be part of a larger navigator stack (e.g., FoodDBStackParamList)
/*
export type LogEntryScreen_FoodDBStackParamList = {
  FoodSearch: { dateToLog: string };
  FoodDetails: { foodId: string; source: 'fatsecret'; dateToLog: string };
  LogEntry: { foodItem: FoodLogItemData; dateToLog: string };
  // ... other screens
};
*/

type LogEntryScreenRouteProp = RouteProp<FoodDBStackParamList, 'LogEntry'>;
// Use AppStackParamList for navigation to allow navigating outside FoodDBStack
// It might be better to type this more generally or use getParent if issues arise.
// For now, assuming navigation.navigate can traverse up to AppStack.
type LogEntryScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'FoodDBNav'
>;

const LogEntryScreen: React.FC = () => {
  const route = useRoute<LogEntryScreenRouteProp>();
  // Correctly type useNavigation for broader navigation capabilities if needed.
  // If sticking to FoodDBStack for most operations and only one cross-stack navigate:
  // const navigation = useNavigation<NativeStackNavigationProp<FoodDBStackParamList, 'LogEntry'>>();
  // Then for the specific cross-stack: navigation.getParent<NativeStackNavigationProp<AppStackParamList>>().navigate(...)
  // Or, more simply, react-navigation often allows direct navigation if unambiguous:
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const {foodItem, dateToLog} = route.params;

  const [quantity, setQuantity] = useState('1');
  const [isLogging, setIsLogging] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleLogFood = async () => {
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert(
        'Invalid Quantity',
        'Please enter a valid positive quantity.',
      );
      return;
    }

    setIsLogging(true);
    try {
      const logData = {
        food_name: foodItem.food_name,
        calories: foodItem.calories,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat,
        serving_size: numQuantity,
        serving_unit: foodItem.serving_unit,
        log_date: dateToLog,
      };

      const result = await addFoodLog(logData);
      if (result) {
        Alert.alert('Success', `${foodItem.food_name} logged successfully!`);
        // Navigate to Home screen, potentially passing params to trigger a refresh
        navigation.navigate('Main', {
          screen: 'HomeTab',
          params: {
            screen: 'Home', // Specify the screen within HomeTab
            params: {selectedDateISO: dateToLog, refreshTimestamp: Date.now()},
          },
        });
        // TODO: Home screen should listen to refreshTimestamp or selectedDateISO change to refetch data.
      } else {
        throw new Error('Failed to log food. Please try again.');
      }
    } catch (err) {
      console.error('Error logging food:', err);
      Alert.alert(
        'Logging Failed',
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    }
    setIsLogging(false);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <AppText style={styles.header}>Log Food: {foodItem.food_name}</AppText>

        <View style={styles.detailsContainer}>
          <AppText style={styles.detailText}>
            Serving Unit: {foodItem.serving_unit}
          </AppText>
          <AppText style={styles.detailText}>
            Calories: {foodItem.calories.toFixed(1)} per {foodItem.serving_unit}
          </AppText>
          <AppText style={styles.detailText}>
            Protein: {foodItem.protein.toFixed(1)}g per {foodItem.serving_unit}
          </AppText>
          <AppText style={styles.detailText}>
            Carbs: {foodItem.carbs.toFixed(1)}g per {foodItem.serving_unit}
          </AppText>
          <AppText style={styles.detailText}>
            Fat: {foodItem.fat.toFixed(1)}g per {foodItem.serving_unit}
          </AppText>
        </View>

        <AppTextInput
          label="Quantity Consumed:"
          style={styles.input}
          containerStyle={styles.inputContainer}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder={`Number of ${foodItem.serving_unit}s`}
        />

        <TouchableOpacity
          style={[styles.logButton, isLogging && styles.disabledButton]}
          onPress={() => {
            void handleLogFood();
          }}
          disabled={isLogging}>
          {isLogging ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <AppText style={styles.logButtonText}>Log Food</AppText>
          )}
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {flex: 1, backgroundColor: theme.colors.background},
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onBackground,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    detailsContainer: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    detailText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    input: {
    },
    logButton: {
      backgroundColor: theme.colors.success,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    logButtonText: {
      color: theme.colors.onSuccess,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
    disabledButton: {
      backgroundColor: theme.colors.surfaceDisabled,
      shadowOpacity: 0,
    },
  });

export default LogEntryScreen;
