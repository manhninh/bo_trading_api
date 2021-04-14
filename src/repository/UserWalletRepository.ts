import { IUserWalletModel } from 'bo-trading-common/lib/models/userWallets';
import { UserWalletSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class UserWalletRepository extends RepositoryBase<IUserWalletModel> {
  constructor() {
    super(UserWalletSchema);
  }
}
