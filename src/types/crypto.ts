// I define all the TypeScript interfaces we use across the app here.
// Keeping types in one place makes it easy for us to maintain and scale.

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
}

// I extend Coin with the extra fields returned by the /coins/{id} endpoint
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  market_cap_rank: number;
  description: { en: string };
  categories: string[];
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
    twitter_screen_name: string;
    telegram_channel_identifier: string;
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_date: Record<string, string>;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    commit_count_4_weeks: number;
  };
}

// I define the chart data shape returned by CoinGecko's market_chart endpoint
export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// We support these currencies throughout the app
export type Currency = 'zar' | 'usd' | 'eur' | 'gbp' | 'btc' | 'eth';

// I use a union type for chart time ranges so we keep them consistent
export type TimeRange = '1' | '7' | '30' | '365';

export type ChartMetric = 'prices' | 'market_caps' | 'total_volumes';

// I define a wallet token shape for MetaMask integration
export interface WalletToken {
  contractAddress: string;
  symbol: string;
  balance: string;
  decimals: number;
  coinGeckoId?: string;
  coinData?: Coin;
}