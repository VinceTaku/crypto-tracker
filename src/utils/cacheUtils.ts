// I move cache validation logic here so it's reusable across
// any slice that needs time-based caching. We keep it pure and testable.

const CACHE_DURATION_MS = 60_000; // 1 minute

/**
 * I check whether a cached entry identified by `key` is still fresh.
 * We return true if the entry exists and was fetched within the cache window.
 */
export const isCacheValid = (
  lastFetched: Record<string, number>,
  key: string
): boolean => {
  const timestamp = lastFetched[key];
  return !!timestamp && Date.now() - timestamp < CACHE_DURATION_MS;
};