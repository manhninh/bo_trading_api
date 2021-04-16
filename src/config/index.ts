import { SendMailOptions } from 'bo-trading-common/lib/utils';
import { config } from 'dotenv';

const envFound = config({ path: `./.env.${process.env.NODE_ENV || 'development'}` });
if (!envFound) throw new Error("Couldn't find .env file");

export default {
  NODE_ENV: process.env.NODE_ENV,

  port: process.env.PORT || 5000,

  logs: { level: process.env.LOG_LEVEL || 'silly' },

  MONGODB_URI: process.env.MONGODB_URI,

  TOKEN_LIFE: process.env.TOKEN_LIFE,

  URL_WEB_VERIFICATION_EMAIL: process.env.URL_WEB_VERIFICATION_EMAIL,

  EMAIL_ROOT: process.env.EMAIL_ROOT,

  PATH_TEMPLATE_EMAIL: process.env.PATH_TEMPLATE_EMAIL,

  // Config for Crypto
  // TRON - USDT TRC20
  CRYPTO_PRIVATE_KEY: process.env.CRYPTO_PRIVATE_KEY,
  TRON_FULL_NODE: process.env.TRON_FULL_NODE,
  TRON_EVENT_NODE: process.env.TRON_EVENT_NODE,
  TRON_SOLIDITY_NODE: process.env.TRON_SOLIDITY_NODE,
  TRON_API_KEY: process.env.TRON_API_KEY,
  TRON_USDT_TRC20_CONTRACT_ADDRESS: process.env.TRON_USDT_TRC20_CONTRACT_ADDRESS,
  TRON_COOL_WALLET_ADDRESS: process.env.TRON_COOL_WALLET_ADDRESS,
  TRON_HOT_WALLET_ADDRESS: process.env.TRON_HOT_WALLET_ADDRESS,
  TRON_HOT_WALLET_PRIVATE_KEY: process.env.TRON_HOT_WALLET_PRIVATE_KEY,
  TRON_TRC20_DEPOSIT_MIN_AMOUNT: process.env.TRON_TRC20_DEPOSIT_MIN_AMOUNT,
  TRON_TRC20_TRANSACTION_FEE: process.env.TRON_TRC20_TRANSACTION_FEE,
  TRON_TRC20_SYMBOL: process.env.TRON_TRC20_SYMBOL,

  // REDIS CONFIG
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_AUTH: process.env.REDIS_AUTH,

  //
  TRANSFER_SYMBOL: process.env.TRANSFER
};

export const configSendEmail: SendMailOptions = {
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: Boolean(process.env.NODEMAILER_SECURE),
  auth: { user: process.env.NODEMAILER_USER, pass: process.env.NODEMAILER_PASS },
};
