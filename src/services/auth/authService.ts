import { supabase } from '../supabaseClient';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
} from '@supabase/supabase-js';

/**
 * Signs up a new user with email and password.
 */
export async function signUpWithEmail(
  credentials: SignUpWithPasswordCredentials
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error }: AuthResponse = await supabase.auth.signUp(credentials);
  return { user: data.user, error };
}

/**
 * Signs in an existing user with email and password.
 */
export async function signInWithEmail(
  credentials: SignInWithPasswordCredentials
): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error }: AuthTokenResponsePassword =
    await supabase.auth.signInWithPassword(credentials);
  return { session: data.session, error };
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Gets the current user session.
 * Returns null if no user is logged in.
 */
export async function getCurrentSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Gets the current authenticated user.
 * Returns null if no user is logged in.
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  // Often, getSession is preferred as it also returns the session object
  // But if you only need user details, this can be slightly more direct
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Listens for changes in authentication state (sign in, sign out).
 * Calls the callback function whenever the state changes.
 * Returns a subscription object which should be unsubscribed when no longer needed.
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
} 