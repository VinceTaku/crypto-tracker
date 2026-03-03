import { useState, useCallback } from 'react';

// I declare the window.ethereum type so TypeScript doesn't complain
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface MetaMaskState {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

/**
 * I handle all MetaMask connection logic in this hook.
 * We keep it isolated so the wallet page stays clean and readable.
 */
const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    account: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  const connect = useCallback(async () => {
    // I first check whether MetaMask is installed in the user's browser
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: 'MetaMask is not installed. Please install it from metamask.io',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // We request account access from MetaMask
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setState({
        account: accounts[0],
        isConnecting: false,
        isConnected: true,
        error: null,
      });
    } catch (err: any) {
      setState({
        account: null,
        isConnecting: false,
        isConnected: false,
        error: err.message ?? 'Failed to connect to MetaMask',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    // I reset state — MetaMask doesn't have a programmatic disconnect,
    // so we just clear our local state
    setState({ account: null, isConnecting: false, isConnected: false, error: null });
  }, []);

  return { ...state, connect, disconnect };
};

export default useMetaMask;