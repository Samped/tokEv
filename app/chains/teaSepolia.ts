// chains/teaSepolia.ts
import { defineChain } from 'viem';

export const teaSepolia = defineChain({
  id: 10218,
  name: 'Tea Sepolia',
  nativeCurrency: {
    name: 'TEA',
    symbol: 'TEA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://tea-sepolia.g.alchemy.com/public'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tea Sepolia Explorer',
      url: 'https://sepolia.tea.xyz',
    },
  },
  testnet: true,
});
