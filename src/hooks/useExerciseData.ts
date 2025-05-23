import {useState, useCallback} from 'react';
import {Ionicons} from '@expo/vector-icons';

// Consider moving interfaces to a central types file (e.g., src/types/data.ts)
export interface ExerciseSuggestion {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  caloriesPerMinute: number;
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // minutes
  calories: number;
  timestamp: Date;
}

// Static data - replace with actual data source/fetching logic
const EXERCISE_SUGGESTIONS: ExerciseSuggestion[] = [
  {name: 'Running', icon: 'walk', caloriesPerMinute: 11.4},
  {name: 'Cycling', icon: 'bicycle', caloriesPerMinute: 8.5},
  {name: 'Swimming', icon: 'water', caloriesPerMinute: 9.8},
  {name: 'Weight Training', icon: 'barbell', caloriesPerMinute: 6.3},
  {name: 'Yoga', icon: 'body', caloriesPerMinute: 4.2},
  {name: 'HIIT', icon: 'fitness', caloriesPerMinute: 12.5},
];

const RECENT_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Morning Run',
    duration: 30,
    calories: 342,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Weight Training',
    duration: 45,
    calories: 283,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Swimming',
    duration: 40,
    calories: 392,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export const useExerciseData = () => {
  // State for recent exercises - in real app, fetch/manage this via state management or API
  const [recentExercises, setRecentExercises] =
    useState<Exercise[]>(RECENT_EXERCISES);

  // Function to simulate saving a new exercise entry
  const addExerciseEntry = useCallback(
    (name: string, duration: number, calories: number) => {
      const newEntry: Exercise = {
        id: Date.now().toString(), // Simple unique ID
        name,
        duration,
        calories,
        timestamp: new Date(),
      };

      // Replace console.log with actual saving logic (API call, update global state, etc.)
      console.log('Saving new exercise entry:', newEntry);

      // Update local recent exercises state (or trigger refetch/update from global state)
      setRecentExercises(prev =>
        [newEntry, ...prev]
          .slice(0, 5) // Keep last 5 recent, for example
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      );

      // Consider adding error handling for the save operation
    },
    [],
  );

  return {
    exerciseSuggestions: EXERCISE_SUGGESTIONS, // Provide static suggestions
    recentExercises, // Provide dynamic recent exercises state
    addExerciseEntry,
  };
};
