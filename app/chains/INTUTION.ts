import { defineChain } from 'viem';

export const INTUTION = defineChain({
  id: 13579,
  name: 'INTUTION',
  nativeCurrency: {
    name: 'INTUTION',
    symbol: 'TTRUST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'INTUTION Explorer',
      url: 'https://testnet.explorer.intuition.systems',
    },
  },
  testnet: true,
});
