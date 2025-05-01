import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Assuming this type is defined or imported (e.g., from useExerciseData or a types file)
export interface ExerciseSuggestion {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  caloriesPerMinute: number;
}

export const useExerciseFormData = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState(''); // Keep as string for input field
  const [selectedExercise, setSelectedExercise] = useState<ExerciseSuggestion | null>(null);

  // Handles updating form state when a suggestion is selected
  const handleExerciseSelect = useCallback((exercise: ExerciseSuggestion) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    // Optional: Clear duration or set a default? For now, keep it as is.
  }, []);

  const isFormValid = useCallback(() => {
    const minutes = parseInt(duration, 10);
    // Check if exerciseName is non-empty (could be custom or from selection)
    // and duration is a positive number. selectedExercise is needed for calculation,
    // but maybe allow logging without it if name is custom?
    // For now, require selectedExercise for simplicity as calculation depends on it.
    return exerciseName.trim() !== '' && duration !== '' && !isNaN(minutes) && minutes > 0 && selectedExercise !== null;
  }, [exerciseName, duration, selectedExercise]);

  const resetForm = useCallback(() => {
    setExerciseName('');
    setDuration('');
    setSelectedExercise(null);
  }, []);

  return {
    exerciseName,
    setExerciseName,
    duration,
    setDuration,
    selectedExercise,
    setSelectedExercise, // Expose setter if needed directly
    handleExerciseSelect,
    isFormValid,
    resetForm,
  };
}; 