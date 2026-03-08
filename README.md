# CryptoTrack

A live cryptocurrency price tracker built with React, TypeScript, and Redux Toolkit.

**Live Demo:** [https://crypto-tracker-ec108.web.app](https://crypto-tracker-ec108.web.app)

**Figma Design File:** [View UI Designs on Figma](https://www.figma.com/design/E1k4aR93UIYWQrPPBpuWPr/Crypo-Track-UI?node-id=8605-3&p=f&t=GXkx3anBSbtei8J4-0)

---

## Running Locally

### Prerequisites

Before you start make sure you have the following installed:
- [Node.js v18+](https://nodejs.org)
- [Git](https://git-scm.com)

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/VinceTaku/crypto-tracker.git

# 2. Navigate into the project folder
cd crypto-tracker

# 3. Install dependencies
npm install

# 4. Create your environment file
```

Create a `.env` file in the root folder and add your CoinGecko API key:
```
REACT_APP_COINGECKO_API_KEY=your_key_here
```

Get a free API key at [coingecko.com/en/api](https://coingecko.com/en/api)

> The app works without an API key but may hit rate limits.
> If you see a rate limit warning, wait 30 seconds and click Retry.
```bash
# 5. Start the development server
npm start
```

The app will open at **http://localhost:3000**

---

## Tech Stack

- React 18 + TypeScript
- Redux Toolkit — state management and caching
- React Router v6 — client-side routing
- MUI (Material UI v7) — Material Design 3 components
- Axios — HTTP requests to CoinGecko API
- Chart.js — interactive historical price charts
- Firebase Hosting — production deployment

---

## Features

- Top cryptocurrencies ranked by market cap with infinite scroll
- Coin detail page — price, market cap, supply, ATH, sentiment, developer data
- Historical price charts — 24H, 7D, 1M, 1Y with price, market cap and volume
- Currency switcher — ZAR, USD, EUR, GBP, BTC, ETH
- Redux caching — 60 second cache to minimise API calls
- MetaMask wallet integration with live token prices
- Progressive Web App — installable on mobile and desktop
- Fully responsive — mobile, tablet and desktop
- Skeleton loaders and error states throughout

---

## Project Structure
```
src/
├── components/    # Reusable UI components
├── pages/         # Dashboard, CoinDetail, MyWallet
├── store/         # Redux slices and store config
├── services/      # CoinGecko API calls
├── hooks/         # Custom React hooks
├── utils/         # Formatters and cache helper
└── types/         # TypeScript interfaces
```

---

## MetaMask

The My Wallet page requires the MetaMask browser extension.

1. Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or [metamask.io](https://metamask.io)
2. Create or import a wallet
3. Go to **My Wallet** in the app and click **Connect Wallet**

We only read your wallet address. We never request your private keys or sign any transactions.

---

## API Notes

This app uses the [CoinGecko API](https://www.coingecko.com/en/api) free tier.

- No API key required for basic usage
- Add a free API key to `.env` for a higher rate limit
- If you see a rate limit warning, wait 30 seconds and click Retry

---

## Deployment
```bash
npm run build
firebase deploy
```

**Live App:** [https://crypto-tracker-ec108.web.app](https://crypto-tracker-ec108.web.app)