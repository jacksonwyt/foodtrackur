import type { Database } from './database.types'; // Adjust path if necessary

export type WeightLogRow = Database['public']['Tables']['weight_logs']['Row'];

// Parameters for the function that calls the service to add a log
export type AddWeightLogParams = {
  weight: number;
  unit: 'kg' | 'lbs'; // Or your WeightUnit type
  log_date: string; // Ensure this is ISO 8601 format string "YYYY-MM-DD"
}; 