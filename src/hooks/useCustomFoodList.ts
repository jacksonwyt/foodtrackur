import {useState, useEffect} from 'react';
import {CustomFood, getCustomFoods} from '../services/customFoodService';

interface UseCustomFoodListReturn {
  customFoods: CustomFood[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>; // Function to manually refetch data
}

export function useCustomFoodList(): UseCustomFoodListReturn {
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomFoods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomFoods();
      setCustomFoods(data || []); // Handle null case from service
    } catch (err) {
      console.error('Error fetching custom foods in hook:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch custom foods'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCustomFoods();
  }, []); // Fetch on initial mount

  return {customFoods, isLoading, error, refetch: fetchCustomFoods};
}
