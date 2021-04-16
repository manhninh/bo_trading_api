import { ISystemConfigModel } from 'bo-trading-common/lib/models/systemConfig';
import { SystemConfigSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class SystemConfigRepository extends RepositoryBase<ISystemConfigModel> {
  constructor() {
    super(SystemConfigSchema);
  }
}
