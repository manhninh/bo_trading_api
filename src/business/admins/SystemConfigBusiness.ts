import SystemConfigRepository from '@src/repository/SystemConfigRepository';
import { SystemConfigValidator } from '@src/validator/admins/SystemConfigValidator';
import { validate } from 'class-validator';

export const SystemConfiglBusiness = async (data: SystemConfigValidator): Promise<any> => {
  try {
    const validation = await validate(data);
    if (validation.length > 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const systemConfig = new SystemConfigRepository();
    systemConfig.saveConfig(data.key, data.value);
    const config = systemConfig.findOne({ key: data.key });
    return config;
  } catch (err) {
    throw err;
  }
};
