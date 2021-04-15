import { IUserWalletModel } from 'bo-trading-common/lib/models/UserWallets';
import { UserWalletSchema } from 'bo-trading-common/lib/schemas';
import { UpdateQuery } from 'mongoose';
import { RepositoryBase } from './base';

export default class UserWalletRepository extends RepositoryBase<IUserWalletModel> {
  constructor() {
    super(UserWalletSchema);
  }

  public async updateByUserId(user_id: string, update: UpdateQuery<IUserWalletModel>): Promise<IUserWalletModel> {
    try {
      const result = await UserWalletSchema.findOneAndUpdate({ user_id: user_id }, update);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
