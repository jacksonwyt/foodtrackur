import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth/authService';
import { User } from '@supabase/supabase-js'; // Note: User might not be strictly needed if only using authUser.id
// Import necessary types from navigation types
import { GenderType, ActivityLevelType } from '../types/navigation';

// --- Profile Interface ---
// Define based on expected columns in your Supabase 'profiles' table.
// Ensure this matches the table structure you create in the Supabase dashboard.
export interface Profile {
  id: string; // Should match auth.users.id (UUID)
  updated_at?: string; // Supabase automatically handles this
  created_at?: string; // Supabase automatically handles this
  username?: string;
  full_name?: string;
  avatar_url?: string;
  // Add other profile fields based on MVP.md requirements
  // Add new fields based on onboarding data
  height?: number; // e.g., in cm
  weight?: number; // e.g., in kg
  dob?: string; // ISO date string (YYYY-MM-DD)
  gender?: GenderType;
  activity_level?: ActivityLevelType;
  goal_calories?: number;
  goal_protein?: number;
  goal_carbs?: number;
  goal_fat?: number;
}

// --- Service Functions ---

/**
 * Fetches the profile for the currently authenticated user.
 */
export async function getProfile(): Promise<Profile | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    throw new Error(authError?.message || 'User not authenticated to fetch profile.');
  }

  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select(`*`)
      .eq('id', authUser.id)
      .single();

    if (error && status !== 406) {
      // 406 status code means no row was found, which is not necessarily an error here.
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
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
export async function createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    throw new Error(authError?.message || 'User not authenticated to create profile.');
  }

  // Ensure the profile ID matches the authenticated user's ID
  const profileToInsert = {
    ...profileData,
    id: authUser.id,
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileToInsert)
      .select()
      .single(); // Return the newly created profile

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error creating profile:', error);
    return null;
  }
}

/**
 * Updates the profile for the currently authenticated user.
 */
export async function updateProfile(updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
  const { user: authUser, error: authError } = await getCurrentUser();
  if (authError || !authUser) {
    throw new Error(authError?.message || 'User not authenticated to update profile.');
  }

  const profileUpdates = {
    ...updates,
    // Supabase automatically updates updated_at
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', authUser.id)
      .select()
      .single(); // Return the updated profile

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error updating profile:', error);
    return null;
  }
} 