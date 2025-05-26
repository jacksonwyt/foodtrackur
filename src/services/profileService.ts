import {supabase} from './supabaseClient';
import {getCurrentUser} from './auth/authService';
import {type PostgrestError} from '@supabase/supabase-js';
import {type GenderType, type ActivityLevelType, type GoalType} from '../types/navigation';
// import {User} from '@supabase/supabase-js'; // Not strictly needed if only authUser.id is used
import {type Profile, type UpdateProfileData} from '../types/profile';
export type { Profile, UpdateProfileData };

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
  userId: string,
  updates: UpdateProfileData,
): Promise<Profile> {
  if (!userId) throw new Error('User ID is required to update profile.');

  // --- BEGIN TEMPORARY LOG ---
  try {
    const sessionData = await supabase.auth.getSession();
    if (sessionData.data.session) {
      console.log('[updateProfile] Current Access Token:', sessionData.data.session.access_token);
      console.log('[updateProfile] Current User from session in updateProfile:', sessionData.data.session.user.id);
    } else {
      console.log('[updateProfile] No active session found when trying to update profile.');
    }
  } catch (e) {
    console.error('[updateProfile] Error getting session for logging:', e);
  }
  // --- END TEMPORARY LOG ---
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
