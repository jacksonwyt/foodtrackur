import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Import other reducers here if they exist

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
  // Middleware can be added here (e.g., for logging, thunks)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 