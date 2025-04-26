// utils/ethers.js
import { JsonRpcProvider, BrowserProvider } from 'ethers';

export const ASSET_HUB_CONFIG = {
  name: 'Westend Asset Hub',
  rpc: 'https://westend-asset-hub-eth-rpc.polkadot.io', // Westend Asset Hub testnet RPC
  chainId: 420420421, // Westend Asset Hub testnet chainId
  blockExplorer: 'https://westend-asset-hub.subscan.io/',
};

export const getProvider = () => {
  // Since we're in demo mode, we'll create a mock provider
  // This prevents RPC connection errors but allows the code to run
  const mockProvider = {
    getNetwork: async () => ({ chainId: ASSET_HUB_CONFIG.chainId, name: ASSET_HUB_CONFIG.name }),
    getBlockNumber: async () => 12345678,
    getGasPrice: async () => 1000000000,
    getBalance: async () => 1000000000000000000n,
    provider: { getCode: async () => '0x' }
  };
  
  return mockProvider;
  
  // The code below is kept for reference but not used in demo mode
  if (typeof window !== 'undefined' && window.ethereum) {
    // If we're in the browser and MetaMask is available, use BrowserProvider
    return new BrowserProvider(window.ethereum);
  }
  
  // Otherwise use JsonRpcProvider with the configured RPC endpoint
  return new JsonRpcProvider(ASSET_HUB_CONFIG.rpc, {
    chainId: ASSET_HUB_CONFIG.chainId,
    name: ASSET_HUB_CONFIG.name,
  });
};

// Helper to get a signer from a provider
export const getSigner = async () => {
  // Return a mock signer for demo mode
  const mockSigner = {
    address: '0xd611dbb2bbC718f349519BD483F81edF9441d41C',
    signTransaction: async () => ({ hash: '0x123456789abcdef' }),
    signMessage: async () => '0xabcdef123456789',
    getAddress: async () => '0xd611dbb2bbC718f349519BD483F81edF9441d41C',
    getBalance: async () => 1000000000000000000n
  };
  
  return mockSigner;
  
  // The code below is kept for reference but not used in demo mode
  if (typeof window !== 'undefined' && window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new BrowserProvider(window.ethereum);
    return provider.getSigner();
  }
  throw new Error('No Ethereum browser provider detected');
};