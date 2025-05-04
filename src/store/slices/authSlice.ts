import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';
import { RootState } from '../store'; // Import RootState

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed' | 'authenticated' | 'unauthenticated';

interface AuthState {
  session: Session | null;
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  status: 'idle', // Can represent the initial state before checking auth
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ session: Session | null; user: User | null; status: AuthStatus; error?: string | null }>) {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.status = action.payload.status;
      state.error = action.payload.error ?? null;
    },
    setAuthStatus(state, action: PayloadAction<AuthStatus>) {
        state.status = action.payload;
    },
    clearAuthError(state) {
        state.error = null;
    }
    // Potentially add async thunks here later for login/signup actions
    // e.g., using createAsyncThunk to handle loading/success/error states automatically
  },
});

export const { setAuthState, setAuthStatus, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

// Selectors (optional but good practice)
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentSession = (state: RootState) => state.auth.session;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.status === 'authenticated'; 