import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Coin, CoinDetail, MarketChartData, Currency, TimeRange,
} from '../types/crypto';
import {
  fetchCoins, fetchCoinDetail, fetchMarketChart, fetchCoinsByIds,
} from '../services/api';
import { isCacheValid } from '../utils/cacheUtils';

// I define the shape of the crypto slice state
interface CryptoState {
  coins: Coin[];
  coinDetails: Record<string, CoinDetail>;
  chartData: Record<string, MarketChartData>;
  walletCoins: Coin[];
  coinsLoading: boolean;
  detailLoading: boolean;
  chartLoading: boolean;
  walletLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  // I store fetch timestamps keyed by resource so we can validate cache per entry
  lastFetched: Record<string, number>;
}

const initialState: CryptoState = {
  coins: [],
  coinDetails: {},
  chartData: {},
  walletCoins: [],
  coinsLoading: false,
  detailLoading: false,
  chartLoading: false,
  walletLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  lastFetched: {},
};

/**
 * I load a page of coins sorted by market cap.
 * We append to the existing list for infinite scroll support.
 */
export const loadCoins = createAsyncThunk(
  'crypto/loadCoins',
  async (
    { currency, page }: { currency: Currency; page: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchCoins(currency, page);
      return { data, page };
    } catch (e: any) {
      // I check if this is a rate limit error (429) and give a clear message
      if (e.response?.status === 429) {
        return rejectWithValue(
          'Rate limit reached. Please wait a moment before switching currency again.'
        );
      }
      return rejectWithValue(
        e.message ?? 'Network error. Please check your connection.'
      );
    }
  }
);

/**
 * I load full details for a single coin.
 * We skip the fetch entirely if the cache is still valid.
 */
export const loadCoinDetail = createAsyncThunk(
  'crypto/loadCoinDetail',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as { crypto: CryptoState };
    const cacheKey = `detail-${id}`;

    // We return null to signal to the reducer to use the existing cached data
    if (isCacheValid(state.crypto.lastFetched, cacheKey)) return null;

    try {
      const data = await fetchCoinDetail(id);
      return { id, data };
    } catch (e: any) {
      return rejectWithValue(e.message ?? 'Failed to load coin detail');
    }
  }
);

/**
 * I load historical chart data for a coin, currency and time range.
 * We use a composite cache key so each combination is cached separately.
 */
export const loadChartData = createAsyncThunk(
  'crypto/loadChartData',
  async (
    { id, currency, days }: { id: string; currency: Currency; days: TimeRange },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { crypto: CryptoState };
    const cacheKey = `chart-${id}-${currency}-${days}`;

    if (isCacheValid(state.crypto.lastFetched, cacheKey)) return null;

    try {
      const data = await fetchMarketChart(id, currency, days);
      return { cacheKey, id, currency, days, data };
    } catch (e: any) {
      return rejectWithValue(e.message ?? 'Failed to load chart data');
    }
  }
);

/**
 * I load live coin data for a list of IDs from the MetaMask wallet page.
 */
export const loadWalletCoins = createAsyncThunk(
  'crypto/loadWalletCoins',
  async (
    { ids, currency }: { ids: string[]; currency: Currency },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchCoinsByIds(ids, currency);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? 'Failed to load wallet coin data');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // I reset the coin list when currency changes so we re-fetch with new prices
    resetCoins(state) {
      state.coins = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    // I clear only the error without wiping existing coins —
    // this lets us retry without the screen blinking or losing visible data
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -- loadCoins --
      .addCase(loadCoins.pending, (state) => {
        state.coinsLoading = true;
        state.error = null;
      })
      .addCase(loadCoins.fulfilled, (state, action) => {
        state.coinsLoading = false;
        const { data, page } = action.payload;

        if (page === 1) {
          state.coins = data;
        } else {
          // I deduplicate before appending to prevent ghost entries on re-fetch
          const existingIds = new Set(state.coins.map((c) => c.id));
          state.coins = [
            ...state.coins,
            ...data.filter((c: Coin) => !existingIds.has(c.id)),
          ];
        }

        state.page = page + 1;
        // We consider page 1 exhausted at 10 items, subsequent pages at 20
        state.hasMore = page === 1 ? data.length === 10 : data.length === 20;
      })
      .addCase(loadCoins.rejected, (state, action) => {
        state.coinsLoading = false;
        // I use action.payload because we use rejectWithValue in the thunk —
        // action.error.message would give us a generic message, not our custom one
        state.error = (action.payload as string) ?? 'Something went wrong';
      })

      // -- loadCoinDetail --
      .addCase(loadCoinDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(loadCoinDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        if (action.payload) {
          const { id, data } = action.payload;
          state.coinDetails[id] = data;
          state.lastFetched[`detail-${id}`] = Date.now();
        }
      })
      .addCase(loadCoinDetail.rejected, (state) => {
        state.detailLoading = false;
      })

      // -- loadChartData --
      .addCase(loadChartData.pending, (state) => {
        state.chartLoading = true;
      })
      .addCase(loadChartData.fulfilled, (state, action) => {
        state.chartLoading = false;
        if (action.payload) {
          const { cacheKey, id, currency, days, data } = action.payload;
          const storeKey = `${id}-${currency}-${days}`;
          state.chartData[storeKey] = data;
          state.lastFetched[cacheKey] = Date.now();
        }
      })
      .addCase(loadChartData.rejected, (state) => {
        state.chartLoading = false;
      })

      // -- loadWalletCoins --
      .addCase(loadWalletCoins.pending, (state) => {
        state.walletLoading = true;
      })
      .addCase(loadWalletCoins.fulfilled, (state, action) => {
        state.walletLoading = false;
        state.walletCoins = action.payload;
      })
      .addCase(loadWalletCoins.rejected, (state) => {
        state.walletLoading = false;
      });
  },
});

export const { resetCoins, clearError } = cryptoSlice.actions;
export default cryptoSlice.reducer;