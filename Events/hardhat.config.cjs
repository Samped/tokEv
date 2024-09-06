require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    assetchain_test: {
      url: "https://enugu-rpc.assetchain.org/", 
      chainId: 42421, 
      accounts: [process.env.PRIVATE_KEY], 
    },
  },
  etherscan: {
    apiKey: {

      assetchain_test: "YOUR_CUSTOM_EXPLORER_API_KEY", 
    },
    customChains: [
      {
        network: "assetchain_test", 
        chainId: 42421,
        urls: {
          apiURL: "https://scan-testnet.assetchain.org/api",  
          browserURL: "https://scan-testnet.assetchain.org/",   
        },
      },
    ],
  },
};
