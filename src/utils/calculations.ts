import {
  OnboardingData,
  GoalType,
  GenderType,
  ActivityLevelType,
  AppStackParamList,
} from '@/types/navigation';
import {subDays, formatISO, parseISO} from 'date-fns';
// import { Profile } from '@/types/profile'; // Commented out for now
// import { DailyLog } from '@/types/log'; // Commented out for now

// Placeholder interface for calculated goals
export interface CalculatedGoals {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

/**
 * Calculates age from a Date of Birth string.
 * @param dobString Date of Birth in "YYYY-MM-DD" format.
 * @returns Age in years, or null if dobString is invalid.
 */
function calculateAge(dobString?: string): number | null {
  if (!dobString) return null;
  try {
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null; // Invalid date

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
}

/**
 * Calculates estimated daily nutritional goals based on user data
 * using the Mifflin-St Jeor equation for BMR.
 *
 * Assumes:
 * - data.weight is in KG
 * - data.height is in CM
 * - data.dob is a "YYYY-MM-DD" string to calculate age
 *
 * @param data The collected onboarding data.
 * @returns Estimated daily goals for calories and macronutrients, or null if essential data is missing.
 */
export function calculateNutritionalGoals(
  data: OnboardingData,
): CalculatedGoals | null {
  console.log('Calculating goals with data:', data);

  const age = calculateAge(data.dob);

  if (
    data.height === undefined ||
    data.height === null ||
    data.height <= 0 ||
    data.weight === undefined ||
    data.weight === null ||
    data.weight <= 0 ||
    age === undefined ||
    age === null ||
    age <= 0 ||
    !data.gender || // This ensures gender is not null, undefined, or empty string
    !data.activityLevel || // This ensures activityLevel is not null, undefined, or empty string
    !data.goal
  ) {
    console.error('Essential data for calculation is missing or invalid:', {
      height: data.height,
      weight: data.weight,
      age: age,
      gender: data.gender,
      activityLevel: data.activityLevel,
      goal: data.goal,
    });
    return null;
  }

  // At this point, data.gender, data.activityLevel, and data.goal are guaranteed to be truthy (i.e., valid strings from their respective types)

  let bmr: number;
  if (data.gender === 'male') {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * age + 5;
  } else if (data.gender === 'female') {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * age - 161;
  } else {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * age - 78; // Example for 'other'
  }

  // Cast data.activityLevel to exclude null/undefined as it's checked above
  const currentActivityLevel = data.activityLevel;

  const activityMultipliers: Record<
    Exclude<ActivityLevelType, null | undefined>,
    number
  > = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725, // Corrected from 'very'
    extra_active: 1.9, // Corrected from 'extra'
  };
  // Now use the asserted currentActivityLevel for indexing
  const multiplier = activityMultipliers[currentActivityLevel];
  if (multiplier === undefined) {
    // Added a check for safety, though theoretically covered
    console.error(
      'Could not find multiplier for activity level:',
      currentActivityLevel,
    );
    return null;
  }
  const tdee = bmr * multiplier;

  // Goal adjustment
  // Consider using data.goalPace if available to make this more dynamic
  // e.g. 1 lb/week = ~500 calorie deficit/surplus per day
  // e.g. 0.5 kg/week = ~500 calorie deficit/surplus per day
  const goalAdjustments: Record<GoalType, number> = {
    lose: -500,
    maintain: 0,
    gain: 500,
  };
  const calorieAdjustment = goalAdjustments[data.goal];
  const finalCalories = Math.round(tdee + calorieAdjustment);

  // Macronutrient split (example: 40% Carbs, 30% Protein, 30% Fat)
  // Ensure these percentages sum to 100% if modified.
  const proteinPercentage = 0.3; // 30%
  const carbsPercentage = 0.4; // 40%
  const fatPercentage = 0.3; // 30%

  const proteinGrams = Math.round((finalCalories * proteinPercentage) / 4); // 4 calories per gram of protein
  const carbsGrams = Math.round((finalCalories * carbsPercentage) / 4); // 4 calories per gram of carbs
  const fatGrams = Math.round((finalCalories * fatPercentage) / 9); // 9 calories per gram of fat

  if (
    finalCalories <= 0 ||
    proteinGrams <= 0 ||
    carbsGrams <= 0 ||
    fatGrams <= 0
  ) {
    console.error(
      'Calculated nutritional goals are unrealistic or negative. Check inputs and formulas.',
      {
        finalCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
      },
    );
    // It might be better to return a default safe value or specific error
    return null;
  }

  return {
    calories: finalCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
}
