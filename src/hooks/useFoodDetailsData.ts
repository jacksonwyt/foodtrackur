import { useState, useEffect } from 'react';

// Mock data structure - replace with your actual Food type/interface
interface FoodItem {
  id: string;
  name: string;
  calories: number;
  time: string;
  category: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
}

// Mock data source - replace with actual data fetching logic (API call, state selector, etc.)
const FOOD_ITEMS: Record<string, FoodItem> = {
  '1': {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    time: '8:30 AM',
    category: 'breakfast',
    macros: { protein: 12, carbs: 58, fat: 6 },
    ingredients: ['Rolled oats', 'Almond milk', 'Mixed berries', 'Honey', 'Chia seeds']
  },
  '2': {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    time: '12:15 PM',
    category: 'lunch',
    macros: { protein: 35, carbs: 25, fat: 22 },
    ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing']
  },
   '3': {
    id: '3',
    name: 'Protein Shake',
    calories: 180,
    time: '3:00 PM',
    category: 'snack',
    macros: { protein: 25, carbs: 8, fat: 3 },
    ingredients: ['Whey protein powder', 'Banana', 'Almond milk', 'Ice cubes']
  }
  // Add other mock items if needed
};

interface UseFoodDetailsDataResult {
  food: FoodItem | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFoodDetailsData = (foodId: string | undefined): UseFoodDetailsDataResult => {
  const [food, setFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!foodId) {
      // Handle invalid ID case if necessary, maybe set an error
      setError(new Error('Invalid Food ID'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate async data fetching
    const timer = setTimeout(() => {
      try {
        const foundFood = FOOD_ITEMS[foodId] || null;
        setFood(foundFood);
        if (!foundFood) {
          // Optionally set an error if food is not found
          // setError(new Error('Food item not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch food details'));
      } finally {
        setIsLoading(false);
      }
    }, 50); // Simulate network delay

    return () => clearTimeout(timer);
  }, [foodId]);

  return { food, isLoading, error };
}; 