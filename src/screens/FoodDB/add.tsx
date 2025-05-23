import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert, // For displaying general form errors
} from 'react-native';
// import { useRoute, RouteProp } from '@react-navigation/native'; // No longer need useRoute if using prop
import type {RouteProp} from '@react-navigation/native'; // Keep RouteProp if it's used elsewhere, or remove if AddFoodScreenRouteProp is self-contained
import type {NativeStackScreenProps} from '@react-navigation/native-stack'; // Import for screen props
import {Screen} from '../../components/Screen'; // Path is correct relative to FoodDB
import {useAddFoodForm} from '../../hooks/useAddFoodForm'; // Path is correct relative to FoodDB
import {useAddFoodNavigation} from '../../hooks/useAddFoodNavigation'; // Path is correct relative to FoodDB
import {AppStackParamList} from '../../types/navigation'; // Path is correct relative to FoodDB
import {deleteCustomFood} from '../../services/customFoodService';
import {useTheme} from '../../hooks/useTheme'; // Added
import {AppText} from '../../components/common/AppText'; // Added
import {AppTextInput} from '../../components/common/AppTextInput'; // Added
import {Theme} from '../../constants/theme'; // Added

// Define the type for the route prop, using AppStackParamList and 'AddFood' route
// This type can be inlined or kept if preferred, but route prop itself is typed by NativeStackScreenProps
// type AddFoodScreenRouteProp = RouteProp<AppStackParamList, 'AddFood'>;

// Define prop types for the screen itself
type AddFoodScreenProps = NativeStackScreenProps<AppStackParamList, 'AddFood'>;

const AddFoodScreen: React.FC<AddFoodScreenProps> = ({navigation, route}) => {
  // Use the route prop directly
  const initialDate = route.params?.initialDate;
  // const itemId = route.params?.itemId; // Assuming AddFood might still be used for editing custom foods with an ID
  // const mealCategory = route.params?.mealCategory; // This param seems to be from an older version

  // Example: Log the initialDate when the component mounts or initialDate changes
  useEffect(() => {
    if (initialDate) {
      console.log('AddFoodScreen received initialDate:', initialDate);
      // Here, you might want to pass initialDate to useAddFoodForm or set it in local state
      // For example: setFormData(prev => ({ ...prev, date: initialDate }));
    }
  }, [initialDate]);

  // Pass itemId to the form hook. initialDate might be used by the hook later.
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    isLoading, // Use loading state for fetching
    isEditMode, // Use edit mode flag
    itemId: numericItemId, // Get numeric itemId from hook
    errors,
  } = useAddFoodForm({
    /* itemId */
  }); // itemId is commented out, decide if still needed
  const {handleGoBack} = useAddFoodNavigation();
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading

  const theme = useTheme(); // Added
  const styles = makeStyles(theme); // Added

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      Alert.alert(
        'Success',
        `Food item ${isEditMode ? 'updated' : 'added'} successfully!`,
      );
      handleGoBack();
    } else if (errors.form) {
      // Show general form error if submission failed and an error message exists
      Alert.alert('Error', errors.form);
    }
    // Field-specific errors are handled below
  };

  // --- Delete Handler ---
  const handleDelete = () => {
    if (!isEditMode || numericItemId === undefined) {
      // Should not happen if button is only shown in edit mode with valid ID
      console.error('Delete called without a valid item ID.');
      return;
    }

    // Confirmation Dialog
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this custom food item? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Wrap the async function
            const handleDeleteConfirm = async () => {
              setIsDeleting(true);
              try {
                const success = await deleteCustomFood(numericItemId);
                if (success) {
                  Alert.alert('Success', 'Food item deleted successfully.');
                  handleGoBack(); // Navigate back after successful deletion
                } else {
                  // Service handles not found/permission errors internally, returns false
                  Alert.alert(
                    'Error',
                    'Failed to delete food item. It might have already been deleted or there was a server error.',
                  );
                }
              } catch (error) {
                console.error('Error during food item deletion:', error);
                Alert.alert(
                  'Error',
                  'An unexpected error occurred while trying to delete the food item.',
                );
              } finally {
                setIsDeleting(false);
              }
            };
            void handleDeleteConfirm(); // Call the wrapped async function
          },
        },
      ],
    );
  };
  // --- End Delete Handler ---

  const screenTitle = isEditMode ? 'Edit Custom Food' : 'Create Custom Food';
  const buttonTitle = isEditMode ? 'Update Food' : 'Add Food';

  // Show loading indicator while fetching data in edit mode
  if (isLoading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={styles.loadingText}>Loading food details...</AppText>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      {/* Use Screen as the root */}
      <ScrollView
        style={styles.scrollView} // Apply ScrollView specific styles
        contentContainerStyle={styles.scrollViewContent} // Style for content inside ScrollView
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside inputs
      >
        <AppText style={styles.title}>{screenTitle}</AppText>

        {/* Optional: Display general form error */}
        {/* {errors.form && <Text style={styles.errorText}>{errors.form}</Text>} */}

        <View style={styles.form}>
          {/* Food Name Input */}
          <AppTextInput
            label="Food Name"
            containerStyle={styles.inputGroup} // Pass containerStyle for margins
            value={formData.foodName}
            onChangeText={value => handleInputChange('foodName', value)}
            placeholder="e.g., Homemade Granola"
            editable={!isSubmitting} // Disable during submission
            error={errors.foodName}
          />

          {/* Serving Size Row */}
          <View style={styles.servingRow}>
            {/* Serving Size Input */}
            <AppTextInput
              label="Serving Size"
              containerStyle={StyleSheet.flatten([styles.inputGroup, styles.servingInput])}
              value={formData.servingSize}
              onChangeText={value => handleInputChange('servingSize', value)}
              placeholder="e.g., 100"
              keyboardType="numeric"
              editable={!isSubmitting}
              error={errors.servingSize}
            />

            {/* Serving Unit Input */}
            <AppTextInput
              label="Unit"
              containerStyle={StyleSheet.flatten([styles.inputGroup, styles.servingInput])}
              value={formData.servingUnit}
              onChangeText={value => handleInputChange('servingUnit', value)}
              placeholder="e.g., g, cup, oz"
              editable={!isSubmitting}
              error={errors.servingUnit}
            />
          </View>

          {/* Calories Input */}
          <AppTextInput
            label="Calories"
            containerStyle={styles.inputGroup}
            value={formData.calories}
            onChangeText={value => handleInputChange('calories', value)}
            placeholder="e.g., 350"
            keyboardType="numeric"
            editable={!isSubmitting}
            error={errors.calories}
          />

          {/* Macros Row */}
          <View style={styles.macrosRow}>
            {/* Protein Input */}
            <AppTextInput
              label="Protein (g)"
              containerStyle={StyleSheet.flatten([styles.inputGroup, styles.macroInput])}
              value={formData.protein}
              onChangeText={value => handleInputChange('protein', value)}
              placeholder="e.g., 10"
              keyboardType="numeric"
              editable={!isSubmitting}
              error={errors.protein}
            />

            {/* Carbs Input */}
            <AppTextInput
              label="Carbs (g)"
              containerStyle={StyleSheet.flatten([styles.inputGroup, styles.macroInput])}
              value={formData.carbs}
              onChangeText={value => handleInputChange('carbs', value)}
              placeholder="e.g., 45"
              keyboardType="numeric"
              editable={!isSubmitting}
              error={errors.carbs}
            />

            {/* Fat Input */}
            <AppTextInput
              label="Fat (g)"
              containerStyle={StyleSheet.flatten([styles.inputGroup, styles.macroInput])}
              value={formData.fat}
              onChangeText={value => handleInputChange('fat', value)}
              placeholder="e.g., 15"
              keyboardType="numeric"
              editable={!isSubmitting}
              error={errors.fat}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, (isSubmitting || isDeleting) && styles.disabledButton]}
            onPress={() => {
              void handleFormSubmit();
            }} // Simplified fire-and-forget
            disabled={isSubmitting || isDeleting} // Also disable if deleting
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <AppText style={styles.buttonText}>{buttonTitle}</AppText>
            )}
          </TouchableOpacity>

          {/* Delete Button (only shown in edit mode) */}
          {isEditMode && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, (isSubmitting || isDeleting) && styles.disabledButton]}
              onPress={handleDelete} // handleDelete is synchronous
              disabled={isSubmitting || isDeleting} // Disable if submitting or deleting
            >
              {isDeleting ? (
                <ActivityIndicator color={theme.colors.onError} />
              ) : (
                <AppText style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete Food
                </AppText>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const makeStyles = (theme: Theme) => // Added
  StyleSheet.create({
    screen: {
      // Style for the Screen component itself (optional, often empty)
      flex: 1, // Ensure Screen takes full height
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      // Style for the ScrollView container
      flex: 1,
    },
    scrollViewContent: {
      // Style for the content within the ScrollView
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl, // Extra padding at bottom
    },
    loadingContainer: {
      // Style for loading state
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onBackground,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onBackground,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    form: {
      gap: theme.spacing.md, // Increased gap between sections
    },
    inputGroup: {
      marginBottom: theme.spacing.md, // Replaces individual input margins
      // AppTextInput handles its own label, input, and error text styling internally
    },
    servingRow: {
      // Style for serving size/unit row
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    servingInput: {
      // Style for individual serving inputs
      flex: 1,
    },
    macrosRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    macroInput: {
      flex: 1, // Each input takes equal space
      // Add horizontal margin if needed, e.g., for middle element:
      // marginHorizontal: theme.spacing.xs/2,
      // For now, AppTextInput containers will have their own marginBottom
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginTop: theme.spacing.md, // Add some top margin before buttons
      ...theme.shadows.sm,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
    disabledButton: {
      backgroundColor: theme.colors.surfaceDisabled,
      opacity: 0.7, // General opacity for disabled state
    },
    deleteButton: {
      // Style for delete button
      backgroundColor: theme.colors.error,
      marginTop: theme.spacing.sm, // Space between submit and delete buttons
    },
    deleteButtonText: {
      // Style for delete button text
      color: theme.colors.onError,
    },
  });

export default AddFoodScreen;
