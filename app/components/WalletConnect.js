'use client';

import React, { useState, useEffect } from 'react';
import { ASSET_HUB_CONFIG } from '../utils/ethers';

const WalletConnect = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if user already has an authorized wallet connection
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // eth_accounts doesn't trigger the wallet popup
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const chainIdHex = await window.ethereum.request({
              method: 'eth_chainId',
            });
            setChainId(parseInt(chainIdHex, 16));
            
            // Call onConnect callback if account is found
            if (onConnect) onConnect(accounts[0]);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
          setError('Failed to check wallet connection');
        }
      }
    };

    checkConnection();

    // Set up event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          if (onConnect) onConnect(null);
        } else {
          setAccount(accounts[0]);
          if (onConnect) onConnect(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex) => {
        console.log('Chain changed:', chainIdHex);
        setChainId(parseInt(chainIdHex, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup event listeners
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [onConnect]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError(
        'MetaMask not detected! Please install MetaMask to use this dApp.'
      );
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // This will trigger the MetaMask popup
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      console.log('Accounts received:', accounts);
      setAccount(accounts[0]);

      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      });
      const currentChainId = parseInt(chainIdHex, 16);
      setChainId(currentChainId);
      console.log('Current chain ID:', currentChainId);

      // Prompt user to switch networks if needed
      if (currentChainId !== ASSET_HUB_CONFIG.chainId) {
        await switchNetwork();
      }

      if (onConnect) onConnect(accounts[0]);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      if (err.code === 4001) {
        // User rejected the request
        setError('Connection request was rejected. Please try again.');
      } else {
        setError('Failed to connect wallet. ' + (err.message || ''));
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    try {
      console.log('Switching to network:', ASSET_HUB_CONFIG.chainId);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ASSET_HUB_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      console.error('Error switching network:', switchError);
      
      // Error 4902 means the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        try {
          console.log('Adding network to wallet...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${ASSET_HUB_CONFIG.chainId.toString(16)}`,
                chainName: ASSET_HUB_CONFIG.name,
                rpcUrls: [ASSET_HUB_CONFIG.rpc],
                blockExplorerUrls: [ASSET_HUB_CONFIG.blockExplorer],
                nativeCurrency: {
                  name: "Westend ETH",
                  symbol: "WETH",
                  decimals: 18
                }
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add network to wallet');
        }
      } else {
        setError('Failed to switch network');
      }
    }
  };

  // UI-only disconnection - MetaMask doesn't support programmatic disconnection
  const disconnectWallet = () => {
    setAccount(null);
    if (onConnect) onConnect(null);
  };

  return (
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`w-full ${isConnecting ? 'bg-pink-300' : 'bg-pink-500 hover:bg-pink-600'} text-white font-bold py-2 px-4 rounded-lg transition`}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
            {`${account.substring(0, 6)}...${account.substring(38)}`}
          </span>
          <button
            onClick={disconnectWallet}
            className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-pink-500 py-2 px-4 rounded-lg transition"
          >
            Disconnect
          </button>
          {chainId !== ASSET_HUB_CONFIG.chainId && (
            <button
              onClick={switchNetwork}
              className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Switch to Asset Hub
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;