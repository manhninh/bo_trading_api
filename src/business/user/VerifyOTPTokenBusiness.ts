import { verifyTOTP } from '@src/middleware/auth/otp';
import UserRepository from '@src/repository/UserRepository';
import { decrypt, encrypt } from '@src/utils/helpers';
import { VerifyOTPTokenValidator } from '@src/validator/users/VerifyOTPToken';
import { validate } from 'class-validator';

/**
 * Create Multi-factor Authentication QR Code
 * @param password
 * @param code code từ Authenticator or Authy
 * @param id id của object Users
 */
export const VerifyOTPTokenBusiness = async (id: string, data: VerifyOTPTokenValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    let { password, code, secret } = data;
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      if (!user.checkPassword(password)) throw new Error('Invalid password!');

      if (!secret) {
        secret = decrypt(id, user.tfa);
      } else {
        userRes.updateById(user.id, { tfa: encrypt(id, secret) });
      }

      if (verifyTOTP(code, secret)) {
        return true;
      } else {
        throw new Error('Invalid authentication code!');
      }
    }
  } catch (err) {
    throw err;
  }
};
