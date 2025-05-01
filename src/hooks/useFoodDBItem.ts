import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

// Placeholder for the actual food item data structure
interface FoodDBItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Add other relevant fields
}

export const useFoodDBItem = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // Type the search params
  const [foodItem, setFoodItem] = useState<FoodDBItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      if (!id) {
        setError('Food ID is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Replace with actual data fetching logic based on id
        const fetchedData: FoodDBItem = {
            id: id,
            name: `Sample Food Item ${id}`,
            calories: Math.floor(Math.random() * 500) + 100,
            protein: Math.floor(Math.random() * 30) + 5,
            carbs: Math.floor(Math.random() * 50) + 10,
            fat: Math.floor(Math.random() * 20) + 2,
        };
        setFoodItem(fetchedData);
      } catch (err) {
        console.error('Error fetching food item:', err);
        setError('Failed to load food details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  return {
    id,
    foodItem,
    isLoading,
    error,
  };
}; 