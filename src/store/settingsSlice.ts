import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency } from '../types/crypto';

// I store user preferences here. We default to ZAR as required.
interface SettingsState {
  currency: Currency;
}

const initialState: SettingsState = {
  currency: 'zar',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // I allow the user to switch between supported currencies
    setCurrency(state, action: PayloadAction<Currency>) {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;