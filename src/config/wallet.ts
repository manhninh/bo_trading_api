import { config } from 'dotenv';

const envFound = config({ path: `./.env.${process.env.NODE_ENV || 'development'}` });
if (!envFound) throw new Error("Couldn't find .env file");

export default {
  RPC_ADDRESS: process.env.ETH_RPC_ADDRESS,
  GENERATED_PASSWORD_LENGTH: 12,
  HD_PATH_STRING: `m/44'/60'/0'/0`,
  MAX_GAS_FOR_ETH_SEND: 25000, /* Max gas for send transaction (not gas price) */
  MAX_GAS_FOR_TOKEN_SEND: 90000, /* Max gas for token send transaction (not gas price) */
};