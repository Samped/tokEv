import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
    await providerInstance.send("eth_requestAccounts", []); // ✅ request permission

    const signerInstance = providerInstance.getSigner();
    const address = await signerInstance.getAddress();

    setProvider(providerInstance);
    setSigner(signerInstance);
    setAccount(address);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    window.location.reload();
  };

  return { account, provider, signer, connectWallet, disconnectWallet };
};
