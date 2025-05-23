import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store'; // Import the actual RootState

// interface RootStatePlaceholder { // No longer needed
//   date: DateState;
// }

interface DateState {
  currentDate: string | null; // Store as YYYY-MM-DD string
}

const initialState: DateState = {
  currentDate: new Date().toISOString().split('T')[0], // Default to today's date
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<string | null>) {
      state.currentDate = action.payload;
    },
    // You could add other reducers here, e.g., to increment/decrement the date
  },
});

export const {setCurrentDate} = dateSlice.actions;

// Selector to get the current date
export const selectCurrentDate = (
  state: RootState,
): string | null => state.date.currentDate; // Use actual RootState

export default dateSlice.reducer;
