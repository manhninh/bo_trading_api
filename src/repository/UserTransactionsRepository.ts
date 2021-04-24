import { IUserTransactionsModel } from 'bo-trading-common/lib/models/userTransactions';
import { UserTransactionsSchema } from 'bo-trading-common/lib/schemas';
import { Constants } from 'bo-trading-common/lib/utils';
import moment from 'moment';
import { ObjectId, UpdateQuery } from 'mongoose';
import { RepositoryBase } from './base';

export default class UserTransactionsRepository extends RepositoryBase<IUserTransactionsModel> {
  constructor() {
    super(UserTransactionsSchema);
  }

  public async getAllPendingTransactions(type: number = 0): Promise<any> {
    try {
      const result = await UserTransactionsSchema.aggregate([
        {
          "$match": {
            "status": Constants.TRANSACTION_STATUS_PENDING,
            "type": type ?? Constants.TRANSACTION_TYPE_DEPOSIT
          }
        },
        {
          "$lookup": {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "users"
          }
        },
        {
          "$unwind": "$users"
        },
        {
          "$project": {
            "_id": "$_id",
            "amount": "$amount",
            "address": "$address",
            "tx": "$tx",
            "user_id": "$user_id",
            "symbol": "$symbol"
          }
        }
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  // Function update transaction
  public async updateById(id: ObjectId, update: UpdateQuery<IUserTransactionsModel>): Promise<IUserTransactionsModel> {
    try {
      const result = await UserTransactionsSchema.findByIdAndUpdate(id, update);
      return result;
    } catch (err) {
      throw err;
    }
  }

  // Function to get Transaction history by User
  public async transactiontHistory(input): Promise<any> {
    try {
      const options = {
        page: input.page ?? 1,
        limit: input.limit ?? 10,
        sort: { createdAt: -1 }
      };

      const from = moment(input.from).startOf('day').toDate();
      const to = moment(input.to).endOf('day').toDate();

      const result = await UserTransactionsSchema.paginate({
        createdAt: {
          $gte: from,
          $lte: to // endOf('day') To prevent actual results from the next day being included.
        },
        user_id: input.user_id,
        type: input.type ?? Constants.TRANSACTION_TYPE_DEPOSIT
      }, options);
      return result;
    } catch (err) {
      throw err;
    }
  }
}