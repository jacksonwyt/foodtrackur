import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dateReducer from './slices/dateSlice'; // Import the new date reducer
import profileReducer from './slices/profileSlice'; // Import the profile reducer
// Import other reducers here if they exist

export const store = configureStore({
  reducer: {
    auth: authReducer,
    date: dateReducer, // Add the date reducer
    profile: profileReducer, // Add the profile reducer
    // Add other reducers here
  },
  // Middleware can be added here (e.g., for logging, thunks)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
