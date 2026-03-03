import axios from 'axios';
import { Currency, TimeRange } from '../types/crypto';

// I centralise all API calls here so we have a single source of truth
// for our CoinGecko integration. This makes it easy to swap or mock later.
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    // I add the free API key to increase our rate limit from ~30 to ~500 req/min
     'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_API_KEY || '',
  },
});


/**
 * I fetch a paginated list of coins sorted by market cap.
 * We use sparkline and price change data for the dashboard display.
 */
export const fetchCoins = async (currency: Currency, page: number) => {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: page === 1 ? 10 : 20, // I load 10 on first page, then 20 per scroll
      page,
      sparkline: true,
      price_change_percentage: '1h,24h,7d',
    },
  });
  return data;
};

/**
 * I fetch full details for a single coin by its CoinGecko ID.
 * We disable tickers to keep the payload small and fast.
 */
export const fetchCoinDetail = async (id: string) => {
  const { data } = await api.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: true,
    },
  });
  return data;
};

/**
 * I fetch historical price, market cap, and volume data for charts.
 * We pass in days so we can support multiple granularities.
 */
export const fetchMarketChart = async (
  id: string,
  currency: Currency,
  days: TimeRange
) => {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: currency,
      days,
    },
  });
  return data;
};

/**
 * I fetch coin data for a list of specific ids.
 * We use this in the MyWallet page to get prices for MetaMask tokens.
 */
export const fetchCoinsByIds = async (ids: string[], currency: Currency) => {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: currency,
      ids: ids.join(','),
      order: 'market_cap_desc',
      sparkline: false,
    },
  });
  return data;
};