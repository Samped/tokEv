import axios from 'axios';
import { createWalletClient, http, encodeDeployData } from 'viem';
import { readFileSync } from 'fs';
import { assetChainTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import 'dotenv/config';


const RPC_URL = 'https://enugu-rpc.assetchain.org/'; 


let privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error('PRIVATE_KEY is missing from environment variables.');
} else if (!privateKey.startsWith('0x')) {
  privateKey = '0x' + privateKey; // Prepend '0x' if it's missing
}

// Cast privateKey to the expected `0x${string}` type
const account = privateKeyToAccount(privateKey as `0x${string}`);

// Create a wallet client connected to AssetChain Testnet
const walletClient = createWalletClient({
  chain: assetChainTestnet,
  transport: http(RPC_URL),
});

// Function to poll for transaction receipt using JSON-RPC
async function waitForTransactionReceipt(txHash: string, interval = 1000, maxRetries = 60) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.post(RPC_URL, {
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [txHash],
        id: 1
      });

      const receipt = response.data.result;
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      console.error(`Error fetching receipt: ${error}`);
    }
    await new Promise(resolve => setTimeout(resolve, interval)); // Wait before retrying
  }
  throw new Error(`Transaction receipt not found after ${maxRetries} retries.`);
}

async function deployContract() {

  try {

    const contractJson = JSON.parse(readFileSync('./artifacts/contracts/eventTicketing.sol/EventTicketing.json', 'utf8'));

    const abi = contractJson.abi;
    const bytecode = contractJson.bytecode;

    const NAME = 'tokEv'
    const SYMBOL = 'tEv';

    // Encode the deployment data with constructor arguments
    const deployData = encodeDeployData({
      abi,
      bytecode,
      args: [NAME, SYMBOL], // Constructor arguments
    });

    // Create the deployment transaction
    const txHash = await walletClient.sendTransaction({
      account,
      to: undefined, // No `to` address because this is a contract deployment
      data: deployData, // Data includes the bytecode and constructor arguments
      gas: BigInt(4000000), // Use BigInt constructor
    });

    console.log(`Transaction hash: ${txHash}`);

    // Wait for the transaction to be confirmed
    const receipt = await waitForTransactionReceipt(txHash);
    console.log(`Deployed EventTicketing Contract at: ${receipt.contractAddress}`);
  } catch (error) {
    console.error(`Failed to deploy contract: ${error}`);
  }
}

deployContract().catch(console.error);
