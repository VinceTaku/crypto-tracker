import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { store } from './store';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import CoinDetail from './pages/CoinDetail/CoinDetail';
import MyWallet from './pages/MyWallet/MyWallet';

// I create a custom MUI theme that follows Material Design 3 guidelines.
// We use a financial/crypto-appropriate colour palette — clean whites with
// an amber accent that communicates value and trust.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F59E0B',       // Amber — our brand accent
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366F1',       // Indigo — for secondary actions
      contrastText: '#ffffff',
    },
    success: {
      main: '#16A34A',       // Green for positive price changes
    },
    error: {
      main: '#DC2626',       // Red for negative price changes
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
  typography: {
    // I use Inter as our font — widely used in fintech products
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // MD3 uses rounded corners throughout
  },
  components: {
    // I customise MUI Paper to match our card style
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.04)',
        },
      },
    },
    // I style all Cards consistently
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #F3F4F6',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    // I remove uppercase from all buttons as MD3 recommends
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 20px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(245, 158, 11, 0.3)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    // I style the AppBar to be clean and elevated
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 1px 0px #E5E7EB',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#F3F4F6' },
        head: {
          fontWeight: 700,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#9CA3AF',
          backgroundColor: '#F9FAFB',
        },
      },
    },
  },
});

/**
 * I wrap the entire app in ThemeProvider so every MUI component
 * automatically inherits our custom Material Design theme.
 * CssBaseline applies a consistent CSS reset across browsers.
 */
const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
            <Route path="/wallet" element={<MyWallet />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

export default App;