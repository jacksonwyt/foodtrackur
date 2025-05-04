import { useState, useEffect, useCallback } from 'react';
import {
  addWeightLog,
  getWeightLogs,
  deleteWeightLog,
  WeightLog,
  AddWeightLogData,
  WeightUnits,
} from '../services/weightLogService';
import { Alert } from 'react-native'; // For showing errors

// Type alias for clarity, matches service definition
export type { WeightLog };

export const useWeightHistoryData = () => {
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const logs = await getWeightLogs();
      if (logs) {
        // Sort logs by date ascending for easier chart processing later
        const sortedLogs = logs.sort(
          (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
        );
        setWeightHistory(sortedLogs);
      } else {
        // Handle case where fetching fails (getWeightLogs returns null)
        setError('Failed to load weight history.');
        setWeightHistory([]); // Ensure state is empty on error
      }
    } catch (err) {
      console.error("Error fetching weight history:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching weight history.');
      setWeightHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Add a new entry
  const addWeightEntry = useCallback(async (weight: number, unit: WeightLog['unit'] = WeightUnits.KG, note?: string) => {
    // Assume default unit KG for now if not provided by form
    const newLogData: AddWeightLogData = {
      weight: weight,
      unit: unit,
      log_date: new Date().toISOString(), // Use current timestamp
      // Note field is not in WeightLog table in service, needs adjustment if required
    };

    try {
      const addedLog = await addWeightLog(newLogData);
      if (addedLog) {
        setWeightHistory(prev => 
          [...prev, addedLog].sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime())
        );
        return true; // Indicate success
      } else {
        Alert.alert('Error', 'Could not save weight log.');
        return false; // Indicate failure
      }
    } catch (err) {
      console.error("Error adding weight entry:", err);
      Alert.alert('Error', err instanceof Error ? err.message : 'An unknown error occurred while saving.');
      return false;
    }
  }, []);

  // TODO: Implement functions for updating/deleting if needed
  // const deleteWeightEntry = useCallback(async (logId: number) => { ... }

  return {
    weightHistory,
    isLoading,
    error,
    addWeightEntry,
    refetchHistory: fetchHistory, // Expose refetch function
  };
}; 