import UserRepository from '@src/repository/UserRepository';
import base32Encode from 'base32-encode';
import crypto from 'crypto';

/**
 * Create Multi-factor Authentication QR Code
 * @param id id của object
 */
export const CreateMfaQrCodeBusiness = async (id: string): Promise<Object> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      // generate unique secret for user
      // this secret will be used to check the verification code sent by user
      const salt = crypto.randomBytes(14);
      const secret = base32Encode(salt, 'RFC4648', { padding: false });
      const issuer = 'Finimix';
      const algorithm = 'SHA1';
      const digits = '6';
      const period = '30';
      const otpType = 'totp';
      const configUri = `otpauth://${otpType}/${issuer}:${user.email}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${secret}`;
      return {
        url: configUri,
        secret: secret
      };
    }
  } catch (err) {
    throw err;
  }
};
