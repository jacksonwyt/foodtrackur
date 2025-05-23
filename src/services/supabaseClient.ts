import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '@env';
import type { Database } from '../types/database.types'; // <--- IMPORT YOUR GENERATED Database TYPE

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing from @env. Check .env file and babel config.',
  );
  throw new Error('Supabase URL or Anon Key is missing from @env.');
}

// Provide the Database type as a generic to createClient
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, { // <--- USE THE GENERIC HERE
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
