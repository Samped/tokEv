"use client";

import Hero from "../components/Hero";
import MarketPlace from "@/components/marketPlace";
import { WalletProvider } from "./hooks/WalletProvider";

export default function Home() {
  return (
    <WalletProvider>
      <Hero />
      <MarketPlace />
    </WalletProvider>
  );
}
