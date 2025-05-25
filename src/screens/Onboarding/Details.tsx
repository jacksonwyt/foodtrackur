import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentUser} from '@/store/slices/authSlice';
import {
  updateUserProfileAndCompleteOnboarding,
} from '@/store/slices/profileSlice';
import {useOnboardingDetailsForm} from '@/hooks/useOnboardingDetailsForm';
import {OnboardingHeader} from '@/components/onboarding/OnboardingHeader';
import {OnboardingFooter} from '@/components/onboarding/OnboardingFooter';
import {ActivityLevelItem} from '@/components/onboarding/ActivityLevelItem';
import {
  OnboardingStackParamList,
  OnboardingData,
  GoalType,
  ActivityLevelType,
} from '../../types/navigation';
import {
  calculateNutritionalGoals,
  CalculatedGoals,
} from '../../utils/calculations';
import type {UpdateProfileData} from '../../types/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import theme from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  convertHeightToCm,
  convertWeightToKg,
} from '../../utils/unitConversions';
import {AppDispatch} from '@/store/store';

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

// Helper function to prepare OnboardingData
function prepareOnboardingData(
  formData: ReturnType<typeof useOnboardingDetailsForm>['formData'],
  goal: GoalType,
  heightInCm: number,
  weightInKg: number,
  goalWeightInKg: number | undefined | null,
  parsedGoalPace: number | undefined | null,
): OnboardingData {
  return {
    name: formData.name.trim() || undefined,
    goal: goal,
    height: heightInCm,
    weight: weightInKg,
    dob: formData.age
      ? `${new Date().getFullYear() - parseInt(formData.age, 10)}-01-01`
      : undefined,
    gender: formData.gender === null ? undefined : formData.gender,
    activityLevel:
      formData.activityLevel === null
        ? undefined
        : (formData.activityLevel as ActivityLevelType),
    goal_weight: goalWeightInKg,
    goal_pace: parsedGoalPace,
  };
}

// Helper function to prepare UpdateProfileData
function prepareProfileUpdateData(
  onboardingData: OnboardingData,
  calculatedGoals: CalculatedGoals,
): UpdateProfileData {
  const profileUpdate: UpdateProfileData = {
    username: onboardingData.name,
    height_cm:
      typeof onboardingData.height === 'number'
        ? onboardingData.height
        : undefined,
    dob: onboardingData.dob ? onboardingData.dob : undefined,
    gender: onboardingData.gender,
    activity_level: onboardingData.activityLevel,
    target_calories: calculatedGoals.calories,
    target_protein_g: calculatedGoals.protein,
    target_carbs_g: calculatedGoals.carbs,
    target_fat_g: calculatedGoals.fat,
    goal: onboardingData.goal,
    goal_weight: onboardingData.goal_weight,
    goal_pace: onboardingData.goal_pace,
  };
  return profileUpdate;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const {goal} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch<AppDispatch>();

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [goalWeightUnit, setGoalWeightUnit] = useState<GoalWeightUnit>('kg');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [goalWeightInput, setGoalWeightInput] = useState('');
  const [goalPaceInput, setGoalPaceInput] = useState('');

  const {
    formData,
    errors,
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    handleSubmit: validateFormInputs,
  } = useOnboardingDetailsForm();

  const handleSubmit = async () => {
    if (!validateFormInputs()) {
      console.log('Form validation failed. Errors:', errors);
      return;
    }

    if (!currentUser || !currentUser.id) {
      Alert.alert(
        'Authentication Error',
        'User not found. Please ensure you are logged in.',
      );
      setIsLoading(false);
      return;
    }
    const userId = currentUser.id;

    if (goal === 'lose' || goal === 'gain') {
      if (
        goalWeightInput.trim() !== '' &&
        (isNaN(parseFloat(goalWeightInput)) || parseFloat(goalWeightInput) <= 0)
      ) {
        Alert.alert(
          'Invalid Desired Weight',
          'If you enter a desired weight, it must be a positive number.',
        );
        return;
      }
      if (
        goalPaceInput.trim() !== '' &&
        (isNaN(parseFloat(goalPaceInput)) || parseFloat(goalPaceInput) <= 0)
      ) {
        Alert.alert(
          'Invalid Goal Pace',
          'If you enter a goal pace, it must be a positive number.',
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      const heightInCm = convertHeightToCm(
        formData.height,
        heightUnit,
        feet,
        inches,
      );
      const weightInKg = convertWeightToKg(formData.weight, weightUnit);

      if (heightInCm === undefined || heightInCm <= 0) {
        Alert.alert('Invalid Height', 'Please enter a valid height.');
        setIsLoading(false);
        return;
      }
      if (weightInKg === undefined || weightInKg <= 0) {
        Alert.alert('Invalid Weight', 'Please enter a valid current weight.');
        setIsLoading(false);
        return;
      }

      let goalWeightInKg: number | undefined | null = null;
      if (
        (goal === 'lose' || goal === 'gain') &&
        goalWeightInput.trim() !== ''
      ) {
        goalWeightInKg = convertWeightToKg(goalWeightInput, goalWeightUnit);
      }

      let parsedGoalPace: number | undefined | null = null;
      if ((goal === 'lose' || goal === 'gain') && goalPaceInput.trim() !== '') {
        const gp = parseFloat(goalPaceInput);
        if (!isNaN(gp)) {
          parsedGoalPace = gp;
        }
      }

      const onboardingData = prepareOnboardingData(
        formData,
        goal,
        heightInCm,
        weightInKg,
        goalWeightInKg,
        parsedGoalPace,
      );

      if (
        onboardingData.height === undefined ||
        onboardingData.height <= 0 ||
        onboardingData.weight === undefined ||
        onboardingData.weight <= 0 ||
        !onboardingData.dob ||
        !onboardingData.gender ||
        !onboardingData.activityLevel
      ) {
        Alert.alert(
          'Missing Information',
          'Please ensure all details (age, height, weight, gender, activity level) are entered correctly.',
        );
        setIsLoading(false);
        return;
      }

      const calculatedGoals = calculateNutritionalGoals(onboardingData);
      if (!calculatedGoals) {
        Alert.alert(
          'Calculation Error',
          'Could not calculate nutritional goals. Please check your inputs.',
        );
        setIsLoading(false);
        return;
      }
      console.log('Calculated Goals:', calculatedGoals);

      const profileUpdates = prepareProfileUpdateData(
        onboardingData,
        calculatedGoals,
      );

      await dispatch(
        updateUserProfileAndCompleteOnboarding({
          userId,
          profileData: profileUpdates,
        }),
      ).unwrap();
      
      console.log(
        'Profile update and onboarding completion dispatched for user:', 
        userId
      );

      navigation.navigate('NutritionGoals');

    } catch (err) {
      console.error('Error submitting onboarding data:', err);
      let alertMessage = 'Could not save your profile. Please try again.';
      if (err instanceof Error) {
        alertMessage = err.message;
      } else if (typeof err === 'string') {
        alertMessage = err;
      }
      Alert.alert('Error', alertMessage);
    } finally {
      setIsLoading(false);
    }
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
        <OnboardingHeader title="Your Details" />
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
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Age</Text>
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
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Sex</Text>
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
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Height</Text>
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
          {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Current Weight</Text>
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
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
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
          {ACTIVITY_LEVELS_FORM.map(level => (
            <ActivityLevelItem
              key={level.id}
              title={level.title}
              description={level.description}
              isSelected={formData.activityLevel === level.id}
              onPress={() => handleActivitySelect(level.id)}
            />
          ))}
          {errors.activityLevel && (
            <Text style={styles.errorText}>{errors.activityLevel}</Text>
          )}
        </View>
      </ScrollView>
      <OnboardingFooter
        onPress={() => {
          void handleSubmit();
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
