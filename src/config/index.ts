import { SendMailOptions } from "bo-trading-common/lib/utils";
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
};

export const configSendEmail: SendMailOptions = {
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: Boolean(process.env.NODEMAILER_SECURE),
  auth: { user: process.env.NODEMAILER_USER, pass: process.env.NODEMAILER_PASS },
};