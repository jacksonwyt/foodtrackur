import 'react-native-url-polyfill/auto'; // Required for Supabase JS V2
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove Constants import if no longer needed elsewhere in the file
// import Constants from 'expo-constants'; 
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
// const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

// Use the imported variables directly
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing from @env. Check .env file and babel config.');
  // Update the error message to reflect the new source
  throw new Error('Supabase URL or Anon Key is missing from @env.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use AsyncStorage for React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
}); 