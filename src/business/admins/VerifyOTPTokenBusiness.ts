import {verifyTOTP} from '@src/middleware/auth/otp';
import AdminRepository from '@src/repository/AdminRepository';
import {decrypt, encrypt} from '@src/utils/helpers';
import {VerifyOTPTokenValidator} from '@src/validator/admins/VerifyOTPToken';
import {validate} from 'class-validator';

export const VerifyOTPTokenBusiness = async (data: VerifyOTPTokenValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    const adminRes = new AdminRepository();
    const admin = await adminRes.findOne({_id: adminRes.toObjectId(data.userId), code: data.password});
    if (!admin) throw new Error('Mã xác thực email không đúng!');
    if (!data.secret) data.secret = decrypt(data.userId, admin.tfa);
    const verify = verifyTOTP(data.code, data.secret);
    if (!verify) throw new Error('Mã 2FA không đúng!');
    if (data.disabled) {
      const update2Fa = await adminRes.updateById(admin.id, {tfa: null, code: null}, {new: true});
      if (update2Fa) return true;
      else throw new Error('Tắt 2FA thất bại!');
    } else {
      const update2Fa = await adminRes.updateById(
        admin.id,
        {tfa: encrypt(data.userId, data.secret), code: null},
        {new: true},
      );
      if (update2Fa) return true;
      else throw new Error('Mã 2FA không đúng!');
    }
  } catch (err) {
    throw err;
  }
};
