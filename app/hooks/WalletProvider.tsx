import React, { createContext, useState, useEffect, useContext } from 'react';
import { createWalletClient, custom } from 'viem';
import { teaSepolia } from '../chains/tea'

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

  // Parameters for adding/switching to TEA network in injected wallets (e.g., MetaMask)
  const TEA_PARAMS = {
    chainId: '0x27EA', // 10218 in hex
    chainName: 'Tea Sepolia',
    nativeCurrency: {
      name: 'TEA',
      symbol: 'TEA',
      decimals: 18,
    },
    rpcUrls: ['https://tea-sepolia.g.alchemy.com/v2/LFkRjWuldpkEX6hFz3Eur-17c7gqRZxv'],
    blockExplorerUrls: ['https://sepolia.tea.xyz'],
  } as const;

  const ensureTeaNetwork = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) return false;
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if ((currentChainId as string)?.toLowerCase() === TEA_PARAMS.chainId) {
        return true;
      }
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TEA_PARAMS.chainId }],
        });
        return true;
      } catch (switchError: any) {
        const code = switchError?.code ?? switchError?.data?.originalError?.code;
        if (code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [TEA_PARAMS],
          });
          // After adding, attempt to switch again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TEA_PARAMS.chainId }],
          });
          return true;
        }
        if (code === 4001) {
          // User rejected the request
          return false;
        }
        throw switchError;
      }
    } catch (error) {
      console.error('Failed to switch/add TEA network:', error);
      return false;
    }
  };

  const setupClients = async (selectedAccount: string) => {
    setAccount(selectedAccount);

    const walletClientInstance = createWalletClient({
      chain: teaSepolia,
      transport: custom(window.ethereum),
    });
    setWalletClient(walletClientInstance);

    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signerInstance = provider.getSigner();
      setSigner(signerInstance);
    } catch (error) {
      console.error("Failed to create ethers signer:", error);
    }
  };

  useEffect(() => {
    // Check if the user is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const onCorrectNetwork = await ensureTeaNetwork();
          if (!onCorrectNetwork) {
            return;
          }
          await setupClients(accounts[0]);
        }

        // Listen for network changes
        const handleChainChanged = async () => {
          const ok = await ensureTeaNetwork();
          if (!ok) {
            setAccount(null);
            setWalletClient(null);
            setSigner(null);
            return;
          }
          const accs = await window.ethereum.request({ method: 'eth_accounts' });
          if (accs.length > 0) {
            await setupClients(accs[0]);
          }
        };

        const handleAccountsChanged = async (accs: string[]) => {
          if (accs.length === 0) {
            setAccount(null);
            setWalletClient(null);
            setSigner(null);
            return;
          }
          const ok = await ensureTeaNetwork();
          if (!ok) return;
          await setupClients(accs[0]);
        };

        window.ethereum.on?.('chainChanged', handleChainChanged);
        window.ethereum.on?.('accountsChanged', handleAccountsChanged);

        return () => {
          (window.ethereum as any)?.removeListener?.('chainChanged', handleChainChanged);
          (window.ethereum as any)?.removeListener?.('accountsChanged', handleAccountsChanged);
        };
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // First, request account access so the dapp is authorized to prompt network actions
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        // Then, enforce TEA network
        const onCorrectNetwork = await ensureTeaNetwork();
        if (!onCorrectNetwork) {
          alert('Please switch to the TEA network in your wallet to continue.');
          return;
        }

        await setupClients(accounts[0]);
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