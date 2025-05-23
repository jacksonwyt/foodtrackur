import {supabase} from './supabaseClient';
import {getCurrentUser} from './auth/authService';
import {User, PostgrestError} from '@supabase/supabase-js'; // Added for explicit user type
import {
  type FoodLog,
  type AddFoodLogData,
  type UpdateFoodLogData,
} from '../types/foodLog';

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
export type UpdateFoodLogData = Partial<
  Omit<FoodLog, 'id' | 'user_id' | 'created_at' | 'log_date'>
>;

// --- Service Functions ---

/**
 * Adds a new food log entry for the current user.
 */
export async function addFoodLog(
  foodLog: Omit<FoodLog, 'id' | 'created_at' | 'user_id'>,
): Promise<FoodLog | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error adding food log:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }

  const logToInsert = {
    ...foodLog,
    user_id: authUser.id,
  };

  const {data, error}: {data: FoodLog[] | null; error: PostgrestError | null} =
    await supabase.from('food_logs').insert(logToInsert).select();

  if (error) {
    console.error('Error adding food log:', error);
    return null;
  }
  return data?.[0] || null;
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
export async function getFoodLogByDate(
  userId: string,
  date: string,
): Promise<FoodLog[] | null> {
  // Ensure the user calling this function is the one whose logs are being fetched,
  // or has appropriate permissions if this function were to be used by admins, etc.
  // For now, assuming a user can only fetch their own logs.
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error fetching food log by date:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }
  if (authUser.id !== userId) {
    console.error('User mismatch: Cannot fetch logs for another user.');
    return null;
  }

  const {data, error}: {data: FoodLog[] | null; error: PostgrestError | null} =
    await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', date);

  if (error) {
    console.error(
      'Error fetching food log by date. Message:',
      error.message,
      'Details:',
      error.details,
      'Hint:',
      error.hint,
      'Stack:',
      error.stack, // May not always be present or useful for DB errors but good to include
    );
    return null;
  }
  return data;
}

/**
 * Retrieves a food log entry by its ID.
 * @param id - The ID of the food log entry to retrieve.
 */
export async function getFoodLogById(id: number): Promise<FoodLog | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error fetching food log by ID:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }

  const {data, error}: {data: FoodLog | null; error: PostgrestError | null} =
    await supabase
      .from('food_logs')
      .select('*')
      .eq('id', id)
      .eq('user_id', authUser.id) // Ensure user owns the log
      .single();

  if (error) {
    console.error('Error fetching food log by ID:', error);
    return null;
  }
  return data;
}

/**
 * Updates an existing food log entry.
 * Ensures the user can only update their own entries.
 * @param logId - The ID of the food log entry to update.
 * @param updates - An object containing the fields to update.
 */
export async function updateFoodLog(
  id: number,
  updates: Partial<Omit<FoodLog, 'id' | 'user_id' | 'created_at'>>,
): Promise<FoodLog | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error updating food log:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }

  const {data, error}: {data: FoodLog[] | null; error: PostgrestError | null} =
    await supabase
      .from('food_logs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', authUser.id) // Ensure user owns the log
      .select();

  if (error) {
    console.error('Error updating food log:', error);
    return null;
  }
  return data?.[0] || null;
}

/**
 * Deletes a food log entry.
 * Ensures the user can only delete their own entries.
 * @param logId - The ID of the food log entry to delete.
 */
export async function deleteFoodLog(id: number): Promise<boolean> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error deleting food log:',
      authError?.message || 'User not authenticated.',
    );
    return false;
  }

  const {error, count}: {error: PostgrestError | null; count: number | null} =
    await supabase
      .from('food_logs')
      .delete({count: 'exact'})
      .eq('id', id)
      .eq('user_id', authUser.id); // Ensure user owns the log

  if (error) {
    console.error('Error deleting food log:', error);
    return false;
  }
  return count === 1;
}

export async function getFoodLogSummaryByDateRange(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Array<{
  date: string;
  total_calories: number;
  total_protein: number;
}> | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error fetching food log summary:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }
  if (authUser.id !== userId) {
    console.error('User mismatch: Cannot fetch summary for another user.');
    return null;
  }

  // Explicitly type the result of the RPC call
  const rpcResult: {
    data: Array<{
      date: string;
      total_calories: number;
      total_protein: number;
    }> | null;
    error: PostgrestError | null;
  } = await supabase.rpc('get_food_log_summary_by_date_range', {
    p_user_id: userId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  const {data, error} = rpcResult;

  if (error) {
    console.error('Error fetching food log summary by date range:', error);
    return null;
  }
  return data;
}
