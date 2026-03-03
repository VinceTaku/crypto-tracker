import { Currency } from '../types/crypto';

// I map each currency to its display symbol so we don't repeat this logic
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  zar: 'R',
  usd: '$',
  eur: '€',
  gbp: '£',
  btc: '₿',
  eth: 'Ξ',
};

export const getCurrencySymbol = (currency: Currency): string =>
  CURRENCY_SYMBOLS[currency];

/**
 * I format a price value based on its magnitude and the selected currency.
 * We handle crypto currencies (BTC/ETH) differently as they need more decimals.
 */
export const formatPrice = (value: number, currency: Currency): string => {
  if (value === null || value === undefined) return 'N/A';
  const symbol = getCurrencySymbol(currency);
  if (currency === 'btc' || currency === 'eth') {
    return `${symbol}${value.toFixed(8)}`;
  }
  if (value < 0.01) return `${symbol}${value.toFixed(6)}`;
  if (value < 1) return `${symbol}${value.toFixed(4)}`;
  return `${symbol}${value.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * I format large market cap values into human-readable T/B/M suffixes.
 */
export const formatMarketCap = (value: number, currency: Currency): string => {
  if (!value) return 'N/A';
  const symbol = getCurrencySymbol(currency);
  if (value >= 1_000_000_000_000) return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  return `${symbol}${value.toLocaleString('en-ZA')}`;
};

/**
 * I format raw large numbers without a currency prefix (for supply figures).
 */
export const formatNumber = (value: number): string => {
  if (!value) return 'N/A';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  return value.toLocaleString('en-ZA');
};

/**
 * I format a percentage change value with a + sign for positive values.
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * I format an ISO date string into a readable South African locale date.
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};