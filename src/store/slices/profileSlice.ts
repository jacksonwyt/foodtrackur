import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  getProfile as fetchProfileFromService,
  updateProfile as updateProfileInService,
  createProfile as createProfileInService, // Assuming we might need it
} from '../../services/profileService';
import {
  type Profile as UserProfile, // Use existing Profile type
  type UpdateProfileData,
} from '../../types/profile'; // Corrected import path
import type {RootState} from '../store'; // Adjusted path
import type {User} from '@supabase/supabase-js';

// Define the shape of the profile state
interface ProfileState {
  profile: UserProfile | null;
  onboardingComplete: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Initial state
const initialState: ProfileState = {
  profile: null,
  onboardingComplete: false,
  status: 'idle',
  error: null,
};

// Helper to determine onboarding completion
const checkOnboardingCompletion = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  // Define essential fields that indicate onboarding is complete
  // Adjust these fields based on what's critical from your onboarding flow
  const {
    height_cm,
    dob,
    gender,
    activity_level,
    goal,
    target_calories, // Assuming TDEE/target calories are set during onboarding
    // Add other fields like target_protein_g, target_carbs_g, target_fat_g if also critical
  } = profile;
  return !!(
    height_cm &&
    dob &&
    gender &&
    activity_level &&
    goal &&
    target_calories
  );
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk<
  UserProfile | null, // Return type
  void, // Argument type (void if no args needed as it gets current user)
  {rejectValue: string; state: RootState} // ThunkApi config
>('profile/fetchUserProfile', async (_, {rejectWithValue, getState}) => {
  try {
    const authUser = getState().auth.user; // Get user from auth state
    if (!authUser?.id) {
      return rejectWithValue('User not authenticated.');
    }
    const profile = await fetchProfileFromService();
    return profile;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch profile');
  }
});

// Async thunk for creating a user profile (e.g., if one doesn't exist after sign-up, though onboarding flow might handle this better)
export const createUserProfile = createAsyncThunk<
  UserProfile,
  {userId: string; profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>},
  {rejectValue: string}
>(
  'profile/createUserProfile',
  async ({userId, profileData}, {rejectWithValue}) => {
    try {
      // The createProfile service function expects data without id, created_at, updated_at
      // It internally uses the authenticated user's ID.
      // We pass userId for consistency, but service might ignore it if it always uses current auth user.
      const newProfile = await createProfileInService(profileData);
      if (!newProfile) {
        return rejectWithValue('Profile creation returned null.');
      }
      return newProfile;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create profile');
    }
  },
);


// Async thunk for updating user profile and marking onboarding as complete
export const updateUserProfileAndCompleteOnboarding = createAsyncThunk<
  UserProfile,
  {userId: string; profileData: UpdateProfileData},
  {rejectValue: string; state: RootState} 
>(
  'profile/updateUserProfileAndCompleteOnboarding',
  async ({userId, profileData}, {rejectWithValue, getState}) => { // Removed 'dispatch' as it's not used in this revised logic
    try {
      const updatedProfile = await updateProfileInService(userId, profileData);
      // If updateProfileInService throws, it will be caught below.
      // If it succeeds, updatedProfile is returned.
      return updatedProfile; 
    } catch (error) {
      const err = error as Error & { code?: string; message?: string, details?: string, hint?: string };
      const isNoRowError = (err.message?.includes('PGRST116')) ||
                           (err.message?.includes('JSON object requested, multiple (or no) rows returned')) ||
                           (typeof err.details === 'string' && err.details.includes('The result contains 0 rows')) ||
                           (err.message?.includes('Profile not found or update failed, no data returned.')); // Catching the explicit error from updateProfile

      if (isNoRowError) {
        // THIS IS THE CRITICAL CHANGE:
        // If the trigger is active, a "no row" error during the initial update attempt
        // after sign-up means something went wrong with the trigger, or there's a significant delay/mismatch.
        // We should NOT attempt to create the profile here, as that caused the duplicate key error.
        console.error(
          `[profileSlice] Update failed for user ${userId} with 'no row found' (PGRST116 or similar). ` +
          `This is unexpected if the database trigger for profile creation is active and succeeded. ` +
          `Investigate trigger or timing. Original error: ${err.message}`
        );
        // Reject with a message indicating the conflict with trigger-based creation.
        return rejectWithValue(
          `Profile update failed (no row found), and client-side creation is skipped due to active DB trigger. Error: ${err.message}`
        );
      }

      // For other errors not related to "no row found"
      console.error(`[profileSlice] Error updating profile for user: ${userId}`, err);
      // Ensure we're passing a string as rejectValue
      return rejectWithValue(err.message || 'Failed to update profile due to an unknown error.');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: state => {
      state.error = null;
    },
    resetProfileStatus: state => {
      state.status = 'idle';
    },
    // Optionally, a direct way to set onboarding complete if needed elsewhere
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.onboardingComplete = action.payload;
    },
    resetProfileState: () => initialState, // Resets to initial state, useful on logout
  },
  extraReducers: builder => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile | null>) => {
          state.status = 'succeeded';
          state.profile = action.payload;
          state.onboardingComplete = checkOnboardingCompletion(action.payload);
          state.error = null;
        },
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.profile = null;
        state.onboardingComplete = false;
      })
      // Create User Profile
      .addCase(createUserProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        createUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.status = 'succeeded';
          state.profile = action.payload;
          // Check onboarding after creation, though likely still incomplete
          state.onboardingComplete = checkOnboardingCompletion(action.payload);
          state.error = null;
        },
      )
      .addCase(createUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update User Profile and Complete Onboarding
      .addCase(updateUserProfileAndCompleteOnboarding.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        updateUserProfileAndCompleteOnboarding.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.status = 'succeeded';
          state.profile = action.payload;
          state.onboardingComplete = true; // Explicitly set to true after successful update
          state.error = null;
        },
      )
      .addCase(
        updateUserProfileAndCompleteOnboarding.rejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
          // Optionally, revert onboardingComplete if the update fails critically
          // state.onboardingComplete = checkOnboardingCompletion(state.profile);
        },
      );
  },
});

export const {clearProfileError, resetProfileStatus, setOnboardingComplete, resetProfileState} =
  profileSlice.actions;

// Selectors
export const selectUserProfile = (state: RootState): UserProfile | null =>
  (state.profile as unknown as ProfileState).profile;
export const selectOnboardingComplete = (state: RootState): boolean =>
  (state.profile as unknown as ProfileState).onboardingComplete;
export const selectProfileStatus = (
  state: RootState,
): 'idle' | 'loading' | 'succeeded' | 'failed' => (state.profile as unknown as ProfileState).status;
export const selectProfileError = (
  state: RootState,
): string | null | undefined => (state.profile as unknown as ProfileState).error;

export default profileSlice.reducer; 