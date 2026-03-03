import React, { useEffect, useRef } from 'react';
import {
  Box, Typography, Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Skeleton, Alert, LinearProgress, Button,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { loadCoins, clearError } from '../../store/cryptoSlice';
import useCoinList from '../../hooks/useCoinList';
import SparklineChart from '../../components/SparklineChart/SparklineChart';
import { formatPrice, formatMarketCap, formatPercentage } from '../../utils/formatters';

/**
 * I render the main dashboard as a Material Design data table.
 * We use MUI Table components for consistent MD3 spacing and typography.
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.settings.currency);

  // I get the current page from Redux so the retry button fetches
  // the correct next page rather than always restarting from page 1
  const page = useAppSelector((s) => s.crypto.page);

  const { coins, coinsLoading, error, hasMore, loadMore } = useCoinList();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // I observe the sentinel div to trigger infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !coinsLoading) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    // We clean up the observer when the component unmounts
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore, coinsLoading]);

  // I clear the error first so coins stay visible, then retry the fetch —
  // this prevents the screen from blinking or wiping existing data
  const handleRetry = () => {
    dispatch(clearError());
    dispatch(loadCoins({ currency, page }));
  };

  // I show 10 skeleton rows only on the very first load
  const showSkeletons = coinsLoading && coins.length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 0.5 }}
        >
          Crypto Markets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live cryptocurrency prices ranked by market capitalisation
        </Typography>
      </Box>

      {/* Error state — warning for rate limits, error for everything else */}
      {error && (
        <Alert
          severity={error.includes('Rate limit') ? 'warning' : 'error'}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
            >
              Retry
            </Button>
          }
        >
          {error.includes('Rate limit')
            ? '⚠️ Too many requests. Wait 30 seconds then click Retry.'
            : error
          }
        </Alert>
      )}

      {/* I wrap the table in Paper for MD3 surface elevation */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* I show a linear progress bar while loading more coins */}
        {coinsLoading && coins.length > 0 && (
          <LinearProgress color="primary" sx={{ height: 2 }} />
        )}

        <TableContainer>
          <Table stickyHeader aria-label="Cryptocurrency market data table">
            <TableHead>
              <TableRow>
                <TableCell width={60}>#</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">24h Change</TableCell>
                <TableCell
                  align="right"
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                >
                  Market Cap
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ display: { xs: 'none', lg: 'table-cell' } }}
                >
                  24h Volume
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                >
                  7D Chart
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* I show skeleton rows while the first page loads */}
              {showSkeletons &&
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width={20} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Skeleton variant="circular" width={36} height={36} />
                        <Box>
                          <Skeleton width={100} height={16} />
                          <Skeleton width={40} height={12} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    >
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', lg: 'table-cell' } }}
                    >
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      <Skeleton width={120} height={48} />
                    </TableCell>
                  </TableRow>
                ))}

              {/* I render each coin row */}
              {coins.map((coin) => {
                // I use the raw percentage value so the sign and colour
                // always match correctly across all currencies including BTC and ETH
                const changePercent = coin.price_change_percentage_24h ?? 0;
                const isPositive = changePercent >= 0;

                return (
                  <TableRow
                    key={coin.id}
                    hover
                    onClick={() => navigate(`/coin/${coin.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td': { border: 0 },
                    }}
                    aria-label={`View details for ${coin.name}`}
                  >
                    {/* Rank */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {coin.market_cap_rank}
                      </Typography>
                    </TableCell>

                    {/* Identity: logo, name, symbol */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={coin.image}
                          alt={`${coin.name} logo`}
                          sx={{ width: 36, height: 36, borderRadius: '50%' }}
                          loading="lazy"
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {coin.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ letterSpacing: '0.04em' }}
                          >
                            {coin.symbol.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Current price in selected currency */}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        {formatPrice(coin.current_price, currency)}
                      </Typography>
                    </TableCell>

                    {/* 24h change — I use the raw value so sign matches colour
                        for all currencies including BTC and ETH */}
                    <TableCell align="right">
                      <Chip
                        icon={
                          isPositive
                            ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} />
                            : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />
                        }
                        label={formatPercentage(changePercent)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: isPositive ? 'success.light' : 'error.light',
                          color: isPositive ? 'success.dark' : 'error.dark',
                          '& .MuiChip-icon': { color: 'inherit' },
                        }}
                      />
                    </TableCell>

                    {/* Market Cap — hidden on mobile */}
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatMarketCap(coin.market_cap, currency)}
                      </Typography>
                    </TableCell>

                    {/* 24h Volume — hidden on smaller screens */}
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', lg: 'table-cell' } }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatMarketCap(coin.total_volume, currency)}
                      </Typography>
                    </TableCell>

                    {/* 7D Sparkline — hidden on mobile */}
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', sm: 'table-cell' }, width: 130 }}
                    >
                      {coin.sparkline_in_7d?.price && (
                        <SparklineChart
                          data={coin.sparkline_in_7d.price}
                          positive={isPositive}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* I use this div as the scroll sentinel for the IntersectionObserver */}
      <Box
        ref={sentinelRef}
        sx={{ py: 3, display: 'flex', justifyContent: 'center' }}
      >
        {coinsLoading && coins.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Loading more assets...
          </Typography>
        )}
        {!hasMore && !coinsLoading && coins.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            All {coins.length} assets loaded
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;