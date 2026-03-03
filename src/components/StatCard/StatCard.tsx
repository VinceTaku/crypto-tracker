import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  label: string;
  value: string;
  valueColor?: string;
}

/**
 * I use this reusable stat card component across the detail page,
 * wallet page, and anywhere else we need a label/value pair displayed
 * in a consistent card format. We accept an optional valueColor so
 * callers can highlight positive/negative percentage values.
 */
const StatCard: React.FC<Props> = ({ label, value, valueColor = 'text.primary' }) => (
  <Box
    sx={{
      p: 1.5,
      bgcolor: 'background.default',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%',
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 700,
        display: 'block',
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={700}
      sx={{ mt: 0.5, color: valueColor }}
    >
      {value}
    </Typography>
  </Box>
);

export default StatCard;