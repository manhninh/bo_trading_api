import AdminRepository from '@src/repository/AdminRepository';
import base32Encode from 'base32-encode';
import crypto from 'crypto';

export const CreateMFACodeBusiness = async (id: string): Promise<Object> => {
  try {
    const adminRes = new AdminRepository();
    const admin = await adminRes.findById(id);
    if (admin) {
      const salt = crypto.randomBytes(14);
      const secret = base32Encode(salt, 'RFC4648', {padding: false});
      const issuer = 'Finimix';
      const algorithm = 'SHA1';
      const digits = '6';
      const period = '30';
      const otpType = 'totp';
      const configUri = `otpauth://${otpType}/${issuer}:${admin.email}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${secret}`;
      return {
        url: configUri,
        secret: secret,
      };
    }
  } catch (err) {
    throw err;
  }
};
