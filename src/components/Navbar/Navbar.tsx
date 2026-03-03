import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Tabs, Tab,
  Select, MenuItem,  FormControl, SelectChangeEvent,
  useScrollTrigger, Slide, IconButton, Drawer, List,
  ListItem, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';


import MenuIcon from '@mui/icons-material/Menu';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setCurrency } from '../../store/settingsSlice';
import { resetCoins } from '../../store/cryptoSlice';
import { Currency } from '../../types/crypto';

// I hide the navbar on scroll down for a more immersive mobile experience
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>;
}

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'zar', label: 'ZAR (R)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'btc', label: 'BTC (₿)' },
  { value: 'eth', label: 'ETH (Ξ)' },
];

const ROUTES = [
  { path: '/', label: 'Markets' },
  { path: '/wallet', label: 'My Wallet' },
];

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.settings.currency);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // I find which tab index matches the current route
  const currentTab = ROUTES.findIndex((r) => r.path === location.pathname);

  const handleCurrencyChange = (e: SelectChangeEvent) => {
    dispatch(setCurrency(e.target.value as Currency));
    dispatch(resetCoins());
  };

  return (
    <HideOnScroll>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>

          {/* Brand */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <CurrencyBitcoinIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, letterSpacing: '-0.02em' }}>
              CryptoTrack
            </Typography>
          </Box>

          {/* Desktop nav tabs */}
          {!isMobile && (
            <Tabs
              value={currentTab >= 0 ? currentTab : false}
              textColor="primary"
              indicatorColor="primary"
              sx={{ minHeight: 64 }}
            >
              {ROUTES.map((route) => (
                <Tab
                  key={route.path}
                  label={route.label}
                  component={Link}
                  to={route.path}
                  sx={{ minHeight: 64, fontWeight: 600, fontSize: '0.875rem' }}
                />
              ))}
            </Tabs>
          )}

          {/* Right side: currency selector + mobile menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={currency}
                onChange={handleCurrencyChange}
                displayEmpty
                sx={{ fontWeight: 600, borderRadius: '10px' }}
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* I show a hamburger menu on mobile */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 220, pt: 2 }}>
            <List>
              {ROUTES.map((route) => (
                <ListItem
                  key={route.path}
                  component={Link}
                  to={route.path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: location.pathname === route.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === route.path ? 700 : 500,
                  }}
                >
                  <ListItemText primary={route.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;