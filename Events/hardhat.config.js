require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    teaSepolia: {
      url: process.env.TEA_SEPOLIA || "https://tea-sepolia.g.alchemy.com/v2/LFkRjWuldpkEX6hFz3Eur-17c7gqRZxv", 
      chainId: 10218, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],      
    },
  },
  etherscan: {
    apiKey: {
      'teaSepolia': process.env.ETHERSCAN_API_KEY || ''
    },
    customChains: [
      {
        network: "teaSepolia", 
        chainId: 10218,
        urls: {
          apiURL: "https://sepolia.tea.xyz/api",
          browserURL: "https://sepolia.tea.xyz"
            
        },
      },
    ],
  },
};
