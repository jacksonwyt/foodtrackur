import React from 'react';
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
import { Screen } from '../../components/Screen'; // Import Screen
import { useAddFoodForm } from '../../hooks/useAddFoodForm';
import { useAddFoodNavigation } from '../../hooks/useAddFoodNavigation';
import { RootStackParamList } from '../../types/navigation'; // Import RootStackParamList

// Define the type for the route prop - AddMeal might receive itemId for editing
type AddMealScreenRouteProp = RouteProp<RootStackParamList, 'AddMeal'>;

const AddFoodScreen: React.FC = () => {
  const route = useRoute<AddMealScreenRouteProp>(); // Use useRoute
  // Get optional itemId. If present, we are in "edit" mode.
  const itemId = route.params?.itemId; 
  const mealCategory = route.params?.mealCategory; // Keep existing category param

  // Pass itemId to the form hook (assuming the hook is updated to handle it)
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    errors,
  } = useAddFoodForm(itemId, mealCategory); // Pass itemId and mealCategory
  const { handleGoBack } = useAddFoodNavigation();

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      handleGoBack();
    } else if (errors.form) {
      // Show general form error if submission failed and an error message exists
      Alert.alert('Error', errors.form);
    }
    // Field-specific errors are handled below
  };

  return (
    <Screen style={styles.screen}> // Use Screen as the root
      <ScrollView 
        style={styles.scrollView} // Apply ScrollView specific styles
        contentContainerStyle={styles.scrollViewContent} // Style for content inside ScrollView
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside inputs
      >
        <Text style={styles.title}>Add Food</Text>
        
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
              placeholder="Enter food name"
              editable={!isSubmitting} // Disable during submission
            />
            {errors.foodName && <Text style={styles.errorText}>{errors.foodName}</Text>}
          </View>

          {/* Calories Input */} 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={[styles.input, errors.calories ? styles.inputError : null]}
              value={formData.calories}
              onChangeText={(value) => handleInputChange('calories', value)}
              placeholder="Enter calories"
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
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Food</Text>
            )}
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Increased spacing
    textAlign: 'center',
  },
  form: {
    gap: 16, // Adjusted gap
  },
  inputGroup: {
    gap: 6, // Adjusted gap
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
    marginTop: 10, // Space above button
  },
  buttonDisabled: {
    backgroundColor: '#a0caff', // Lighter color when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFoodScreen; 