import {config} from 'dotenv';

const envFound = config({path: `./.env.${process.env.NODE_ENV || 'development'}`});
if (!envFound) throw new Error("Couldn't find .env file");

export default {
  NODE_ENV: process.env.NODE_ENV,

  port: process.env.PORT || 5000,

  logs: {level: process.env.LOG_LEVEL || 'silly'},

  MONGODB_URI: process.env.MONGODB_URI,

  BINANCE_BASE_ENDPOINT: process.env.BINANCE_BASE_ENDPOINT,

  TOKEN_LIFE: process.env.TOKEN_LIFE,

  URL_WEB_VERIFICATION_EMAIL: process.env.URL_WEB_VERIFICATION_EMAIL,

  NODEMAILER_HOST: process.env.NODEMAILER_HOST,

  NODEMAILER_PORT: process.env.NODEMAILER_PORT,

  NODEMAILER_SECURE: process.env.NODEMAILER_SECURE,

  NODEMAILER_USER: process.env.NODEMAILER_USER,

  NODEMAILER_PASS: process.env.NODEMAILER_PASS,

  EMAIL_ROOT: process.env.EMAIL_ROOT,

  PATH_TEMPLATE_EMAIL: process.env.PATH_TEMPLATE_EMAIL,
};
