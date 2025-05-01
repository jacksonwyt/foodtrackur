import { useState, useEffect } from 'react';

// Example data types (consider moving to src/types/ later)
interface RecentItem {
  id: string;
  name: string;
  calories: number;
  time: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// TODO: Replace with actual data fetching logic
// This simulation should ideally live elsewhere (e.g., API service layer)
const fetchRecentItems = async (date: Date): Promise<RecentItem[]> => {
  console.log('[Recent] Fetching items for:', date.toISOString().split('T')[0]);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 450)); // Slightly different delay

  // Return example data for now - potentially vary based on date slightly?
  const baseItems: RecentItem[] = [
    {
      id: '1',
      name: 'Oatmeal with Berries',
      calories: 320,
      time: '8:30 AM',
      category: 'breakfast',
      macros: {
        protein: 12,
        carbs: 58,
        fat: 6,
      },
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 450,
      time: '12:15 PM',
      category: 'lunch',
      macros: {
        protein: 35,
        carbs: 25,
        fat: 22,
      },
    },
    {
      id: '3',
      name: 'Protein Shake',
      calories: 180,
      time: '3:00 PM',
      category: 'snack',
      macros: {
        protein: 25,
        carbs: 8,
        fat: 3,
      },
    },
  ];
  // Simulate slightly different data based on day
  if (date.getDate() % 2 === 0) {
      return baseItems.slice(0, 2);
  }
  return baseItems;
};

export const useHomeRecentItems = (selectedDate: Date) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const loadItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const items = await fetchRecentItems(selectedDate);
        if (isMounted) {
          setRecentItems(items);
        }
      } catch (err) {
         if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch recent items'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();
    
    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [selectedDate]); // Re-run effect when selectedDate changes

  return { recentItems, isLoading, error };
}; 