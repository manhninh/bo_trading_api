import SystemConfigRepository from '@src/repository/SystemConfigRepository';
import {EMITS} from '@src/socketHandlers/EmitType';
import {SaveProtectDetailValidator} from '@src/validator/admins/SaveProtectDetailValidator';
import {validate} from 'class-validator';

export const SaveProtectDetailBusiness = async (data: SaveProtectDetailValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length > 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const systemConfig = new SystemConfigRepository();
    systemConfig.saveConfigProtectLevel(data.protectLevel1, data.protectLevel2, data.protectLevel3);
    global.ioCalculator.emit(EMITS.UPDATE_PROTECT_LEVEL, {
      protectLevel1: data.protectLevel1,
      protectLevel2: data.protectLevel1,
      protectLevel3: data.protectLevel1,
    });
    return true;
  } catch (err) {
    throw err;
  }
};
