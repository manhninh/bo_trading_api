import UserRepository from '@src/repository/UserRepository';
import { VerifyUserValidator } from '@src/validator/users/VerifyUser';
import { validate } from 'class-validator';
import mongoose from 'mongoose';

/**
 * Verification user
 * @param verification thông tin về mã uuid để active tài khoản
 * @returns 0: Đã được active trước đấy - 1: Đã hoàn thành active - 2: Không tồn tại uuid để active - 3: Active thất bại
 */
export const verifyUserBusiness = async (verification: VerifyUserValidator): Promise<Number> => {
  try {
    const validation = await validate(verification);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      const userRes = new UserRepository();
      const user = await userRes.findOne({ type_user: 0, verify_code: verification.uuid });
      if (!user) return 2;
      if (user.status === 1) return 0;
      if (user.status === 0) {
        // khởi tại link ref cho tài khoản real
        userRes.renderRefCodeUsers(user.id);

        const ids: mongoose.Types.ObjectId[] = [userRes.toObjectId(user.id)];

        // lấy thông tin tài khoản demo theo tài khoản thật
        const userDemo = await userRes.findOne({ user_parent_id: user.id });
        if (userDemo) ids.push(userRes.toObjectId(userDemo.id));

        // active cả tài khoản demo và tài khoản thật
        const activeAcount = await userRes.activeManyUsers(ids);
        if (activeAcount.ok) return 1;
        else return 3;
      }
    }
  } catch (err) {
    throw err;
  }
};
