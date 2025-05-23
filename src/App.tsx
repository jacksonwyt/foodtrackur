import React, {useEffect} from 'react';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@/navigation/AppNavigator';
import { store, AppDispatch } from '@/store/store';
import { onAuthStateChange } from '@/services/auth/authService';
import { setAuthState, clearAuthError } from '@/store/slices/authSlice';
import { Session } from '@supabase/supabase-js';

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
    dispatch(setAuthState({ status: 'loading', user: null, session: null, error: null }));

    const subscription = onAuthStateChange((event: string, session: Session | null) => {
      if (event === 'INITIAL_SESSION') {
        if (session) {
          dispatch(
            setAuthState({
              status: 'authenticated',
              user: session.user,
              session,
              error: null,
            }),
          );
        } else {
          dispatch(
            setAuthState({ status: 'unauthenticated', user: null, session: null, error: null }),
          );
        }
      } else if (event === 'SIGNED_IN') {
        if (session) {
          dispatch(
            setAuthState({
              status: 'authenticated',
              user: session.user,
              session,
              error: null,
            }),
          );
        } else {
          dispatch(
            setAuthState({ status: 'failed', user: null, session: null, error: 'Signed in but no session found.' }),
          );
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch(
          setAuthState({ status: 'unauthenticated', user: null, session: null, error: null }),
        );
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
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export { App };
