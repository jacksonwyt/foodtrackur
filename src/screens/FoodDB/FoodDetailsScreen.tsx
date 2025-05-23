import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import type {
  FatSecretFoodDetails,
  FatSecretServing,
} from '@/services/fatsecretService';
import {getFatSecretFoodDetails} from '@/services/fatsecretService';
import {addFoodLog} from '@/services/foodLogService';
import {FoodDBStackParamList} from '@/types/navigation';
import {useTheme} from '@/hooks/useTheme';
import {AppText} from '@/components/common/AppText';
import {AppTextInput} from '@/components/common/AppTextInput';
import {Theme} from '@/constants/theme';

// Assuming FoodDBStackParamList is defined elsewhere and includes this screen
// For standalone, define or import it. For now, we'll assume it's like:
// export type FoodDBStackParamList = {
//   FoodSearch: undefined;
//   FoodDetails: { foodId: string; source: 'fatsecret'; dateToLog: string }; // dateToLog added
//   LogFoodEntry: { foodItem: any; dateToLog: string }; // Example
// };
// Ensure RootStackParamList or the relevant navigator includes FoodDetails
// And that FoodSearch navigates to it with all required params.

// Let's refine the ParamList for navigation type safety
// This should ideally be in a shared types/navigation.ts file if used across screens
/*
export type FoodDetailsScreen_FoodDBStackParamList = {
  FoodSearch: undefined; // Or other params if FoodSearch needs them
  FoodDetails: { foodId: string; source: 'fatsecret'; dateToLog: string }; 
  // Add other screens in this specific stack if they exist
};
*/

// type FoodDetailsScreenRouteProp = RouteProp<FoodDetailsScreen_FoodDBStackParamList, 'FoodDetails'>;
type FoodDetailsScreenRouteProp = RouteProp<
  FoodDBStackParamList,
  'FoodDetails'
>;
// We need navigation prop to go back or to a confirmation screen
// type FoodDetailsScreenNavigationProp = NativeStackNavigationProp<FoodDetailsScreen_FoodDBStackParamList, 'FoodDetails'>;
type FoodDetailsScreenNavigationProp = NativeStackNavigationProp<
  FoodDBStackParamList,
  'FoodDetails'
>;

const FoodDetailsScreen: React.FC = () => {
  const route = useRoute<FoodDetailsScreenRouteProp>();
  const navigation = useNavigation<FoodDetailsScreenNavigationProp>();
  const {foodId, dateToLog} = route.params; // dateToLog is crucial

  const [foodDetails, setFoodDetails] = useState<FatSecretFoodDetails | null>(
    null,
  );
  const [selectedServing, setSelectedServing] =
    useState<FatSecretServing | null>(null);
  const [quantity, setQuantity] = useState('1'); // Default quantity
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchDetails = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        const response = await getFatSecretFoodDetails(foodId);
        if (!isMounted) return;

        if (response.food) {
          setFoodDetails(response.food);
          const servingsArray = response.food.servings?.serving;

          if (servingsArray && servingsArray.length > 0) {
            setSelectedServing(servingsArray[0]);
          } else {
            setSelectedServing(null);
          }
          setError(null);
        } else {
          setError('Food details not found.');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching food details:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load food details.';
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetails(); // Ensure void is here

    return () => {
      isMounted = false;
    };
  }, [foodId]);

  const handleLogFood = async () => {
    if (!selectedServing || !foodDetails) {
      // Guard against null foodDetails
      Alert.alert('Error', 'No serving selected or food details missing.');
      return;
    }
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
      // Now foodDetails and selectedServing are guaranteed to be non-null here
      const logData = {
        food_name: foodDetails.food_name,
        calories: parseFloat(selectedServing.calories) || 0,
        protein: parseFloat(selectedServing.protein) || 0,
        carbs: parseFloat(selectedServing.carbohydrate) || 0,
        fat: parseFloat(selectedServing.fat) || 0,
        serving_size: numQuantity,
        serving_unit: selectedServing.serving_description,
        log_date: dateToLog,
      };

      const result = await addFoodLog(logData);
      if (result) {
        Alert.alert('Success', `${foodDetails.food_name} logged successfully!`);
        navigation.goBack();
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

  if (isLoading) {
    return (
      <Screen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Screen>
    );
  }

  // This guard ensures foodDetails is not null for the rendering below
  if (error || !foodDetails) {
    return (
      <Screen style={styles.centered}>
        <AppText style={styles.errorText}>{error || 'Food not found.'}</AppText>
      </Screen>
    );
  }

  // foodDetails is now guaranteed to be non-null
  // and foodDetails.servings.serving is normalized to FatSecretServing[] by the service
  const allServings: FatSecretServing[] = foodDetails.servings?.serving || [];

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* foodDetails is guaranteed non-null here by the check above */}
        <AppText style={styles.foodName}>{foodDetails.food_name}</AppText>
        {foodDetails.brand_name && (
          <AppText style={styles.brandName}>Brand: {foodDetails.brand_name}</AppText>
        )}

        <AppText style={styles.label}>Select Serving Size:</AppText>
        {allServings.length > 0 ? (
          allServings.map((serving: FatSecretServing) => (
            <TouchableOpacity
              key={serving.serving_id} // Assuming serving_id is a valid key
              style={[
                styles.servingButton,
                selectedServing?.serving_id === serving.serving_id &&
                  styles.selectedServingButton,
              ]}
              onPress={() => setSelectedServing(serving)}>
              <AppText
                style={[
                  styles.servingButtonText,
                  selectedServing?.serving_id === serving.serving_id &&
                    styles.selectedServingButtonText,
                ]}>
                {serving.serving_description} -{' '}
                {parseFloat(serving.calories).toFixed(0)} kcal
              </AppText>
            </TouchableOpacity>
          ))
        ) : (
          <AppText style={styles.infoText}>
            No specific serving sizes available. Default values may apply.
          </AppText>
        )}

        {/* selectedServing can be null, so keep optional chaining or ensure it's guarded */}
        {selectedServing && (
          <View style={styles.nutritionInfoContainer}>
            <AppText style={styles.subHeader}>
              Nutrition per {selectedServing.serving_description}:
            </AppText>
            <AppText style={styles.nutritionText}>
              Calories: {parseFloat(selectedServing.calories).toFixed(1)}
            </AppText>
            <AppText style={styles.nutritionText}>
              Protein: {parseFloat(selectedServing.protein).toFixed(1)}g
            </AppText>
            <AppText style={styles.nutritionText}>
              Carbs: {parseFloat(selectedServing.carbohydrate).toFixed(1)}g
            </AppText>
            <AppText style={styles.nutritionText}>
              Fat: {parseFloat(selectedServing.fat).toFixed(1)}g
            </AppText>
          </View>
        )}

        <AppTextInput
          label="Quantity:"
          containerStyle={styles.inputContainer}
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="e.g., 1.5"
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
            <AppText style={styles.logButtonText}>Log This Food</AppText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    foodName: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onBackground,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    brandName: {
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.regular,
      color: theme.colors.onSurfaceMedium,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.onBackground,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    servingButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    selectedServingButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    servingButtonText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    selectedServingButtonText: {
      color: theme.colors.onPrimary,
      fontWeight: theme.typography.weights.medium,
    },
    infoText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurfaceMedium,
      textAlign: 'center',
      paddingVertical: theme.spacing.md,
    },
    nutritionInfoContainer: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    subHeader: {
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.sm,
    },
    nutritionText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    input: {
      // Handled by AppTextInput default styles mostly
      // Override if specific changes are needed, e.g.:
      // height: 50,
    },
    logButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginTop: theme.spacing.md,
      ...theme.shadows.md,
    },
    logButtonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
    disabledButton: {
      backgroundColor: theme.colors.surfaceDisabled,
      ...theme.shadows.sm,
      shadowOpacity: 0.1,
    },
    errorText: {
      fontSize: theme.typography.sizes.bodyLarge,
      color: theme.colors.error,
      textAlign: 'center',
    },
  });

export default FoodDetailsScreen;
