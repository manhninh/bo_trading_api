import { ISystemTransactionsModel } from 'bo-trading-common/lib/models/systemTransactions';
import { SystemTransactionsSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class SystemTransactionsRepository extends RepositoryBase<ISystemTransactionsModel> {
  constructor() {
    super(SystemTransactionsSchema);
  }
}