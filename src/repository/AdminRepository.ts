import {IAdminModel} from 'bo-trading-common/lib/models/admins';
import {AdminSchema} from 'bo-trading-common/lib/schemas';
import {RepositoryBase} from './base';

export default class AdminRepository extends RepositoryBase<IAdminModel> {
  constructor() {
    super(AdminSchema);
  }

  public async updateNewCode(id: string, salt: string, hashedPassword: string): Promise<true> {
    try {
      await AdminSchema.updateOne({_id: this.toObjectId(id)}, {salt: salt, hashed_password: hashedPassword});
      return true;
    } catch (err) {
      throw err;
    }
  }
}
