import 'react-native-url-polyfill/auto'; // MUST be first
import { registerRootComponent } from 'expo';
import { store } from './src/store/store';
import { onAuthStateChange } from './src/services/auth/authService';
import { setAuthState } from './src/store/slices/authSlice';
import { Provider } from 'react-redux';
import React from 'react';

// Import database service functions
import { getProfile, createProfile } from './src/services/profileService';

import App from './src/App';

// Helper function to handle profile check/creation
async function checkAndCreateProfile() {
  try {
    const profile = await getProfile();
    if (!profile) {
      console.log('No profile found for user, creating one...');
      // Create profile with minimal data; onboarding can fill the rest
      const newProfile = await createProfile({});
      if (newProfile) {
        console.log('Profile created successfully:', newProfile);
        // Optionally dispatch profile data to Redux here if needed globally immediately
        // store.dispatch(setProfile(newProfile));
      } else {
        console.error('Failed to create profile after check.');
      }
    } else {
      console.log('User profile found:', profile);
      // Optionally dispatch existing profile data to Redux
      // store.dispatch(setProfile(profile));
    }
  } catch (error) {
    console.error('Error checking or creating profile:', error);
  }
}

// --- Supabase Auth Listener Setup ---
onAuthStateChange((event, session) => {
  console.log('Auth state change:', event, session);

  if (event === 'INITIAL_SESSION') {
    // Handle initial session load
    store.dispatch(
      setAuthState({
        session: session,
        user: session?.user ?? null,
        status: session ? 'authenticated' : 'unauthenticated',
      }),
    );
    // Check profile *after* setting auth state if session exists
    if (session) {
        checkAndCreateProfile();
    }
  } else if (event === 'SIGNED_IN') {
    // Handle sign in
    store.dispatch(
      setAuthState({
        session: session,
        user: session?.user ?? null,
        status: 'authenticated',
      }),
    );
    // Check profile *after* setting auth state
    checkAndCreateProfile();

  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
    store.dispatch(
      setAuthState({
        session: null,
        user: null,
        status: 'unauthenticated',
        // Optionally clear profile from Redux state here
        // store.dispatch(clearProfile());
      }),
    );
  } else if (event === 'PASSWORD_RECOVERY') {
    // Handle password recovery event if needed
    // e.g., navigate to a password reset screen
  } else if (event === 'TOKEN_REFRESHED') {
    // Handle token refresh
    store.dispatch(
      setAuthState({
        session: session,
        user: session?.user ?? null,
        status: 'authenticated',
      }),
    );
    // Potentially re-fetch profile if needed, but session user data should be up-to-date
  } else if (event === 'USER_UPDATED') {
    // Handle user update
    store.dispatch(
        setAuthState({
          session: session,
          user: session?.user ?? null, // Update user details if necessary
          status: 'authenticated',
        }),
      );
    // Optionally re-fetch profile data here
    // checkAndCreateProfile(); // Or a dedicated fetch function
  }
});

// --- Wrap Root Component with Redux Provider ---
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

registerRootComponent(Root); 