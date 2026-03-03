import React from 'react';
import { Paper, Typography, PaperProps } from '@mui/material';

interface Props extends PaperProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * I wrap all detail page sections in this consistent Paper container.
 * We avoid repeating the same elevation, border, padding, and border-radius
 * on every section — one change here updates all sections at once.
 * We extend PaperProps so callers can still pass sx overrides when needed.
 */
const SectionPaper: React.FC<Props> = ({ title, children, sx, ...rest }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      ...sx,
    }}
    {...rest}
  >
    {title && (
      <Typography
        variant="overline"
        color="text.secondary"
        fontWeight={700}
        sx={{ mb: 2, display: 'block' }}
      >
        {title}
      </Typography>
    )}
    {children}
  </Paper>
);

export default SectionPaper;