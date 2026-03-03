import React, { useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, CircularProgress, Alert, Stack,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import useMetaMask from '../../hooks/useMetaMask';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { loadWalletCoins } from '../../store/cryptoSlice';
import { formatPrice, formatMarketCap, formatPercentage } from '../../utils/formatters';

// I map common token symbols to CoinGecko IDs for price lookups
const TOKEN_TO_COINGECKO_ID: Record<string, string> = {
  ETH: 'ethereum', BTC: 'bitcoin', USDT: 'tether',
  USDC: 'usd-coin', BNB: 'binancecoin', MATIC: 'matic-network',
  LINK: 'chainlink', UNI: 'uniswap', AAVE: 'aave', SOL: 'solana',
  ADA: 'cardano', DOT: 'polkadot', AVAX: 'avalanche-2',
  SHIB: 'shiba-inu', DOGE: 'dogecoin',
};

/**
 * I render the MetaMask wallet page using full MUI components.
 * We show a connect prompt first, then a table of live token prices.
 */
const MyWallet: React.FC = () => {
  const { account, isConnecting, isConnected, error, connect, disconnect } = useMetaMask();
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.settings.currency);
  const { walletCoins, walletLoading } = useAppSelector((s) => s.crypto);

  useEffect(() => {
    if (isConnected) {
      const ids = Object.values(TOKEN_TO_COINGECKO_ID);
      dispatch(loadWalletCoins({ ids, currency }));
    }
  }, [isConnected, currency, dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em" gutterBottom>
          My Wallet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Connect your MetaMask wallet to view live prices for your holdings
        </Typography>
      </Box>

      {!isConnected ? (
        // I centre the connect card on screen for a clean first impression
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid', borderColor: 'divider', maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 72, height: 72, mx: 'auto', mb: 2, fontSize: '2.2rem' }}>
              🦊
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Connect MetaMask
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              We use MetaMask to securely read your wallet address.
              We never request your private keys or sign transactions.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<AccountBalanceWalletIcon />}
              onClick={connect}
              disabled={isConnecting}
              sx={{ py: 1.5 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Connected account banner */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'success.light', bgcolor: 'success.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Connected:</Typography>
              <Typography variant="body2" fontWeight={700} fontFamily="monospace">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </Typography>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<LinkOffIcon />}
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </Paper>

          {/* Token price table */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Supported Token Prices</Typography>
              <Typography variant="caption" color="text.secondary">
                Live {currency.toUpperCase()} prices for commonly held ERC-20 tokens
              </Typography>
            </Box>

            {walletLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table aria-label="Wallet token prices">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">24h Change</TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Market Cap</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {walletCoins.map((coin) => {
                      const isPositive = coin.price_change_percentage_24h >= 0;
                      return (
                        <TableRow key={coin.id} sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={coin.image} alt={coin.name} sx={{ width: 32, height: 32 }} />
                              <Box>
                                <Typography variant="body2" fontWeight={700}>{coin.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{coin.symbol.toUpperCase()}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700}>
                              {formatPrice(coin.current_price, currency)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={isPositive
                                ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} />
                                : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />
                              }
                              label={formatPercentage(coin.price_change_percentage_24h)}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                bgcolor: isPositive ? 'success.light' : 'error.light',
                                color: isPositive ? 'success.dark' : 'error.dark',
                                '& .MuiChip-icon': { color: 'inherit' },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatMarketCap(coin.market_cap, currency)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default MyWallet;