import {useState, useEffect, useMemo, useCallback} from 'react';

// Placeholder for food item structure (reuse from FoodDB or define specific)
interface FoodListItem {
  id: string;
  name: string;
  calories: number;
  // Add other summary fields if needed
}

// Simulate fetching data
const fetchFoodList = async (): Promise<FoodListItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // In a real app, fetch from an API
  return [
    {id: '1', name: 'Apple', calories: 95},
    {id: '2', name: 'Banana', calories: 105},
    {id: '3', name: 'Chicken Breast (100g)', calories: 165},
    {id: '4', name: 'Broccoli (1 cup)', calories: 55},
    {id: '5', name: 'Salmon (100g)', calories: 208},
    {id: '6', name: 'Rice (1 cup cooked)', calories: 206},
  ];
};

export const useFoodScreenLogic = () => {
  const [foodItems, setFoodItems] = useState<FoodListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFoodList();
        setFoodItems(data);
      } catch (err) {
        console.error('Error loading food list:', err);
        setError('Failed to load food list.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData().catch(err => {
      // Errors are handled inside loadData, this is for promise rejection itself
      console.error('Error invoking loadData:', err);
      setError('An unexpected error occurred during data loading.'); // General fallback
      setIsLoading(false); // Ensure loading state is reset
    });
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return foodItems;
    }
    return foodItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [foodItems, searchTerm]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFoodList();
      setFoodItems(data);
    } catch (err) {
      console.error('Error refreshing food list:', err);
      setError('Failed to refresh food list.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    searchTerm,
    filteredItems,
    handleSearchChange,
    refreshData,
  };
};
