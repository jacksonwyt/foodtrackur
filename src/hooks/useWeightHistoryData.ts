import { useState, useCallback } from 'react';

// Consider moving this interface to a central types file (e.g., src/types/data.ts)
export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: Date;
  note?: string;
}

// Simulate fetching initial data - replace with actual data source logic (API call, AsyncStorage, etc.)
const initialWeightHistory: WeightEntry[] = [
  {
    id: '1',
    weight: 75.5,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    weight: 75.2,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    weight: 75.0,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    weight: 74.8,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    weight: 74.5,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    weight: 74.3,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    weight: 74.0,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export const useWeightHistoryData = () => {
  // In a real app, this state might be initialized by fetching data in useEffect
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(initialWeightHistory);

  // This function simulates saving the new entry and updating the local state.
  // Replace console.log with actual saving logic (API call, update state management store, etc.)
  const addWeightEntry = useCallback((weight: number, note?: string) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(), // Simple unique ID for demo
      weight: weight,
      note: note?.trim() || undefined,
      timestamp: new Date(),
    };
    
    console.log('Saving new weight entry:', newEntry); // Replace with actual save logic
    
    // Update local state optimistically (or after successful save)
    setWeightHistory(prev => 
      [...prev, newEntry].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    );
    
    // Consider adding error handling for the save operation
  }, []);

  // In a real app, you might add functions here to fetch, update, or delete entries.

  return {
    weightHistory,
    addWeightEntry,
  };
}; 