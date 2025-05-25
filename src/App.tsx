import React, {useEffect} from 'react';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@/navigation/AppNavigator';
import { store, AppDispatch } from '@/store/store';
import { onAuthStateChange, signOut } from '@/services/auth/authService';
import { setAuthState } from '@/store/slices/authSlice';
import { Session } from '@supabase/supabase-js';
import {fetchUserProfile, setOnboardingComplete} from '@/store/slices/profileSlice';

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      // try {
      //   console.log("DEMO: Attempting to sign out to clear session...");
      //   await signOut();
      //   console.log("DEMO: Sign out successful or no active session.");
      // } catch (e) {
      //   console.error("DEMO: Error during sign out for demo", e);
      // }

      dispatch(setAuthState({ status: 'loading', user: null, session: null, error: null }));

      const subscription = onAuthStateChange((event: string, session: Session | null) => {
        if (event === 'INITIAL_SESSION') {
          if (session && session.user) {
            // console.log("DEMO: INITIAL_SESSION reported a user even after signOut attempt.");
            dispatch(
              setAuthState({
                status: 'authenticated',
                user: session.user,
                session,
                error: null,
              }),
            );
            // dispatch(setOnboardingComplete(false)); // Let profileSlice handle this
            dispatch(fetchUserProfile());
          } else {
            // console.log("DEMO: INITIAL_SESSION - No user session as expected after signOut.");
            dispatch(
              setAuthState({ status: 'unauthenticated', user: null, session: null, error: null }),
            );
            // dispatch(setOnboardingComplete(false)); // Onboarding status is irrelevant if unauthenticated
          }
        } else if (event === 'SIGNED_IN') {
          if (session && session.user) {
            dispatch(
              setAuthState({
                status: 'authenticated',
                user: session.user,
                session,
                error: null,
              }),
            );
            // dispatch(setOnboardingComplete(false)); // Let profileSlice handle this
            dispatch(fetchUserProfile());
          } else {
            dispatch(
              setAuthState({ status: 'failed', user: null, session: null, error: 'Signed in but no session found.' }),
            );
            // dispatch(setOnboardingComplete(false)); // Onboarding status is irrelevant if auth failed
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(
            setAuthState({ status: 'unauthenticated', user: null, session: null, error: null }),
          );
          dispatch(setOnboardingComplete(false));
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery event if needed
          // e.g., navigate to a password reset screen
        } else if (event === 'USER_UPDATED') {
          if (session) {
            dispatch(
              setAuthState({
                status: 'authenticated',
                user: session.user,
                session,
                error: null,
              }),
            );
          }
        } else if (event === 'USER_DELETED') {
           dispatch(
            setAuthState({ status: 'unauthenticated', user: null, session: null, error: 'User deleted.' }),
          );
        } else if (event === 'TOKEN_REFRESHED') {
           if (session) {
            dispatch(
              setAuthState({
                status: 'authenticated',
                user: session.user,
                session,
                error: null,
              }),
            );
          }
        }
        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION' && session?.user) {
          // If there was an error before and now we have a user, clear it.
          // dispatch(clearAuthError());
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    };

    void initializeAuth();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export { App };
