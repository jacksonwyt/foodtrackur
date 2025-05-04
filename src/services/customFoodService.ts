import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth/authService';
import { User } from '@supabase/supabase-js'; // Added for explicit user type

// --- Custom Food Interface ---
// Represents the structure of data in the 'custom_foods' table
export interface CustomFood {
  id: number; // Or string (UUID)
  user_id: string; // Foreign key referencing auth.users.id
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string;
  created_at?: string;
}

// Type for data needed when *adding* a new custom food
export type AddCustomFoodData = Omit<CustomFood, 'id' | 'user_id' | 'created_at'>;

// Type for data needed when *updating* a custom food
export type UpdateCustomFoodData = Partial<AddCustomFoodData>; // All add fields are optional

// --- Service Functions ---

/**
 * Adds a new custom food entry for the current user.
 */
export async function addCustomFood(foodData: AddCustomFoodData): Promise<CustomFood | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  const foodToInsert = {
    ...foodData,
    user_id: authUser.id,
  };

  try {
    const { data, error } = await supabase
      .from('custom_foods')
      .insert(foodToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error adding custom food:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error adding custom food:', error);
    return null;
  }
}

/**
 * Retrieves all custom foods created by the current user.
 */
export async function getCustomFoods(): Promise<CustomFood[] | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('custom_foods')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false }); // Optional: order by creation date

    if (error) {
      console.error('Error fetching custom foods:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching custom foods:', error);
    return null;
  }
}

/**
 * Retrieves a specific custom food entry by its ID.
 * Ensures the user can only retrieve their own entries.
 * @param foodId - The ID of the custom food to retrieve.
 */
export async function getCustomFoodById(foodId: number): Promise<CustomFood | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('custom_foods')
      .select('*')
      .eq('id', foodId)
      .eq('user_id', authUser.id) // Ensure user owns the food
      .maybeSingle(); // Use maybeSingle() as the item might not exist or belong to the user

    if (error) {
      console.error('Error fetching custom food by ID:', error);
      return null;
    }

    return data; // Returns the food item or null if not found/not owned
  } catch (error) {
    console.error('Database error fetching custom food by ID:', error);
    return null;
  }
}

/**
 * Updates an existing custom food entry.
 * Ensures the user can only update their own entries.
 * @param foodId - The ID of the custom food to update.
 * @param updates - An object containing the fields to update.
 */
export async function updateCustomFood(foodId: number, updates: UpdateCustomFoodData): Promise<CustomFood | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return null;
  }

  // Ensure no forbidden fields are accidentally included in updates
  const validUpdates: Partial<CustomFood> = { ...updates };
  delete (validUpdates as any).id;
  delete (validUpdates as any).user_id;
  delete (validUpdates as any).created_at;

  if (Object.keys(validUpdates).length === 0) {
    console.warn('No valid fields provided for custom food update.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('custom_foods')
      .update(validUpdates)
      .eq('id', foodId)
      .eq('user_id', authUser.id) // Ensure user owns the food
      .select()
      .single();

    if (error) {
      console.error('Error updating custom food:', error);
      return null;
    }

    if (!data) {
      console.warn(`Custom food with id ${foodId} not found or user mismatch for update.`);
    }

    return data;
  } catch (error) {
    console.error('Database error updating custom food:', error);
    return null;
  }
}

/**
 * Deletes a custom food entry.
 * Ensures the user can only delete their own entries.
 * @param foodId - The ID of the custom food to delete.
 */
export async function deleteCustomFood(foodId: number): Promise<boolean> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    console.error('Authentication error:', authError?.message || 'User not authenticated.');
    return false;
  }

  try {
    const { error, count } = await supabase
      .from('custom_foods')
      .delete()
      .eq('id', foodId)
      .eq('user_id', authUser.id); // Ensure user owns the food

    if (error) {
      console.error('Error deleting custom food:', error);
      return false;
    }

    const success = count === 1;
     if (!success) {
        console.warn(`Custom food with id ${foodId} not found or user mismatch for delete. Count: ${count}`);
    }

    return success;

  } catch (error) {
    console.error('Database error deleting custom food:', error);
    return false;
  }
} 