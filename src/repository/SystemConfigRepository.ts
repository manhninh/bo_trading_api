import config from '@src/config';
import { ISystemConfigModel } from 'bo-trading-common/lib/models/systemConfig';
import { SystemConfigSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class SystemConfigRepository extends RepositoryBase<ISystemConfigModel> {
  constructor() {
    super(SystemConfigSchema);
  }

  public async getConfigProtectLevel(): Promise<ISystemConfigModel[]> {
    try {
      const result = await SystemConfigSchema.find({
        key: {
          $in: [config.SYSTEM_PROTECT_LEVEL_1, config.SYSTEM_PROTECT_LEVEL_2, config.SYSTEM_PROTECT_LEVEL_3],
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async saveConfigProtectLevel(level1: number, level2: number, level3: number): Promise<boolean> {
    try {
      await SystemConfigSchema.update({ key: config.SYSTEM_PROTECT_LEVEL_1 }, { $set: { value: level1 } });
      await SystemConfigSchema.update({ key: config.SYSTEM_PROTECT_LEVEL_2 }, { $set: { value: level2 } });
      await SystemConfigSchema.update({ key: config.SYSTEM_PROTECT_LEVEL_3 }, { $set: { value: level3 } });
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async saveConfig(key: string, value: string): Promise<boolean> {
    try {
      await SystemConfigSchema.update({ key: key }, { $set: { value: value } });
      return true;
    } catch (err) {
      throw err;
    }
  }
}
