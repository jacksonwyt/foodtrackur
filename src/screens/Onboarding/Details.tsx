import React, {useState} from 'react';
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
import {useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '@/store/slices/authSlice';
import {useOnboardingDetailsForm} from '@/hooks/useOnboardingDetailsForm';
import {OnboardingHeader} from '@/components/onboarding/OnboardingHeader';
import {OnboardingFooter} from '@/components/onboarding/OnboardingFooter';
import {ActivityLevelItem} from '@/components/onboarding/ActivityLevelItem';
import {
  OnboardingStackParamList,
  GoalType,
  ActivityLevelType,
} from '../../types/navigation';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import theme from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOnboardingSubmission} from '@/hooks/useOnboardingSubmission';

// Define unit types
type HeightUnit = 'cm' | 'ft_in';
type WeightUnit = 'kg' | 'lbs';
type GoalWeightUnit = 'kg' | 'lbs';

type DetailsScreenRouteProp = RouteProp<OnboardingStackParamList, 'Details'>;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Details'
>;

interface DetailsScreenProps {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
}

const ACTIVITY_LEVELS_FORM = [
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
    id: 'active',
    title: 'Active',
    description: '6-7 days/week',
  },
  {
    id: 'extra_active',
    title: 'Extra Active',
    description: 'Very intense daily exercise',
  },
] as const;

export const DetailsScreen: React.FC<DetailsScreenProps> = ({
  route,
}) => {
  const {goal} = route.params;
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const currentUser = useSelector(selectCurrentUser);

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [goalWeightUnit, setGoalWeightUnit] = useState<GoalWeightUnit>('kg');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [goalWeightInput, setGoalWeightInput] = useState('');
  const [goalPaceInput, setGoalPaceInput] = useState('');

  const {
    formData,
    errors: formErrors,
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    handleSubmit: validateFormInputs,
  } = useOnboardingDetailsForm();

  const {
    submitDetails,
    isLoading,
    error: submissionError,
  } = useOnboardingSubmission({
    goal,
    currentUser,
    formData,
    heightUnit,
    feet,
    inches,
    weightUnit,
    goalWeightInput,
    goalWeightUnit,
    goalPaceInput,
  });

  const handleFormSubmit = async () => {
    if (!validateFormInputs()) {
      console.log('Form validation failed. Errors:', formErrors);
      return;
    }
    await submitDetails();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <OnboardingHeader title="Your Details" currentStep={3} totalSteps={3} />
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={text => handleInputChange('name', text)}
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
          />
          {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.infoText}>Your age helps us accurately calculate your daily energy needs.</Text>
          <TextInput
            style={[styles.input, focusedInput === 'age' && styles.inputFocused]}
            placeholder="Enter your age"
            value={formData.age}
            onChangeText={text => handleInputChange('age', text)}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('age')}
            onBlur={() => setFocusedInput(null)}
          />
          {formErrors.age && <Text style={styles.errorText}>{formErrors.age}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Sex</Text>
          <Text style={styles.infoText}>Biological sex is used to estimate metabolic rates for goal calculations.</Text>
          <View style={styles.genderSelectionContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'male' && styles.genderButtonSelected,
              ]}
              onPress={() => handleGenderSelect('male')}>
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === 'male' && styles.genderButtonTextSelected,
                ]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'female' && styles.genderButtonSelected,
              ]}
              onPress={() => handleGenderSelect('female')}>
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === 'female' &&
                    styles.genderButtonTextSelected,
                ]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'other' && styles.genderButtonSelected,
              ]}
              onPress={() => handleGenderSelect('other')}>
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === 'other' &&
                    styles.genderButtonTextSelected,
                ]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
          {formErrors.gender && <Text style={styles.errorText}>{formErrors.gender}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.infoText}>Your height is a key factor in determining your personalized calorie and nutrient targets.</Text>
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                heightUnit === 'cm' && styles.unitButtonSelected,
              ]}
              onPress={() => setHeightUnit('cm')}>
              <Text
                style={[
                  styles.unitButtonText,
                  heightUnit === 'cm' && styles.unitButtonTextSelected,
                ]}>
                cm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                heightUnit === 'ft_in' && styles.unitButtonSelected,
              ]}
              onPress={() => setHeightUnit('ft_in')}>
              <Text
                style={[
                  styles.unitButtonText,
                  heightUnit === 'ft_in' && styles.unitButtonTextSelected,
                ]}>
                ft, in
              </Text>
            </TouchableOpacity>
          </View>
          {heightUnit === 'cm' ? (
            <TextInput
              style={[styles.input, focusedInput === 'height_cm' && styles.inputFocused]}
              placeholder="Height in cm"
              value={formData.height}
              onChangeText={text => handleInputChange('height', text)}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textPlaceholder}
              onFocus={() => setFocusedInput('height_cm')}
              onBlur={() => setFocusedInput(null)}
            />
          ) : (
            <View style={styles.imperialHeightContainer}>
              <TextInput
                style={[styles.input, styles.imperialInput, focusedInput === 'height_ft' && styles.inputFocused]}
                placeholder="ft"
                value={feet}
                onChangeText={setFeet}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textPlaceholder}
                onFocus={() => setFocusedInput('height_ft')}
                onBlur={() => setFocusedInput(null)}
              />
              <TextInput
                style={[styles.input, styles.imperialInput, focusedInput === 'height_in' && styles.inputFocused]}
                placeholder="in"
                value={inches}
                onChangeText={setInches}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textPlaceholder}
                onFocus={() => setFocusedInput('height_in')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          )}
          {formErrors.height && <Text style={styles.errorText}>{formErrors.height}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Current Weight</Text>
          <Text style={styles.infoText}>Your current weight is essential for calculating your baseline metabolism and tracking progress towards your goal.</Text>
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === 'kg' && styles.unitButtonSelected,
              ]}
              onPress={() => setWeightUnit('kg')}>
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === 'kg' && styles.unitButtonTextSelected,
                ]}>
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === 'lbs' && styles.unitButtonSelected,
              ]}
              onPress={() => setWeightUnit('lbs')}>
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === 'lbs' && styles.unitButtonTextSelected,
                ]}>
                lbs
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, focusedInput === 'weight' && styles.inputFocused]}
            placeholder={`Weight in ${weightUnit}`}
            value={formData.weight}
            onChangeText={text => handleInputChange('weight', text)}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('weight')}
            onBlur={() => setFocusedInput(null)}
          />
          {formErrors.weight && <Text style={styles.errorText}>{formErrors.weight}</Text>}
        </View>

        {(goal === 'lose' || goal === 'gain') && (
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Desired Weight (Optional)</Text>
            <View style={styles.unitToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  goalWeightUnit === 'kg' && styles.unitButtonSelected,
                ]}
                onPress={() => setGoalWeightUnit('kg')}>
                <Text
                  style={[
                    styles.unitButtonText,
                    goalWeightUnit === 'kg' && styles.unitButtonTextSelected,
                  ]}>
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  goalWeightUnit === 'lbs' && styles.unitButtonSelected,
                ]}
                onPress={() => setGoalWeightUnit('lbs')}>
                <Text
                  style={[
                    styles.unitButtonText,
                    goalWeightUnit === 'lbs' && styles.unitButtonTextSelected,
                  ]}>
                  lbs
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, focusedInput === 'goalWeight' && styles.inputFocused]}
              placeholder={`Desired weight in ${goalWeightUnit}`}
              value={goalWeightInput}
              onChangeText={setGoalWeightInput}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textPlaceholder}
              onFocus={() => setFocusedInput('goalWeight')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        )}

        {(goal === 'lose' || goal === 'gain') && (
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Goal Pace (Optional)</Text>
            <TextInput
              style={[styles.input, focusedInput === 'goalPace' && styles.inputFocused]}
              placeholder="e.g., 0.5 kg/week or 1 lb/week"
              value={goalPaceInput}
              onChangeText={setGoalPaceInput}
              placeholderTextColor={theme.colors.textPlaceholder}
              onFocus={() => setFocusedInput('goalPace')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Activity Level</Text>
          <Text style={styles.infoText}>Your activity level helps us estimate your total daily energy expenditure.</Text>
          {ACTIVITY_LEVELS_FORM.map(level => (
            <ActivityLevelItem
              key={level.id}
              title={level.title}
              description={level.description}
              isSelected={formData.activityLevel === level.id}
              onPress={() => handleActivitySelect(level.id)}
            />
          ))}
          {formErrors.activityLevel && (
            <Text style={styles.errorText}>{formErrors.activityLevel}</Text>
          )}
        </View>
        {submissionError && (
          <View style={styles.sectionContainer}>
            <Text style={styles.errorText}>Submission Error: {submissionError}</Text>
          </View>
        )}
      </ScrollView>
      <OnboardingFooter
        onPress={() => {
          void handleFormSubmit();
        }}
        buttonText="Calculate & Save"
        disabled={isLoading}
        isLoading={isLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },
  infoText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
    fontFamily: theme.typography.fontFamily,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.sm,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  genderSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderButtonText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },
  genderButtonTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  unitButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },
  unitButtonTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  imperialHeightContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  imperialInput: {
    flex: 1,
  },
});

export default DetailsScreen;
