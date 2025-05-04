import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useRouter, Href } from 'expo-router';
import {
  useOnboardingDetailsForm,
  ActivityLevel,
} from '../../hooks/useOnboardingDetailsForm';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingFooter } from '../../components/onboarding/OnboardingFooter';
import { ActivityLevelItem } from '../../components/onboarding/ActivityLevelItem';
import {
  OnboardingStackParamList,
  OnboardingData,
  GoalType,
  GenderType,
  ActivityLevelType
} from '../../types/navigation';
import {
  calculateNutritionalGoals,
  CalculatedGoals,
} from '../../utils/calculations';
import { updateProfile, Profile } from '../../services/profileService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DetailsScreenRouteProp = RouteProp<OnboardingStackParamList, 'Details'>;

// Define navigation prop type for Details screen specifically
type DetailsScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Details'>;

interface DetailsScreenProps {
  route: DetailsScreenRouteProp;
  // Remove navigation prop if using expo-router directly
  // navigation: DetailsScreenNavigationProp; 
  onComplete: () => void;
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

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ route, onComplete }) => {
  const { goal } = route.params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    formData,
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    isFormValid,
    activityLevels,
  } = useOnboardingDetailsForm();

  const handleSubmit = async () => {
    if (!isFormValid() || !goal) {
      Alert.alert("Missing Information", "Please fill out all fields and ensure a goal is selected.");
      return;
    }

    setIsLoading(true);

    try {
      const onboardingData: OnboardingData = {
        name: formData.name.trim() || undefined,
        goal: goal,
        height: parseFloat(formData.height) || undefined,
        weight: parseFloat(formData.weight) || undefined,
        dob: formData.age ? `${new Date().getFullYear() - parseInt(formData.age, 10)}-01-01` : undefined,
        gender: formData.gender === null ? undefined : formData.gender,
        activityLevel: formData.activityLevel === null ? undefined : formData.activityLevel,
      };

      if (!onboardingData.height || !onboardingData.weight || !onboardingData.dob || !onboardingData.gender || !onboardingData.activityLevel) {
         Alert.alert("Missing Information", "Please ensure all details (age, height, weight, gender, activity level) are entered correctly.");
         setIsLoading(false);
         return;
      }

      const calculatedGoals = calculateNutritionalGoals(onboardingData);
      if (!calculatedGoals) {
        Alert.alert("Calculation Error", "Could not calculate nutritional goals. Please check your inputs.");
        setIsLoading(false);
        return;
      }
      console.log("Calculated Goals:", calculatedGoals);

      // Map OnboardingData and CalculatedGoals to the Profile interface fields
      const profileUpdates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> = {
        full_name: onboardingData.name,
        // Add mappings for the new fields
        height: onboardingData.height,
        weight: onboardingData.weight,
        dob: onboardingData.dob,
        gender: onboardingData.gender,
        activity_level: onboardingData.activityLevel,
        // Goal fields
        goal_calories: calculatedGoals.calories,
        goal_protein: calculatedGoals.protein,
        goal_carbs: calculatedGoals.carbs,
        goal_fat: calculatedGoals.fat,
      };

      const updatedProfile = await updateProfile(profileUpdates);

      if (!updatedProfile) {
          Alert.alert("Error", "Could not save your profile. Please try again later.");
      } else {
          console.log("Profile updated successfully:", updatedProfile);
          onComplete();
      }

    } catch (error: any) {
      console.error("Error submitting onboarding data:", error);
      Alert.alert("Error", error.message || "Could not save your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <OnboardingHeader
            title="Personal Details"
            subtitle="Help us create your personalized nutrition plan"
        />

        <View style={styles.form}>
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
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <OnboardingFooter
        buttonText="Finish Setup"
        onPress={handleSubmit}
        disabled={isLoading || !isFormValid()}
      />
    </KeyboardAvoidingView>
  );
};

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
    paddingBottom: 100,
  },
  form: {
    gap: 24,
    marginTop: 32,
  },
  inputGroup: {
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
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedGender: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
    gap: 12,
  },
});

export default DetailsScreen; 