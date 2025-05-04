import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth/authService';
import { User } from '@supabase/supabase-js'; // Added for explicit user type

// --- Food Log Interface ---
// Represents the structure of data in the 'food_logs' table
export interface FoodLog {
  id: number; // Or string (UUID) depending on your table primary key
  user_id: string; // Foreign key referencing auth.users.id
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string; // e.g., 'g', 'oz', 'cup', 'item'
  log_date: string; // ISO 8601 timestamp string (e.g., YYYY-MM-DDTHH:mm:ssZ)
  created_at?: string; // Supabase automatically handles this
}

// Type for data needed when *adding* a new food log (omits id, user_id, created_at)
export type AddFoodLogData = Omit<FoodLog, 'id' | 'user_id' | 'created_at'>;

// Type for data needed when *updating* a food log (all fields optional)
export type UpdateFoodLogData = Partial<Omit<FoodLog, 'id' | 'user_id' | 'created_at' | 'log_date'>>;

// --- Service Functions ---

/**
 * Adds a new food log entry for the current user.
 */
export async function addFoodLog(logData: AddFoodLogData): Promise<FoodLog | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null; // Return null instead of throwing to allow UI to handle non-auth state
  }

  const logToInsert = {
    ...logData,
    user_id: authUser.id,
  };

  try {
    const { data, error } = await supabase
      .from('food_logs')
      .insert(logToInsert)
      .select()
      .single(); // Return the newly created log

    if (error) {
      console.error('Error adding food log:', error);
      // Consider more specific error handling based on Supabase error codes
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error adding food log:', error);
    return null;
  }
}

/**
 * Retrieves all food log entries for the current user on a specific date.
 * Assumes the date is in a format that allows direct comparison or requires range filtering.
 * Supabase works well with ISO 8601 strings. If log_date stores only YYYY-MM-DD,
 * direct equality is fine. If it stores full timestamps, we need date range filtering.
 * Let's assume log_date stores the full timestamp for flexibility.
 *
 * @param date - The date string in 'YYYY-MM-DD' format.
 */
export async function getFoodLogsByDate(date: string): Promise<FoodLog[] | null> {
 const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  // Construct date range for the given day (YYYY-MM-DD)
  // Supabase `timestamp` or `timestamptz` columns work well with ISO 8601 strings.
  const startDate = `${date}T00:00:00.000Z`; // Start of the day in UTC
  const endDate = `${date}T23:59:59.999Z`;   // End of the day in UTC

  try {
    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', authUser.id)
      .gte('log_date', startDate) // Greater than or equal to start of day
      .lte('log_date', endDate)   // Less than or equal to end of day
      .order('log_date', { ascending: true }); // Optional: order by time

    if (error) {
      // Log the full Supabase error object for better debugging
      console.error('Supabase error fetching food logs by date:', JSON.stringify(error, null, 2));
      return null;
    }

    // If no logs found, Supabase returns an empty array, which is valid.
    return data;
  } catch (err) { // Use different variable name to avoid shadowing
    // Log the full catch block error
    console.error('Database error fetching food logs by date:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) {
      console.error('Stack trace:', err.stack);
    }
    return null;
  }
}

/**
 * Updates an existing food log entry.
 * Ensures the user can only update their own entries.
 * @param logId - The ID of the food log entry to update.
 * @param updates - An object containing the fields to update.
 */
export async function updateFoodLog(logId: number, updates: UpdateFoodLogData): Promise<FoodLog | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  // Ensure no forbidden fields are accidentally included in updates
  const validUpdates: Partial<FoodLog> = { ...updates };
  delete (validUpdates as any).id;
  delete (validUpdates as any).user_id;
  delete (validUpdates as any).created_at;
  delete (validUpdates as any).log_date; // Generally shouldn't update log_date via this method

  if (Object.keys(validUpdates).length === 0) {
    console.warn('No valid fields provided for food log update.');
    // Optionally fetch and return the existing log if no updates are needed
    // For now, return null as the operation didn't proceed.
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('food_logs')
      .update(validUpdates)
      .eq('id', logId)
      .eq('user_id', authUser.id) // Crucial: Ensure user owns the log
      .select()
      .single(); // Return the updated log

    if (error) {
      console.error('Error updating food log:', error);
      // Could check for specific errors, e.g., if the row doesn't exist or doesn't match the user_id
      return null;
    }

    // If data is null and no error, it means the row wasn't found or didn't match the user_id
    if (!data) {
      console.warn(`Food log with id ${logId} not found or user mismatch for update.`);
    }

    return data;
  } catch (error) {
    console.error('Database error updating food log:', error);
    return null;
  }
}

/**
 * Deletes a food log entry.
 * Ensures the user can only delete their own entries.
 * @param logId - The ID of the food log entry to delete.
 */
export async function deleteFoodLog(logId: number): Promise<boolean> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return false;
  }

  try {
    const { error, count } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', authUser.id); // Crucial: Ensure user owns the log

    if (error) {
      console.error('Error deleting food log:', error);
      return false;
    }

    // count should be 1 if deletion was successful for the specific user and logId
    // If count is 0, the log either didn't exist or didn't belong to the user.
    const success = count === 1;
    if (!success) {
        console.warn(`Food log with id ${logId} not found or user mismatch for delete. Count: ${count}`);
    }

    return success;

  } catch (error) {
    console.error('Database error deleting food log:', error);
    return false;
  }
} 