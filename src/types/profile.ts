import type {GenderType, ActivityLevelType, GoalType} from './navigation';

export interface Profile {
  id: string; // Should match auth.users.id (UUID)
  updated_at?: string; // Supabase automatically handles this
  created_at?: string; // Supabase automatically handles this
  username?: string;
  email?: string; // Added email as it's commonly part of a profile
  full_name?: string;
  avatar_url?: string;
  height_cm?: number;
  weight?: number; // e.g., in kg. Consider a separate weight_log table for history.
  dob?: string; // ISO date string (YYYY-MM-DD)
  gender?: GenderType;
  activity_level?: ActivityLevelType;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  goal?: GoalType;
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
  full_name?: string;
  avatar_url?: string;
}
