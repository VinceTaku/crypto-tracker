import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';
import settingsReducer from './settingsSlice';

// I configure our Redux store with two slices:
// - crypto: handles all coin data and caching
// - settings: handles user preferences like currency
export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;