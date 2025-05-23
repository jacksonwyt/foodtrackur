import {useState, useEffect, useCallback} from 'react';
import {
  addWeightLog,
  getWeightLogs,
  // deleteWeightLog, // Not used, can be removed if not planned soon
  // WeightLog, // Will be defined locally
  // AddWeightLogParams, // Use AddWeightLogParams
  WeightUnit, // Import WeightUnit type
} from '../services/weightLogService';
import {Alert} from 'react-native'; // For showing errors
// import type { Database } from '../types/database.types'; // Import Database type
import type { WeightLogRow, AddWeightLogParams } from '../types/weightLog'; // Import from centralized location

// Type alias for clarity, should be the Row type from Supabase
// export type WeightLog = Database['public']['Tables']['weight_logs']['Row']; // Removed

// This type is for the data the CALLER of addWeightEntry provides.
// It aligns with AddWeightLogParams from the service.
// export type AddWeightLogDataForHook = { // Removed
//   weight: number;
//   unit: WeightUnit; // Use WeightUnit type
//   log_date: string;
// };

export const useWeightHistoryData = () => {
  const [weightHistory, setWeightHistory] = useState<WeightLogRow[]>([]); // Use WeightLogRow
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
          (a, b) =>
            new Date(a.log_date).getTime() - new Date(b.log_date).getTime(),
        );
        setWeightHistory(sortedLogs);
      } else {
        // Handle case where fetching fails (getWeightLogs returns null)
        setError('Failed to load weight history.');
        setWeightHistory([]); // Ensure state is empty on error
      }
    } catch (err) {
      console.error('Error fetching weight history:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while fetching weight history.',
      );
      setWeightHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory().catch(err => {
      // Errors are handled in fetchHistory, this is for the promise rejection itself
      console.error('Error invoking fetchHistory from useEffect:', err);
      // Optionally set a generic error state if not already handled by fetchHistory
      // setError("Failed to initialize weight history loading.");
      setIsLoading(false); // Ensure loading is stopped
    });
  }, [fetchHistory]);

  // Add a new entry
  const addWeightEntry = useCallback(async (logData: AddWeightLogParams) => { // Use AddWeightLogParams
    // The logData object should already contain weight, unit, and log_date correctly formatted.
    try {
      // Ensure logData passed to addWeightLog matches AddWeightLogParams
      // const serviceLogData: AddWeightLogParams = { // No longer needed, logData is already correct type
      //   weight: logData.weight,
      //   unit: logData.unit,
      //   log_date: logData.log_date,
      // };
      const addedLog = await addWeightLog(logData); // Pass logData directly
      if (addedLog) { // addedLog is WeightLogRow | null
        setWeightHistory(prev =>
          // Ensure prev is WeightLog[] and addedLog is WeightLog (not null)
          [...prev, addedLog].sort(
            (a, b) => // a and b should be WeightLog
              new Date(a.log_date).getTime() - new Date(b.log_date).getTime(),
          ),
        );
        return true; // Indicate success
      } else {
        Alert.alert('Error', 'Could not save weight log.');
        return false; // Indicate failure
      }
    } catch (err) {
      console.error('Error adding weight entry:', err);
      Alert.alert(
        'Error',
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while saving.',
      );
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
