const { ethers } = require('hardhat');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = 'https://tea-sepolia.g.alchemy.com/public';  // TEA Protocol RPC URL

async function main() {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is missing from environment variables.');
  }

  // Set up wallet and provider using ethers.providers.JsonRpcProvider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Get contract artifacts (this assumes you've already compiled the contract)
  const contractName = 'EventTicketing'; // Change this to the actual contract name
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const ContractFactory = await ethers.getContractFactory(contractName, wallet);
  
  // Deploy contract with constructor arguments
  const contract = await ContractFactory.deploy('tokEv', 'tEv');
  console.log('Deploying contract...');

  await contract.deployed();
  console.log(`Contract deployed at: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
