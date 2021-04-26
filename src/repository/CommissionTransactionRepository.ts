import {ICommissionTransactionModel} from 'bo-trading-common/lib/models/commissionTransactions';
import {CommissionTransactionSchema} from 'bo-trading-common/lib/schemas';
import moment from 'moment';
import {RepositoryBase} from './base';

export default class CommissionTransactionRepository extends RepositoryBase<ICommissionTransactionModel> {
  constructor() {
    super(CommissionTransactionSchema);
  }

  public async commissionWithdrawHistories(
    user_id: string,
    fromDate: Date,
    toDate: Date,
    page: number,
    limit: number,
  ): Promise<ICommissionTransactionModel[]> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };
      const result = CommissionTransactionSchema.paginate({
        id_user: this.toObjectId(user_id),
        createdAt: {
          $gte: new Date(moment(fromDate).startOf('day').toISOString()),
          $lte: new Date(moment(toDate).endOf('day').toISOString()),
        },
      }, options);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
