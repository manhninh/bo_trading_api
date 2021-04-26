import { config } from 'dotenv';

const envFound = config({ path: `./.env.${process.env.NODE_ENV || 'development'}` });
if (!envFound) throw new Error("Couldn't find .env file");

export default {
  RPC_ADDRESS: process.env.ETH_RPC_ADDRESS,
  ETHERSCAN_API_URL: process.env.ETH_WALLET_ETHERSCAN_API_URL,
  ETHERSCAN_API_KEY: process.env.ETH_WALLET_ETHERSCAN_API_KEY,
  ERC20_USDT_CONTRACT_ADDRESS: process.env.ETH_RPC_ADDRESS,
  HOT_WALLET_ETH_ADDRESS: process.env.ETH_HOT_WALLET_ADDRESS,
  HOT_WALLET_ETH_PRIVATE_KEY: process.env.ETH_HOT_WALLET_PRIVATE_KEY,
  COOL_WALLET_ETH_ADDRESS: process.env.COOL_WALLET_ETH_ADDRESS,
  ETH_ERC20_SYMBOL: process.env.ETH_ERC20_SYMBOL,
  ETH_ERC20_TRANSACTION_FEE: process.env.ETH_ERC20_TRANSACTION_FEE,
  ETH_ERC20_DEPOSIT_MIN_AMOUNT: process.env.ETH_ERC20_DEPOSIT_MIN_AMOUNT,
  GENERATED_PASSWORD_LENGTH: 12,
  HD_PATH_STRING: `m/44'/60'/0'/0`,
  MAX_GAS_FOR_ETH_SEND: 25000, /* Max gas for send transaction (not gas price) */
  MAX_GAS_FOR_TOKEN_SEND: 90000, /* Max gas for token send transaction (not gas price) */
};