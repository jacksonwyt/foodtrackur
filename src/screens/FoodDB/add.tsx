import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert, // For displaying general form errors
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native'; // Import useRoute and RouteProp
import { Screen } from '../../components/Screen'; // Path is correct relative to FoodDB
import { useAddFoodForm } from '../../hooks/useAddFoodForm'; // Path is correct relative to FoodDB
import { useAddFoodNavigation } from '../../hooks/useAddFoodNavigation'; // Path is correct relative to FoodDB
import { RootStackParamList } from '../../types/navigation'; // Path is correct relative to FoodDB
import { deleteCustomFood } from '../../services/customFoodService';

// Define the type for the route prop - AddMeal might receive itemId for editing
type AddMealScreenRouteProp = RouteProp<RootStackParamList, 'AddMeal'>;

const AddFoodScreen: React.FC = () => {
  const route = useRoute<AddMealScreenRouteProp>(); // Use useRoute
  // Get optional itemId. If present, we are in "edit" mode.
  const itemId = route.params?.itemId; 
  const mealCategory = route.params?.mealCategory; // Keep existing category param

  // Pass itemId and mealCategory to the form hook
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    isLoading, // Use loading state for fetching
    isEditMode, // Use edit mode flag
    itemId: numericItemId, // Get numeric itemId from hook
    errors,
  } = useAddFoodForm({ itemId }); // Pass string itemId to the hook
  const { handleGoBack } = useAddFoodNavigation();
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      Alert.alert('Success', `Food item ${isEditMode ? 'updated' : 'added'} successfully!`);
      handleGoBack();
    } else if (errors.form) {
      // Show general form error if submission failed and an error message exists
      Alert.alert('Error', errors.form);
    }
    // Field-specific errors are handled below
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!isEditMode || numericItemId === undefined) {
      // Should not happen if button is only shown in edit mode with valid ID
      console.error("Delete called without a valid item ID.");
      return;
    }

    // Confirmation Dialog
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this custom food item? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await deleteCustomFood(numericItemId);
              if (success) {
                Alert.alert("Success", "Food item deleted successfully.");
                handleGoBack(); // Navigate back after successful deletion
              } else {
                // Service handles not found/permission errors internally, returns false
                Alert.alert("Error", "Failed to delete food item. It might have already been deleted or there was a server error.");
              }
            } catch (error) {
              console.error("Error during food item deletion:", error);
              Alert.alert("Error", "An unexpected error occurred while trying to delete the food item.");
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
  // --- End Delete Handler ---

  const screenTitle = isEditMode ? 'Edit Custom Food' : 'Create Custom Food';
  const buttonTitle = isEditMode ? 'Update Food' : 'Add Food';

  // Show loading indicator while fetching data in edit mode
  if (isLoading) {
      return (
          <Screen style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text>Loading food details...</Text>
          </Screen>
      );
  }

  return (
    <Screen style={styles.screen}> // Use Screen as the root
      <ScrollView 
        style={styles.scrollView} // Apply ScrollView specific styles
        contentContainerStyle={styles.scrollViewContent} // Style for content inside ScrollView
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside inputs
      >
        <Text style={styles.title}>{screenTitle}</Text>
        
        {/* Optional: Display general form error */} 
        {/* {errors.form && <Text style={styles.errorText}>{errors.form}</Text>} */}

        <View style={styles.form}>
          {/* Food Name Input */} 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={[styles.input, errors.foodName ? styles.inputError : null]}
              value={formData.foodName}
              onChangeText={(value) => handleInputChange('foodName', value)}
              placeholder="e.g., Homemade Granola"
              editable={!isSubmitting} // Disable during submission
            />
            {errors.foodName && <Text style={styles.errorText}>{errors.foodName}</Text>}
          </View>

          {/* Serving Size Row */} 
          <View style={styles.servingRow}>
              {/* Serving Size Input */}
              <View style={[styles.inputGroup, styles.servingInput]}>
                 <Text style={styles.label}>Serving Size</Text>
                 <TextInput
                    style={[styles.input, errors.servingSize ? styles.inputError : null]}
                    value={formData.servingSize}
                    onChangeText={(value) => handleInputChange('servingSize', value)}
                    placeholder="e.g., 100"
                    keyboardType="numeric"
                    editable={!isSubmitting}
                 />
                 {errors.servingSize && <Text style={styles.errorText}>{errors.servingSize}</Text>}
              </View>

              {/* Serving Unit Input */}
              <View style={[styles.inputGroup, styles.servingInput]}>
                 <Text style={styles.label}>Unit</Text>
                 <TextInput
                    style={[styles.input, errors.servingUnit ? styles.inputError : null]}
                    value={formData.servingUnit}
                    onChangeText={(value) => handleInputChange('servingUnit', value)}
                    placeholder="e.g., g, cup, oz"
                    editable={!isSubmitting}
                 />
                 {errors.servingUnit && <Text style={styles.errorText}>{errors.servingUnit}</Text>}
              </View>
          </View>

          {/* Calories Input */} 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={[styles.input, errors.calories ? styles.inputError : null]}
              value={formData.calories}
              onChangeText={(value) => handleInputChange('calories', value)}
              placeholder="e.g., 350"
              keyboardType="numeric"
              editable={!isSubmitting}
            />
            {errors.calories && <Text style={styles.errorText}>{errors.calories}</Text>}
          </View>

          {/* Macros Row */} 
          <View style={styles.macrosRow}>
            {/* Protein Input */} 
            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={[styles.input, errors.protein ? styles.inputError : null]}
                value={formData.protein}
                onChangeText={(value) => handleInputChange('protein', value)}
                placeholder="e.g., 10"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              {errors.protein && <Text style={styles.errorText}>{errors.protein}</Text>}
            </View>

            {/* Carbs Input */} 
            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={[styles.input, errors.carbs ? styles.inputError : null]}
                value={formData.carbs}
                onChangeText={(value) => handleInputChange('carbs', value)}
                placeholder="e.g., 45"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              {errors.carbs && <Text style={styles.errorText}>{errors.carbs}</Text>}
            </View>

            {/* Fat Input */} 
            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={[styles.input, errors.fat ? styles.inputError : null]}
                value={formData.fat}
                onChangeText={(value) => handleInputChange('fat', value)}
                placeholder="e.g., 15"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              {errors.fat && <Text style={styles.errorText}>{errors.fat}</Text>}
            </View>
          </View>

          {/* Submit Button */} 
          <TouchableOpacity 
            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
            onPress={handleFormSubmit}
            disabled={isSubmitting || isLoading} // Also disable if loading data
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{buttonTitle}</Text>
            )}
          </TouchableOpacity>

          {/* Delete Button (only shown in edit mode) */} 
          {isEditMode && (
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton, (isSubmitting || isDeleting) ? styles.buttonDisabled : null]}
                onPress={handleDelete}
                disabled={isSubmitting || isLoading || isDeleting} // Disable if submitting, loading data, or deleting
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FF3B30" />
                ) : (
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Food</Text>
                )}
              </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { // Style for the Screen component itself (optional, often empty)
    flex: 1, // Ensure Screen takes full height
    backgroundColor: '#fff',
  },
  scrollView: { // Style for the ScrollView container
    flex: 1,
  },
  scrollViewContent: { // Style for the content within the ScrollView
    padding: 20, // Keep original padding here
    paddingBottom: 40, // Ensure space at bottom
  },
  loadingContainer: { // Style for loading state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Increased spacing
    textAlign: 'center',
  },
  form: {
    gap: 20, // Increased gap between sections
  },
  inputGroup: {
    gap: 6, // Adjusted gap
  },
  servingRow: { // Style for serving size/unit row
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
  },
  servingInput: { // Style for individual serving inputs
      flex: 1,
  },
  label: {
    fontSize: 14, // Slightly smaller label
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', // Lighter border
    borderRadius: 8,
    paddingHorizontal: 14, // More horizontal padding
    paddingVertical: 10, // Adjusted vertical padding
    fontSize: 16,
    backgroundColor: '#f8f8f8', // Slight background color
  },
  inputError: {
    borderColor: '#FF3B30', // Error border color
  },
  errorText: {
    color: '#FF3B30', // Error text color
    fontSize: 12,
    marginTop: 4, // Space above error text
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroInput: {
    flex: 1, // Make macro inputs share space equally
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14, // Adjusted padding
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15, // Adjusted space above button
  },
  buttonDisabled: {
    backgroundColor: '#a0caff', // Lighter color when disabled
  },
  deleteButton: { // Style for delete button
      backgroundColor: 'transparent', 
      borderColor: '#FF3B30',
      borderWidth: 1,
      marginTop: 10,
  },
  deleteButtonText: { // Style for delete button text
      color: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFoodScreen; 