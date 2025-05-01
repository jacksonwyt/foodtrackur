import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useOnboardingDetailsForm,
  OnboardingDetailsFormData,
  ActivityLevel,
} from '../../hooks/useOnboardingDetailsForm'; // Adjusted path
import { useOnboardingDetailsNavigation } from '../../hooks/useOnboardingDetailsNavigation'; // Adjusted path
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader'; // Adjusted path
import { OnboardingFooter } from '../../components/onboarding/OnboardingFooter'; // Adjusted path
import { ActivityLevelItem } from '../../components/onboarding/ActivityLevelItem'; // Adjusted path

interface FormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra' | null;
}

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    description: 'Little or no exercise',
  },
  {
    id: 'light',
    title: 'Lightly Active',
    description: '1-3 days/week',
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    description: '3-5 days/week',
  },
  {
    id: 'very',
    title: 'Very Active',
    description: '6-7 days/week',
  },
  {
    id: 'extra',
    title: 'Extra Active',
    description: 'Very intense daily exercise',
  },
];

export const DetailsScreen: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    isFormValid,
    activityLevels,
  } = useOnboardingDetailsForm();

  const {
    goToNext
  } = useOnboardingDetailsNavigation();

  const handleContinue = () => {
    if (isFormValid()) {
      // Logic to save data could be added to the form hook or called here
      goToNext();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusted behavior for better experience
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset if needed
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside
      >
        <OnboardingHeader
            title="Personal Details"
            subtitle="Help us create your personalized nutrition plan"
        />

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Row for Age, Height, Weight */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flexInput]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Years"
                keyboardType="number-pad"
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputGroup, styles.flexInput]}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                placeholder="cm"
                keyboardType="number-pad"
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputGroup, styles.flexInput]}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                placeholder="kg"
                keyboardType="number-pad"
                placeholderTextColor="#999"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {(['male', 'female', 'other'] as const).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.selectedGender,
                  ]}
                  onPress={() => handleGenderSelect(gender)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.selectedText,
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Activity Level Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.activityLevelsContainer}>
              {activityLevels.map((level) => (
                <ActivityLevelItem
                    key={level.id}
                    title={level.title}
                    description={level.description}
                    isSelected={formData.activityLevel === level.id}
                    onPress={() => handleActivitySelect(level.id)}
                    // Use the styles from the component, remove inline styles here
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <OnboardingFooter
        buttonText="Continue"
        onPress={handleContinue}
        disabled={!isFormValid()}
        // Pass icon if needed, or handle within footer
      />
    </KeyboardAvoidingView>
  );
};

// Styles remain largely the same, but can be simplified
// by removing styles now handled in ActivityLevelItem.
// Ensure paths in imports are correct.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
      flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100, // Ensure space for the footer
  },
  // OnboardingHeader styles are now in that component
  // OnboardingFooter styles are now in that component

  form: {
    gap: 24,
    marginTop: 32, // Added margin after header
  },
  inputGroup: {
    // Kept for structure
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flexInput: {
      flex: 1,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedGender: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  activityLevelsContainer: {
      // Container for the activity level items
  },
  // Styles previously for individual activity buttons (activityButton, selectedActivity,
  // activityTitle, activityDescription) are now in ActivityLevelItem.tsx
});

// Export the component if it wasn't already (assuming it's in index.tsx or similar)
// export default DetailsScreen; // Or keep as named export if preferred 