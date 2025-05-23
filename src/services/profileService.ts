import {supabase} from './supabaseClient';
import {getCurrentUser} from './auth/authService';
import {type PostgrestError} from '@supabase/supabase-js';
// import {User} from '@supabase/supabase-js'; // Not strictly needed if only authUser.id is used
import {type Profile, type UpdateProfileData} from '../types/profile';

// --- Profile Interface ---
// Define based on expected columns in your Supabase 'profiles' table.
// Ensure this matches the table structure you create in the Supabase dashboard.
export interface Profile {
  id: string; // Should match auth.users.id (UUID)
  updated_at?: string; // Supabase automatically handles this
  created_at?: string; // Supabase automatically handles this
  username?: string;
  email?: string; // Added email as it's commonly part of a profile
  full_name?: string;
  avatar_url?: string;
  // Add other profile fields based on MVP.md requirements
  // Add new fields based on onboarding data
  height_cm?: number;
  weight?: number; // e.g., in kg. Consider a separate weight_log table for history.
  dob?: string; // ISO date string (YYYY-MM-DD)
  gender?: GenderType;
  activity_level?: ActivityLevelType;
  // Removed goal_calories, goal_protein, goal_carbs, goal_fat as these seem like calculated TDEE, not stored profile prefs
  // target goals are better for user-defined targets
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  goal?: GoalType; // Use imported GoalType
  goal_weight?: number | null; // Added: Desired target weight
  goal_pace?: number | null; // Added: Desired pace (e.g., kg/week or lbs/week, can be negative for loss)
}

export interface UpdateProfileData {
  username?: string;
  dob?: string;
  gender?: GenderType;
  height_cm?: number;
  activity_level?: ActivityLevelType;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  goal?: GoalType;
  goal_weight?: number | null;
  goal_pace?: number | null;
  // full_name and avatar_url could also be updatable here
  full_name?: string;
  avatar_url?: string;
}

// --- Service Functions ---

/**
 * Fetches the profile for the currently authenticated user.
 */
export async function getProfile(): Promise<Profile | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    throw new Error(
      authError?.message || 'User not authenticated to fetch profile.',
    );
  }

  try {
    const {
      data,
      error,
      status,
    }: {data: Profile | null; error: PostgrestError | null; status: number} =
      await supabase
        .from('profiles') // Removed <Profile> as it's inferred from the explicit type
        .select(`*`)
        .eq('id', authUser.id)
        .single();

    if (error && status !== 406) {
      // 406 status code means no row was found, which is not necessarily an error here.
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data; // Removed 'as Profile | null' as it's now correctly typed
  } catch (error) {
    console.error('Database error fetching profile:', error);
    // Consider more specific error handling or re-throwing
    return null; // Or throw error depending on how you want calling code to handle it
  }
}

/**
 * Creates a new profile for a user, typically after sign-up.
 * Assumes the user is already authenticated.
 */
export async function createProfile(
  profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>,
): Promise<Profile | null> {
  const {user: authUser, error: authError} = await getCurrentUser();
  if (authError || !authUser) {
    throw new Error(
      authError?.message || 'User not authenticated to create profile.',
    );
  }

  // Ensure the profile ID matches the authenticated user's ID
  const profileToInsert = {
    ...profileData,
    id: authUser.id,
  };

  try {
    const {data, error}: {data: Profile | null; error: PostgrestError | null} =
      await supabase
        .from('profiles') // Removed <Profile>
        .insert(profileToInsert)
        .select()
        .single(); // Return the newly created profile

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data; // Removed 'as Profile | null'
  } catch (error) {
    console.error('Database error creating profile:', error);
    return null;
  }
}

/**
 * Updates the profile for the currently authenticated user.
 */
export async function updateProfile(
  userId: string, // userId is preferred over implicit getCurrentUser for direct operations
  updates: UpdateProfileData,
): Promise<Profile> {
  // Return type is Profile, not Profile | null, implies success or throw
  if (!userId) throw new Error('User ID is required to update profile.');

  // Construct the update object, ensuring `updated_at` is set.
  // Supabase client handles this if the column is set to default now() or on update now()
  // but explicit is also fine.
  const updateWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const {data, error}: {data: Profile | null; error: PostgrestError | null} =
    await supabase
      .from('profiles') // Removed <Profile>
      .update(updateWithTimestamp)
      .eq('id', userId)
      .select()
      .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
  // If .single() is used and no row matches the .eq() filter, or if the update fails
  // in a way that doesn't throw an error but returns no data (e.g. RLS), data can be null.
  if (!data) {
    // This case should ideally be covered by RLS or specific errors from Supabase
    // if the update was meant to succeed but didn't find the row.
    throw new Error('Profile not found or update failed, no data returned.');
  }
  return data; // Removed 'as Profile'
}
