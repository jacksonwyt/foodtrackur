import {useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  updateUserProfileAndCompleteOnboarding,
} from '@/store/slices/profileSlice';
import type {AppDispatch} from '@/store/store';
import type {User} from '@supabase/supabase-js';
import type {
  OnboardingData,
  GoalType,
  ActivityLevelType,
  OnboardingStackParamList,
} from '@/types/navigation';
import type {UpdateProfileData} from '@/types/profile';
import {
  calculateNutritionalGoals,
  CalculatedGoals,
} from '@/utils/calculations';
import {
  convertHeightToCm,
  convertWeightToKg,
} from '@/utils/unitConversions';
import type {useOnboardingDetailsForm} from './useOnboardingDetailsForm'; // Assuming this path

// Define unit types (can be moved to a shared types file if used elsewhere)
type HeightUnit = 'cm' | 'ft_in';
type WeightUnit = 'kg' | 'lbs';
type GoalWeightUnit = 'kg' | 'lbs';

interface UseOnboardingSubmissionProps {
  goal: GoalType;
  currentUser: User | null;
  formData: ReturnType<typeof useOnboardingDetailsForm>['formData'];
  heightUnit: HeightUnit;
  feet: string;
  inches: string;
  weightUnit: WeightUnit;
  goalWeightInput: string;
  goalWeightUnit: GoalWeightUnit;
  goalPaceInput: string;
}

interface UseOnboardingSubmissionReturn {
  submitDetails: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Helper function to prepare OnboardingData (can be co-located or imported if used elsewhere)
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

// Helper function to prepare UpdateProfileData (can be co-located or imported if used elsewhere)
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

type DetailsNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'NutritionGoals' // Or the correct next screen
>;

export function useOnboardingSubmission({
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
}: UseOnboardingSubmissionProps): UseOnboardingSubmissionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<DetailsNavigationProp>();

  const submitDetails = async () => {
    setError(null); // Reset error on new submission attempt

    if (!currentUser || !currentUser.id) {
      Alert.alert(
        'Authentication Error',
        'User not found. Please ensure you are logged in.',
      );
      setError('User not found.');
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
        setError('Invalid desired weight.');
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
        setError('Invalid goal pace.');
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
        setError('Invalid height.');
        setIsLoading(false);
        return;
      }
      if (weightInKg === undefined || weightInKg <= 0) {
        Alert.alert('Invalid Weight', 'Please enter a valid current weight.');
        setError('Invalid current weight.');
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
        setError('Missing required onboarding information.');
        setIsLoading(false);
        return;
      }

      const calculatedGoals = calculateNutritionalGoals(onboardingData);
      if (!calculatedGoals) {
        Alert.alert(
          'Calculation Error',
          'Could not calculate nutritional goals. Please check your inputs.',
        );
        setError('Could not calculate nutritional goals.');
        setIsLoading(false);
        return;
      }
      console.log('Calculated Goals (from hook):', calculatedGoals);

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
        'Profile update and onboarding completion dispatched (from hook) for user:',
        userId,
      );

    } catch (err) {
      console.error('Error submitting onboarding data (from hook):', err);
      let alertMessage = 'Could not save your profile. Please try again.';
      if (err instanceof Error) {
        alertMessage = err.message;
      } else if (typeof err === 'string') {
        alertMessage = err;
      }
      setError(alertMessage);
      Alert.alert('Error', alertMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {submitDetails, isLoading, error};
} 