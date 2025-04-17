require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    tea_sepolia: {
      url: "https://tea-sepolia.g.alchemy.com/public", 
      chainId: 10218, 
      accounts: [process.env.PRIVATE_KEY], 
    },
  },
  etherscan: {
    apiKey: {
      tea_sepolia: process.env.ETHERSCAN_API_KEY, 
    },
    customChains: [
      {
        network: "tea_sepolia", 
        chainId: 10218,
        urls: {
          apiURL: "https://sepolia.tea.xyz/api",
          browserURL: "https://sepolia.tea.xyz",
            
        },
      },
    ],
  },
};
