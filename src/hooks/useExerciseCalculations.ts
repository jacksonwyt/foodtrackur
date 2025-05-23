import {useMemo} from 'react';
import {ExerciseSuggestion} from './useExerciseFormData'; // Or from a central types file

export const useExerciseCalculations = (
  selectedExercise: ExerciseSuggestion | null,
  duration: string,
) => {
  const estimatedCalories = useMemo(() => {
    // Ensure we have a selected exercise and a non-empty duration string
    if (selectedExercise && duration) {
      const minutes = parseInt(duration, 10);
      // Ensure duration parses to a positive number
      if (!isNaN(minutes) && minutes > 0) {
        // Calculate calories based on the selected exercise's rate
        return Math.round(selectedExercise.caloriesPerMinute * minutes);
      }
    }
    // Return null if calculation isn't possible (no selection, invalid duration)
    return null;
  }, [selectedExercise, duration]);

  return {
    estimatedCalories,
  };
};
