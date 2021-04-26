import { VerifyOTPTokenBusiness } from "@src/business/user/VerifyOTPTokenBusiness";
import UserRepository from "@src/repository/UserRepository";
import { ChangePasswordUserValidator } from "@src/validator/users/ChangePasswordUser";
import { validate } from 'class-validator';
import crypto from "crypto";
/**
 * Verification user
 * @param id id của object
 * @param data data change password
 */
export const changePasswordUserBusiness = async (id: string, data: ChangePasswordUserValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length !== 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    console.log(data);
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      const success = await VerifyOTPTokenBusiness(id, { password: data.current_password, code: data.tfa });
      if (success) {
        const salt = crypto.randomBytes(128).toString('hex');
        const hashed_password = crypto.pbkdf2Sync(data.new_password, salt, 10000, 512, 'sha512').toString('hex');
        await userRes.updateById(user.id, {
          salt, hashed_password
        });
        return true;
      }
    }
  } catch (err) {
    throw err;
  }
};
