import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { registerServiceWorker } from './service-worker-register';

// I mount the React app to the root DOM node
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* I wrap the entire app so no uncaught error produces a blank screen */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// I register the PWA service worker after the app mounts
registerServiceWorker();