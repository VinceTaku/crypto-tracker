import React from 'react';
import {
  TableRow, TableCell, Box, Skeleton,
} from '@mui/material';

/**
 * I render a single skeleton placeholder row while coin data is loading.
 * We match the exact column structure of CoinCard so there's no layout
 * shift when real data replaces the skeletons.
 */
const SkeletonCard: React.FC = () => (
  <TableRow aria-hidden="true">

    {/* Rank skeleton */}
    <TableCell>
      <Skeleton variant="text" width={20} height={16} />
    </TableCell>

    {/* Identity skeleton: circle logo + two lines */}
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={40} height={12} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
    </TableCell>

    {/* Price skeleton */}
    <TableCell align="right">
      <Skeleton variant="text" width={80} height={16} sx={{ ml: 'auto' }} />
    </TableCell>

    {/* 24h change skeleton */}
    <TableCell align="right">
      <Skeleton variant="rounded" width={70} height={24} sx={{ ml: 'auto', borderRadius: '16px' }} />
    </TableCell>

    {/* Market cap skeleton — hidden on mobile to match CoinCard */}
    <TableCell
      align="right"
      sx={{ display: { xs: 'none', md: 'table-cell' } }}
    >
      <Skeleton variant="text" width={80} height={16} sx={{ ml: 'auto' }} />
    </TableCell>

    {/* Volume skeleton — hidden on smaller screens */}
    <TableCell
      align="right"
      sx={{ display: { xs: 'none', lg: 'table-cell' } }}
    >
      <Skeleton variant="text" width={80} height={16} sx={{ ml: 'auto' }} />
    </TableCell>

    {/* Sparkline skeleton — hidden on mobile */}
    <TableCell
      align="right"
      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
    >
      <Skeleton variant="rounded" width={120} height={48} />
    </TableCell>
  </TableRow>
);

export default SkeletonCard;