import { useState, useEffect } from "react";
import { createWalletClient, custom } from 'viem';
import { assetChainTestnet } from 'viem/chains';

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const walletClientInstance = createWalletClient({
            chain: assetChainTestnet,
            transport: custom(window.ethereum),
          });
          setWalletClient(walletClientInstance);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const walletClientInstance = createWalletClient({
          chain: assetChainTestnet,
          transport: custom(window.ethereum),
        });
        setWalletClient(walletClientInstance);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };


  const disconnectWallet = () => {
    setAccount(null);
    setWalletClient(null);
    window.location.reload();
  };

  return { account, walletClient, connectWallet, disconnectWallet };
};
