import { supabase } from './supabaseClient'; // Now a typed client
import { getCurrentUser } from './auth/authService';
import type { PostgrestError } from '@supabase/supabase-js'; // User is already imported
// import type { Database } from '../types/database.types'; // Adjust path if needed
import type { WeightLogRow, AddWeightLogParams } from '../types/weightLog'; // Import from centralized location

// Define WeightUnit if it's specific and not a DB enum
export const WeightUnits = {
  KG: 'kg',
  LBS: 'lbs',
} as const;
export type WeightUnit = (typeof WeightUnits)[keyof typeof WeightUnits];

// Use Supabase generated types
// type WeightLogRow = Database['public']['Tables']['weight_logs']['Row']; // Removed
// type WeightLogInsert = Database['public']['Tables']['weight_logs']['Insert']; // Keep this for now, or move if used elsewhere
// type WeightLogUpdate = Database['public']['Tables']['weight_logs']['Update']; // Keep this for now, or move if used elsewhere
import type { Database } from '../types/database.types'; // Keep for Insert/Update if not moved
type WeightLogInsert = Database['public']['Tables']['weight_logs']['Insert'];
type WeightLogUpdate = Database['public']['Tables']['weight_logs']['Update'];


// Type for data needed when *adding* a new weight log by the caller
// These are the fields the CALLER provides. user_id will be added by the service.
// id and created_at are handled by the DB or service.
// export type AddWeightLogParams = { // Removed
//   weight: number;
//   unit: WeightUnit; // This is fine, as WeightUnit is compatible with string
//   log_date: string; // ISO 8601 timestamp string
// };

// Type for data needed when *updating* a weight log
// These are the fields the CALLER can provide for an update.
export type UpdateWeightLogParams = {
  weight?: number;
  unit?: WeightUnit;
};

// --- Service Functions ---

/**
 * Adds a new weight log entry for the current user.
 */
export async function addWeightLog(
  logData: AddWeightLogParams, // Now uses imported type
): Promise<WeightLogRow | null> { // Return the actual Row type
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error(
      'Authentication error:',
      authError?.message || 'User not authenticated.',
    );
    return null;
  }

  // Construct the object conforming to WeightLogInsert
  // Crucially, do NOT include 'id' if the DB auto-generates it.
  // created_at can be omitted if the DB has a default (e.g., now())
  const logToInsert: WeightLogInsert = {
    weight: logData.weight,
    unit: logData.unit,         // WeightUnit is assignable to string
    log_date: logData.log_date,
    user_id: authUser.id,
    // created_at: new Date().toISOString(), // Optionally set if needed, or let DB handle
  };

  try {
    // With a typed client, no generic is needed for .from() here for basic operations.
    // Supabase infers types from the table name string 'weight_logs'.
    const { data, error } = await supabase
      .from('weight_logs')      // No <WeightLog> generic needed
      .insert(logToInsert)      // logToInsert must match WeightLogInsert
      .select()                 // .select() will now correctly infer returning WeightLogRow[]
      .single();                // .single() makes it WeightLogRow | null

    if (error) {
      console.error('Error adding weight log:', error.message); // Log error message
      return null;
    }
    return data; // data is correctly typed as WeightLogRow | null
  } catch (e: unknown) { // Catch unknown for better type safety
    const error = e as Error; // Or use a more sophisticated error type guard
    console.error('Database error adding weight log:', error.message);
    return null;
  }
}

/**
 * Retrieves all weight logs for the current user, ordered by date descending.
 */
export async function getWeightLogs(): Promise<WeightLogRow[] | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    // ... (error handling)
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*') // Infers selection of all columns from WeightLogRow
      .eq('user_id', authUser.id)
      .order('log_date', { ascending: false });

    if (error) {
      console.error('Error fetching weight logs:', error.message);
      return null;
    }
    return data; // data is WeightLogRow[] | null
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Database error fetching weight logs:', error.message);
    return null;
  }
}

/**
 * Retrieves the latest weight log entry for the current user.
 */
export async function getLatestWeightLog(): Promise<WeightLogRow | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    // ... (error handling)
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', authUser.id)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle(); // Returns WeightLogRow | null

    if (error) {
      console.error('Error fetching latest weight log:', error.message);
      return null;
    }
    return data; // data is WeightLogRow | null
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Database error fetching latest weight log:', error.message);
    return null;
  }
}

/**
 * Updates an existing weight log entry.
 */
export async function updateWeightLog(
  logId: number,
  updates: UpdateWeightLogParams,
): Promise<WeightLogRow | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    // ... (error handling)
    return null;
  }

  // Construct the object conforming to WeightLogUpdate
  const validUpdates: WeightLogUpdate = {};
  if (updates.weight !== undefined) validUpdates.weight = updates.weight;
  if (updates.unit !== undefined) validUpdates.unit = updates.unit; // Assignable

  if (Object.keys(validUpdates).length === 0) {
    console.warn('No valid fields provided for weight log update.');
    return null; // Or return the existing log, or throw an error
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .update(validUpdates) // validUpdates must conform to WeightLogUpdate
      .eq('id', logId)
      .eq('user_id', authUser.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating weight log:', error.message);
      return null;
    }
    if (!data) {
      console.warn(
        `Weight log with id ${logId} not found or user mismatch for update.`,
      );
    }
    return data; // data is WeightLogRow | null
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Database error updating weight log:', error.message);
    return null;
  }
}

/**
 * Deletes a weight log entry.
 */
export async function deleteWeightLog(logId: number): Promise<boolean> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    // ... (error handling)
    return false;
  }

  try {
    const { error, count } = await supabase
      .from('weight_logs') // No generic needed
      .delete()
      .eq('id', logId)
      .eq('user_id', authUser.id);

    if (error) {
      console.error('Error deleting weight log:', error.message);
      return false;
    }
    const success = count === 1;
    if (!success && count !== null) { // only warn if count is not null and not 1
      console.warn(
        `Weight log with id ${logId} not found or user mismatch for delete. Count: ${count}`,
      );
    }
    return success;
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Database error deleting weight log:', error.message);
    return false;
  }
}
