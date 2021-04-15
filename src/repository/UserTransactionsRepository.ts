import { IUserTransactionsModel } from 'bo-trading-common/lib/models/userTransactions';
import { UserTransactionsSchema } from 'bo-trading-common/lib/schemas';
import { Constants } from 'bo-trading-common/lib/utils';
import { ObjectId, UpdateQuery } from 'mongoose';
import { RepositoryBase } from './base';

export default class UserTransactionsRepository extends RepositoryBase<IUserTransactionsModel> {
  constructor() {
    super(UserTransactionsSchema);
  }

  public async getAllPendingDepositTransactions(): Promise<any> {
    try {
      const result = await UserTransactionsSchema.aggregate([
        {
          "$match": {
            "status": Constants.TRANSACTION_STATUS_PENDING,
            "type": Constants.TRANSACTION_TYPE_DEPOSIT
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
}