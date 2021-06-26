import {IUserTransactionsModel} from 'bo-trading-common/lib/models/userTransactions';
import {UserTransactionsSchema} from 'bo-trading-common/lib/schemas';
import {Constants} from 'bo-trading-common/lib/utils';
import moment from 'moment';
import {ObjectId, UpdateQuery} from 'mongoose';
import {RepositoryBase} from './base';

export default class UserTransactionsRepository extends RepositoryBase<IUserTransactionsModel> {
  constructor() {
    super(UserTransactionsSchema);
  }

  public async getAllPendingTransactions(type: number = 0): Promise<any> {
    try {
      const result = await UserTransactionsSchema.aggregate([
        {
          $match: {
            system_status: Constants.TRANSACTION_STATUS_PENDING,
            type: type ?? Constants.TRANSACTION_TYPE_DEPOSIT,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $project: {
            _id: '$_id',
            amount: '$amount',
            fee: '$fee',
            address: '$address',
            tx: '$tx',
            user_id: '$user_id',
            symbol: '$symbol',
          },
        },
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

  // Function update many transactions
  public async updateMany(
    conditions: any = [],
    update: UpdateQuery<IUserTransactionsModel>,
  ): Promise<IUserTransactionsModel> {
    try {
      const result = await UserTransactionsSchema.updateMany(conditions, update);
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
        sort: {createdAt: -1},
      };

      const from = moment(input.from).startOf('day').toDate();
      const to = moment(input.to).endOf('day').toDate();

      let aggregateData = [];

      // Default to search
      aggregateData.push({
        $match: {
          //user_id: this.toObjectId(input.user_id),
          type: input.type ?? Constants.TRANSACTION_TYPE_DEPOSIT,
          createdAt: {
            $gte: from,
            $lte: to, // endOf('day') To prevent actual results from the next day being included.
          },
        },
      });

      // Add more join
      if (input?.type == Constants.TRANSACTION_TYPE_TRANSFER) {
        aggregateData[0].$match.$or = [
          {
            user_id: this.toObjectId(input.user_id),
          },
          {
            to_user_id: this.toObjectId(input.user_id),
          },
        ];
        aggregateData.push({
          $lookup: {
            from: 'users',
            localField: 'to_user_id',
            foreignField: '_id',
            as: 'userTo',
          },
        });
        aggregateData.push({
          $unwind: '$userTo',
        });

        aggregateData.push({
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'userFrom',
          },
        });
        aggregateData.push({
          $unwind: '$userFrom',
        });

        aggregateData.push({
          $project: {
            amount: 1,
            address: 1,
            tx: 1,
            user_id: 1,
            fee: 1,
            symbol: 1,
            status: 1,
            type: 1,
            noted: 1,
            to_user_id: 1,
            createdAt: 1,
            updatedAt: 1,
            to_username: '$userTo.username',
            from_username: '$userFrom.username',
            from_wallet: 1,
            to_wallet: 1,
          },
        });
      } else {
        aggregateData[0].$match.user_id = this.toObjectId(input.user_id);
      }

      const aggregate = UserTransactionsSchema.aggregate(aggregateData);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async depositUsers(
    username: string,
    status: number,
    fromDate: Date,
    toDate: Date,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };

      let match = {
        type: 0,
        createdAt: {$gte: fromDate, $lte: toDate},
      };

      if (status == -1) {
        match = {
          ...match,
          ...{
            status: {
              $in: [
                Constants.TRANSACTION_STATUS_PENDING,
                Constants.TRANSACTION_STATUS_SUCCESS,
                Constants.TRANSACTION_STATUS_CANCELLED,
              ],
            },
          },
        };
      } else {
        match = {
          ...match,
          ...{status: status},
        };
      }

      const aggregate = UserTransactionsSchema.aggregate([
        {$match: match},
        {$sort: {createdAt: -1}},
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users',
          },
        },
        {$unwind: '$users'},
        {
          $project: {
            user_id: 1,
            address: 1,
            tx: 1,
            amount: 1,
            status: 1,
            createdAt: 1,
            username: '$users.username',
            symbol: 1,
          },
        },
        {$match: {username: {$regex: '.*' + username + '.*'}}},
      ]);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async withdrawUsers(
    username: string,
    status: number,
    fromDate: Date,
    toDate: Date,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };

      let match = {
        type: 2,
        createdAt: {$gte: fromDate, $lte: toDate},
      };

      if (status == -1) {
        match = {
          ...match,
          ...{
            status: {
              $in: [
                Constants.TRANSACTION_STATUS_PENDING,
                Constants.TRANSACTION_STATUS_SUCCESS,
                Constants.TRANSACTION_STATUS_CANCELLED,
                Constants.TRANSACTION_STATUS_PROCESSING,
              ],
            },
          },
        };
      } else {
        match = {
          ...match,
          ...{status: status},
        };
      }

      const aggregate = UserTransactionsSchema.aggregate([
        {$match: match},
        {$sort: {createdAt: -1}},
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users',
          },
        },
        {$unwind: '$users'},
        {
          $project: {
            user_id: 1,
            address: 1,
            tx: 1,
            amount: 1,
            fee: 1,
            status: 1,
            createdAt: 1,
            username: '$users.username',
            symbol: 1,
          },
        },
        {$match: {username: {$regex: '.*' + username + '.*'}}},
      ]);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async tranferUsers(
    username: string,
    status: number,
    fromDate: Date,
    toDate: Date,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };

      let match = {
        type: 1,
        createdAt: {$gte: fromDate, $lte: toDate},
      };

      if (status == -1) {
        match = {
          ...match,
          ...{
            status: {
              $in: [
                Constants.TRANSACTION_STATUS_PENDING,
                Constants.TRANSACTION_STATUS_SUCCESS,
                Constants.TRANSACTION_STATUS_CANCELLED,
              ],
            },
          },
        };
      } else {
        match = {
          ...match,
          ...{status: status},
        };
      }

      const aggregate = UserTransactionsSchema.aggregate([
        {$match: match},
        {$sort: {createdAt: -1}},
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'from_users',
          },
        },
        {
          $unwind: '$from_users',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to_user_id',
            foreignField: '_id',
            as: 'to_users',
          },
        },
        {
          $unwind: '$to_users',
        },
        {
          $project: {
            amount: 1,
            user_id: 1,
            status: 1,
            to_user_id: 1,
            createdAt: 1,
            to_user: '$to_users.username',
            from_user: '$from_users.username',
            from_wallet: 1,
            to_wallet: 1,
          },
        },
        {
          $match: {
            $or: [{to_user: {$regex: '.*' + username + '.*'}}, {from_user: {$regex: '.*' + username + '.*'}}],
          },
        },
      ]);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async allSponsor(username: string, page: number, limit: number): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const aggregate = UserTransactionsSchema.aggregate([
        {
          $match: {
            type: 3,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $project: {
            amount: 1,
            createdAt: 1,
            username: '$users.username',
          },
        },
        {$match: {username: {$regex: '.*' + username + '.*'}}},
      ]);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async GetTransactionDetail(transactionId: string): Promise<IUserTransactionsModel> {
    try {
      const result = await UserTransactionsSchema.findOne({_id: this.toObjectId(transactionId)});
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async TotalTransactions(transactionId: string): Promise<any[]> {
    try {
      const result = await UserTransactionsSchema.aggregate([
        {
          $match: {
            status: 1,
            type: {
              $in: [0, 2, 3, 4],
            },
          },
        },
        {
          $group: {
            _id: '$type',
            amount: {
              $sum: '$amount',
            },
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async tranferUsersOnAdmin(id: string, page: number, limit: number): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };
      const aggregate = UserTransactionsSchema.aggregate([
        {
          $match: {
            $expr: {
              $ne: ['$user_id', '$to_user_id'],
            },
            type: 1,
            $or: [
              {
                user_id: this.toObjectId(id),
              },
              {
                to_user_id: this.toObjectId(id),
              },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'from_users',
          },
        },
        {
          $unwind: '$from_users',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to_user_id',
            foreignField: '_id',
            as: 'to_users',
          },
        },
        {
          $unwind: '$to_users',
        },
        {
          $project: {
            amount: 1,
            createdAt: 1,
            to_user: '$to_users.username',
            from_user: '$from_users.username',
          },
        },
      ]);
      const result = await UserTransactionsSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
