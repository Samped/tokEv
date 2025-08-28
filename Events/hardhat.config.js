require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    INTUTION: {
      url: "https://testnet.rpc.intuition.systems/http", 
      chainId: 13579, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],      
    },
  },
  etherscan: {
    apiKey: {
      'intuition-testnet': 'empty'
    },
    customChains: [
      {
        network: "intuition-testnet", 
        chainId: 13579,
        urls: {
          apiURL: "https://intuition-testnet.explorer.caldera.xyz/api",
          browserURL: "https://intuition-testnet.explorer.caldera.xyz"
            
        },
      },
    ],
  },
};
