import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Chip, TableRow, TableCell,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Coin } from '../../types/crypto';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatPrice, formatMarketCap, formatPercentage } from '../../utils/formatters';
import SparklineChart from '../SparklineChart/SparklineChart';

interface Props {
  coin: Coin;
}

/**
 * I render a single coin row inside the dashboard MUI Table.
 * We use TableRow and TableCell so the layout aligns perfectly
 * with the TableHead columns defined in Dashboard.tsx.
 */
const CoinCard: React.FC<Props> = ({ coin }) => {
  const navigate = useNavigate();
  const currency = useAppSelector((s) => s.settings.currency);
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  const handleClick = () => navigate(`/coin/${coin.id}`);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  return (
    <TableRow
      hover
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${coin.name}`}
      sx={{
        cursor: 'pointer',
        outline: 'none',
        '&:last-child td': { border: 0 },
        // I add a left border accent on focus for accessibility
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
        },
      }}
    >
      {/* Rank */}
      <TableCell>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
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
            loading="lazy"
            sx={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}
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

      {/* Current price */}
      <TableCell align="right">
        <Typography variant="body2" fontWeight={700}>
          {formatPrice(coin.current_price, currency)}
        </Typography>
      </TableCell>

      {/* 24h change — I use a Chip with icon for clear visual feedback */}
      <TableCell align="right">
        <Chip
          icon={
            isPositive
              ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} />
              : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />
          }
          label={formatPercentage(Math.abs(coin.price_change_percentage_24h))}
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

      {/* Market cap — hidden on mobile */}
      <TableCell
        align="right"
        sx={{ display: { xs: 'none', md: 'table-cell' } }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatMarketCap(coin.market_cap, currency)}
        </Typography>
      </TableCell>

      {/* 24h volume — hidden on smaller screens */}
      <TableCell
        align="right"
        sx={{ display: { xs: 'none', lg: 'table-cell' } }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatMarketCap(coin.total_volume, currency)}
        </Typography>
      </TableCell>

      {/* 7-day sparkline chart — hidden on mobile */}
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
};

export default CoinCard;