import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth/authService';
import { User } from '@supabase/supabase-js'; // Added for explicit user type

// Define allowed units for weight
export const WeightUnits = {
  KG: 'kg',
  LBS: 'lbs',
} as const; // Use 'as const' for a string literal union type

export type WeightUnit = typeof WeightUnits[keyof typeof WeightUnits]; // 'kg' | 'lbs'

// --- Weight Log Interface ---
// Represents the structure of data in the 'weight_logs' table
export interface WeightLog {
  id: number; // Or string (UUID)
  user_id: string; // Foreign key referencing auth.users.id
  weight: number;
  unit: WeightUnit;
  log_date: string; // ISO 8601 timestamp string (e.g., YYYY-MM-DDTHH:mm:ssZ)
  created_at?: string;
}

// Type for data needed when *adding* a new weight log
export type AddWeightLogData = Omit<WeightLog, 'id' | 'user_id' | 'created_at'>;

// Type for data needed when *updating* a weight log (only weight and unit can be updated)
export type UpdateWeightLogData = Partial<Pick<WeightLog, 'weight' | 'unit'>>;

// --- Service Functions ---

/**
 * Adds a new weight log entry for the current user.
 */
export async function addWeightLog(logData: AddWeightLogData): Promise<WeightLog | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  const logToInsert = {
    ...logData,
    user_id: authUser.id,
  };

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .insert(logToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error adding weight log:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error adding weight log:', error);
    return null;
  }
}

/**
 * Retrieves all weight logs for the current user, ordered by date descending.
 */
export async function getWeightLogs(): Promise<WeightLog[] | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', authUser.id)
      .order('log_date', { ascending: false });

    if (error) {
      console.error('Error fetching weight logs:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching weight logs:', error);
    return null;
  }
}

/**
 * Retrieves the latest weight log entry for the current user.
 */
export async function getLatestWeightLog(): Promise<WeightLog | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', authUser.id)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle() as there might be no logs yet

    if (error) {
      console.error('Error fetching latest weight log:', error);
      return null;
    }

    return data; // Returns the single record or null if none found
  } catch (error) {
    console.error('Database error fetching latest weight log:', error);
    return null;
  }
}

/**
 * Updates an existing weight log entry.
 * Ensures the user can only update their own entries.
 * @param logId - The ID of the weight log to update.
 * @param updates - An object containing the fields to update (weight, unit).
 */
export async function updateWeightLog(logId: number, updates: UpdateWeightLogData): Promise<WeightLog | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  // Explicitly use only allowed fields from UpdateWeightLogData
  const validUpdates: Partial<WeightLog> = {};
  if (updates.weight !== undefined) validUpdates.weight = updates.weight;
  if (updates.unit !== undefined) validUpdates.unit = updates.unit;

  if (Object.keys(validUpdates).length === 0) {
    console.warn('No valid fields provided for weight log update.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('weight_logs')
      .update(validUpdates)
      .eq('id', logId)
      .eq('user_id', authUser.id) // Ensure user owns the log
      .select()
      .single();

    if (error) {
      console.error('Error updating weight log:', error);
      return null;
    }

    if (!data) {
       console.warn(`Weight log with id ${logId} not found or user mismatch for update.`);
    }

    return data;
  } catch (error) {
    console.error('Database error updating weight log:', error);
    return null;
  }
}

/**
 * Deletes a weight log entry.
 * Ensures the user can only delete their own entries.
 * @param logId - The ID of the weight log to delete.
 */
export async function deleteWeightLog(logId: number): Promise<boolean> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return false;
  }

  try {
    const { error, count } = await supabase
      .from('weight_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', authUser.id); // Ensure user owns the log

    if (error) {
      console.error('Error deleting weight log:', error);
      return false;
    }

    const success = count === 1;
     if (!success) {
        console.warn(`Weight log with id ${logId} not found or user mismatch for delete. Count: ${count}`);
    }
    return success;

  } catch (error) {
    console.error('Database error deleting weight log:', error);
    return false;
  }
} 