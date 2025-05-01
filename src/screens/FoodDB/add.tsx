import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFoodDBAddForm } from '../../hooks/useFoodDBAddForm';

const AddFoodScreen: React.FC = () => {
  const {
    foodName,
    calories,
    protein,
    carbs,
    fat,
    errors,
    handleFoodNameChange,
    handleCaloriesChange,
    handleProteinChange,
    handleCarbsChange,
    handleFatChange,
    handleSave,
    isFormValid,
  } = useFoodDBAddForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add New Food</Text>

        <View style={styles.form}>
          {/* Food Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={[styles.input, errors.foodName && styles.inputError]}
              value={foodName}
              onChangeText={handleFoodNameChange}
              placeholder="Enter food name"
              placeholderTextColor="#999"
            />
            {errors.foodName && <Text style={styles.errorText}>{errors.foodName}</Text>}
          </View>

          {/* Calories Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={[styles.input, errors.calories && styles.inputError]}
              value={calories}
              onChangeText={handleCaloriesChange}
              placeholder="Enter calories"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            {errors.calories && <Text style={styles.errorText}>{errors.calories}</Text>}
          </View>

          {/* Macros Inputs */}
          <View style={styles.macrosContainer}>
            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={[styles.input, errors.protein && styles.inputError]}
                value={protein}
                onChangeText={handleProteinChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {errors.protein && <Text style={styles.errorText}>{errors.protein}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={[styles.input, errors.carbs && styles.inputError]}
                value={carbs}
                onChangeText={handleCarbsChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {errors.carbs && <Text style={styles.errorText}>{errors.carbs}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={[styles.input, errors.fat && styles.inputError]}
                value={fat}
                onChangeText={handleFatChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {errors.fat && <Text style={styles.errorText}>{errors.fat}</Text>}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Save Food</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 24, // Ensure space for content above footer
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF6B6B', // Highlight error fields
  },
  errorText: {
      fontSize: 12,
      color: '#FF6B6B',
      marginTop: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  macroInput: {
    flex: 1, // Make macro inputs share space equally
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddFoodScreen; 