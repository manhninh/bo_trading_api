import { verifyTOTP } from '@src/middleware/auth/otp';
import UserRepository from '@src/repository/UserRepository';

/**
 * Create Multi-factor Authentication QR Code
 * @param password
 * @param code code từ Authenticator or Authy
 * @param id id của object Users
 */
export const VerifyOTPTokenBusiness = async (password: string, code: string, secret: string, id: string): Promise<boolean> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      if (!user.checkPassword(password)) throw new Error('Invalid password!');

      if (!secret) {
        secret = user.tfa;
      } else {
        userRes.updateById(user.id, { tfa: secret });
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
