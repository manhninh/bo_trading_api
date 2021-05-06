import SystemConfigRepository from '@src/repository/SystemConfigRepository';
import {ISystemConfigModel} from 'bo-trading-common/lib/models/systemConfig';

export const GetProtectDetailBusiness = async (): Promise<ISystemConfigModel[]> => {
  try {
    const systemConfigRes = new SystemConfigRepository();
    const systemConfig = await systemConfigRes.getConfigProtectLevel();
    return systemConfig;
  } catch (err) {
    throw err;
  }
};
