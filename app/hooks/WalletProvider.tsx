import React, { createContext, useState, useEffect, useContext } from 'react';
import { createWalletClient, custom } from 'viem';
import { INTUTION } from '../chains/INTUTION'

interface WalletContextType {
  account: string | null;
  walletClient: any | null;
  signer: any | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    // Check if the user is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const walletClientInstance = createWalletClient({
            chain: INTUTION,
            transport: custom(window.ethereum),
          });
          setWalletClient(walletClientInstance);
          
          // Create a signer for ethers.js compatibility
          try {
            const { ethers } = await import('ethers');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signerInstance = provider.getSigner();
            setSigner(signerInstance);
          } catch (error) {
            console.error("Failed to create ethers signer:", error);
          }
        }
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        const walletClientInstance = createWalletClient({
          chain: INTUTION,
          transport: custom(window.ethereum),
        });
        setWalletClient(walletClientInstance);
        
        // Create a signer for ethers.js compatibility
        try {
          const { ethers } = await import('ethers');
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signerInstance = provider.getSigner();
          setSigner(signerInstance);
        } catch (error) {
          console.error("Failed to create ethers signer:", error);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  return (
    <WalletContext.Provider value={{ account, walletClient, signer, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}; 