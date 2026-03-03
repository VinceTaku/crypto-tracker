import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Chip, Button,
   ToggleButton, ToggleButtonGroup, Avatar,
  CircularProgress, LinearProgress, Stack,
} from '@mui/material';
import { Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useCoinDetail from '../../hooks/useCoinDetail';
import PriceChart from '../../components/PriceChart/PriceChart';
import { TimeRange, ChartMetric } from '../../types/crypto';
import {
  formatPrice, formatMarketCap, formatNumber,
  formatPercentage, formatDate,
} from '../../utils/formatters';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '1M' },
  { value: '365', label: '1Y' },
];

const CHART_METRICS: { value: ChartMetric; label: string }[] = [
  { value: 'prices', label: 'Price' },
  { value: 'market_caps', label: 'Market Cap' },
  { value: 'total_volumes', label: 'Volume' },
];

/**
 * I render the full coin detail page using MUI Grid and Paper components.
 * We follow Material Design 3 layout patterns with proper Grid v5 syntax.
 */
const CoinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [days, setDays] = useState<TimeRange>('7');
  const [metric, setMetric] = useState<ChartMetric>('prices');
  const { detail, chart, detailLoading, chartLoading, currency } = useCoinDetail(id!, days);

  // I show a full-page loader on the first fetch
  if (detailLoading && !detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography color="text.secondary">Loading coin details...</Typography>
      </Box>
    );
  }

  if (!detail) return null;

  const md = detail.market_data;
  const price = md.current_price[currency] ?? 0;
  const change24h = md.price_change_percentage_24h ?? 0;
  const isPositive = change24h >= 0;

  // I define all stats in a data array so we can render them in a loop —
  // this keeps the JSX clean and makes it easy to add more stats later
  const stats = [
    { label: 'Market Cap', value: formatMarketCap(md.market_cap[currency] ?? 0, currency) },
    { label: '24h Volume', value: formatMarketCap(md.total_volume[currency] ?? 0, currency) },
    { label: '24h High', value: formatPrice(md.high_24h[currency] ?? 0, currency) },
    { label: '24h Low', value: formatPrice(md.low_24h[currency] ?? 0, currency) },
    { label: 'All Time High', value: formatPrice(md.ath[currency] ?? 0, currency) },
    { label: 'ATH Date', value: formatDate(md.ath_date[currency]) },
    { label: 'All Time Low', value: formatPrice(md.atl[currency] ?? 0, currency) },
    { label: 'ATL Date', value: formatDate(md.atl_date[currency]) },
    { label: 'Circulating Supply', value: `${formatNumber(md.circulating_supply)} ${detail.symbol.toUpperCase()}` },
    { label: 'Total Supply', value: md.total_supply ? `${formatNumber(md.total_supply)} ${detail.symbol.toUpperCase()}` : '∞' },
    { label: 'Max Supply', value: md.max_supply ? `${formatNumber(md.max_supply)} ${detail.symbol.toUpperCase()}` : '∞' },
    { label: '7D Change', value: formatPercentage(md.price_change_percentage_7d), isPercent: true, val: md.price_change_percentage_7d },
    { label: '30D Change', value: formatPercentage(md.price_change_percentage_30d), isPercent: true, val: md.price_change_percentage_30d },
    { label: '1Y Change', value: formatPercentage(md.price_change_percentage_1y), isPercent: true, val: md.price_change_percentage_1y },
  ];

  const devStats = detail.developer_data
    ? [
        { label: 'GitHub Stars', value: formatNumber(detail.developer_data.stars) },
        { label: 'Forks', value: formatNumber(detail.developer_data.forks) },
        { label: 'Open Issues', value: formatNumber(detail.developer_data.total_issues) },
        { label: 'Commits (4w)', value: formatNumber(detail.developer_data.commit_count_4_weeks) },
      ]
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Markets
      </Button>

      {/* ── Hero Header ── */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>

          {/* Left: logo + name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={detail.image.large}
              alt={`${detail.name} logo`}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" fontWeight={800}>
                  {detail.name}
                </Typography>
                <Chip label={detail.symbol.toUpperCase()} size="small" sx={{ fontWeight: 700 }} />
                <Chip
                  label={`Rank #${detail.market_cap_rank}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              {detail.categories?.[0] && (
                <Typography variant="caption" color="text.secondary">
                  {detail.categories[0]}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Right: price + 24h change */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
              {formatPrice(price, currency)}
            </Typography>
            <Chip
              icon={
                isPositive
                  ? <TrendingUpIcon sx={{ fontSize: '16px !important' }} />
                  : <TrendingDownIcon sx={{ fontSize: '16px !important' }} />
              }
              label={`${formatPercentage(Math.abs(change24h))} (24h)`}
              sx={{
                mt: 0.5,
                fontWeight: 700,
                bgcolor: isPositive ? 'success.light' : 'error.light',
                color: isPositive ? 'success.dark' : 'error.dark',
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* ── Historical Chart ── */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>

          {/* I use ToggleButtonGroup as a segmented control — proper MD3 pattern */}
          <ToggleButtonGroup
            value={metric}
            exclusive
            onChange={(_, v) => v && setMetric(v)}
            size="small"
          >
            {CHART_METRICS.map((m) => (
              <ToggleButton
                key={m.value}
                value={m.value}
                sx={{ px: 2, fontWeight: 600, fontSize: '0.8rem' }}
              >
                {m.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={days}
            exclusive
            onChange={(_, v) => v && setDays(v)}
            size="small"
          >
            {TIME_RANGES.map((r) => (
              <ToggleButton
                key={r.value}
                value={r.value}
                sx={{ px: 2, fontWeight: 600, fontSize: '0.8rem' }}
              >
                {r.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ minHeight: 320, position: 'relative' }}>
          {chartLoading && !chart ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
              <CircularProgress size={32} />
            </Box>
          ) : chart ? (
            <PriceChart chartData={chart} currency={currency} days={days} metric={metric} />
          ) : null}
        </Box>
      </Paper>

      {/* ── Market Statistics Grid ── */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700, mb: 2, display: 'block' }}
        >
          Market Statistics
        </Typography>

        {/* I use MUI Grid v5 correctly: container on parent, no "item" prop needed with Grid2
            but since we're on standard Grid, we use container + item correctly */}
        <Grid container spacing={2}>
            {stats.map((stat) => (
             <Grid size={{ xs: 6, sm: 4, md: 3 }} key={stat.label}>
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
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block' }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    mt: 0.5,
                    color: stat.isPercent
                      ? (stat.val >= 0 ? 'success.main' : 'error.main')
                      : 'text.primary',
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* ── Sentiment + Developer Activity side by side ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>

        {/* Community Sentiment */}
        {detail.sentiment_votes_up_percentage > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Community Sentiment
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main" fontWeight={700}>
                    ▲ {detail.sentiment_votes_up_percentage?.toFixed(1)}% Bullish
                  </Typography>
                  <Typography variant="body2" color="error.main" fontWeight={700}>
                    ▼ {detail.sentiment_votes_down_percentage?.toFixed(1)}% Bearish
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={detail.sentiment_votes_up_percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'error.light',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'success.main',
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Developer Activity */}
        {devStats.length > 0 && (
           <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Developer Activity
              </Typography>
              <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                {devStats.map((item) => (
                   <Grid size={{ xs: 12, md: 6 }} key={item.label}>
                
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block' }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ mt: 0.25 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* ── About ── */}
      {detail.description?.en && (
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
            sx={{ mb: 1.5, display: 'block' }}
          >
            About {detail.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            lineHeight={1.8}
            dangerouslySetInnerHTML={{
              __html: detail.description.en.split('. ').slice(0, 8).join('. ') + '.',
            }}
          />
        </Paper>
      )}

      {/* ── External Links ── */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          fontWeight={700}
          sx={{ mb: 2, display: 'block' }}
        >
          Links
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {detail.links?.homepage?.[0] && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<OpenInNewIcon />}
              href={detail.links.homepage[0]}
              target="_blank"
              rel="noreferrer"
            >
              Website
            </Button>
          )}
          {detail.links?.subreddit_url && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<OpenInNewIcon />}
              href={detail.links.subreddit_url}
              target="_blank"
              rel="noreferrer"
            >
              Reddit
            </Button>
          )}
          {detail.links?.twitter_screen_name && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<OpenInNewIcon />}
              href={`https://twitter.com/${detail.links.twitter_screen_name}`}
              target="_blank"
              rel="noreferrer"
            >
              Twitter / X
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default CoinDetail;