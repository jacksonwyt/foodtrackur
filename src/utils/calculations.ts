import { OnboardingData, GoalType, GenderType, ActivityLevelType } from '@/src/types/navigation';

// Placeholder interface for calculated goals
export interface CalculatedGoals {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}

/**
 * Calculates estimated daily nutritional goals based on user data.
 * TODO: Implement actual BMR/TDEE calculation (e.g., Mifflin-St Jeor) and macro splits.
 *
 * @param data The collected onboarding data.
 * @returns Estimated daily goals for calories and macronutrients.
 */
export function calculateNutritionalGoals(data: OnboardingData): CalculatedGoals {
  console.log('Calculating goals with data:', data);

  // --- Placeholder Logic --- 
  // Replace with actual calculations using Harris-Benedict or Mifflin-St Jeor
  let baseCalories = 2000; // Default placeholder

  // Basic adjustments (very simplistic)
  if (data.gender === 'male') {
    baseCalories += 200;
  } else if (data.gender === 'female') {
    baseCalories -= 100;
  }

  // Activity level multiplier (example values)
  const activityMultipliers: Record<ActivityLevelType, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };
  const multiplier = data.activityLevel ? activityMultipliers[data.activityLevel] : 1.2;
  let tdee = baseCalories * multiplier;

  // Goal adjustment (example values)
  const goalAdjustments: Record<GoalType, number> = {
    lose: -500, // Deficit for weight loss
    maintain: 0,
    gain: 500,   // Surplus for weight gain
  };
  const goalAdjustment = data.goal ? goalAdjustments[data.goal] : 0;
  const finalCalories = Math.round(tdee + goalAdjustment);

  // Placeholder macro split (e.g., 40% Carbs, 30% Protein, 30% Fat)
  const proteinGrams = Math.round((finalCalories * 0.30) / 4);
  const carbsGrams = Math.round((finalCalories * 0.40) / 4);
  const fatGrams = Math.round((finalCalories * 0.30) / 9);
  // --- End Placeholder Logic ---

  return {
    calories: finalCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
} 