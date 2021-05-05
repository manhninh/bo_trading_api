import UserRepository from '@src/repository/UserRepository';
import {EMITS} from '@src/socketHandlers/EmitType';
import {VerifyUserValidator} from '@src/validator/users/VerifyUser';
import {validate} from 'class-validator';

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
      const user = await userRes.findOne({type_user: 0, verify_code: verification.uuid});
      if (!user) return 2;
      if (user.status === 1) return 0;
      if (user.status === 0) {
        // active cả tài khoản
        const activeAcount = await userRes.activeUser(user.id);
        if (activeAcount.ok) {
          global.ioCalculator.emit(EMITS.ADD_PROCESS_JOB, user.id.toString());
          return 1;
        } else return 3;
      }
    }
  } catch (err) {
    throw err;
  }
};
