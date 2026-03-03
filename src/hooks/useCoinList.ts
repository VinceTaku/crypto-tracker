import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loadCoins, resetCoins } from '../store/cryptoSlice';

/**
 * I encapsulate all coin list data fetching and pagination logic here.
 * We fetch on mount and on currency change, with a small delay to avoid
 * hitting CoinGecko's rate limit on rapid currency switches.
 */
const useCoinList = () => {
  const dispatch = useAppDispatch();
  const { coins, coinsLoading, error, page, hasMore } = useAppSelector(
    (s) => s.crypto
  );
  const currency = useAppSelector((s) => s.settings.currency);
  const dispatchRef = useRef(dispatch);

  useEffect(() => {
    // I reset the list and fetch fresh data whenever currency changes.
    // The 600ms delay gives CoinGecko's rate limiter breathing room.
    dispatchRef.current(resetCoins());

    const timer = setTimeout(() => {
      dispatchRef.current(loadCoins({ currency, page: 1 }));
    }, 600);

    // We cancel the timer if currency changes again before it fires
    return () => clearTimeout(timer);
  }, [currency]);

  // I only load more when the user scrolls and there's no active error
  const loadMore = useCallback(() => {
    if (!coinsLoading && hasMore && !error) {
      dispatch(loadCoins({ currency, page }));
    }
  }, [coinsLoading, hasMore, error, page, currency, dispatch]);

  return { coins, coinsLoading, error, hasMore, loadMore };
};

export default useCoinList;