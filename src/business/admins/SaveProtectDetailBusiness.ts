import {verifyTOTP} from '@src/middleware/auth/otp';
import AdminRepository from '@src/repository/AdminRepository';
import SystemConfigRepository from '@src/repository/SystemConfigRepository';
import {decrypt, encrypt} from '@src/utils/helpers';
import {SaveProtectDetailValidator} from '@src/validator/admins/SaveProtectDetailValidator';
import {validate} from 'class-validator';

export const SaveProtectDetailBusiness = async (data: SaveProtectDetailValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length > 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const systemConfig = new SystemConfigRepository();
    systemConfig.saveConfigProtectLevel(data.protectLevel1, data.protectLevel2, data.protectLevel3);
    return true;
  } catch (err) {
    throw err;
  }
};
