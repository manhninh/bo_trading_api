import {ICommissionModel} from 'bo-trading-common/lib/models/commissions';
import {CommissionSchema} from 'bo-trading-common/lib/schemas';
import {RepositoryBase} from './base';

export default class CommissionRepository extends RepositoryBase<ICommissionModel> {
  constructor() {
    super(CommissionSchema);
  }

  public async getCommissionByUserId(user_id: string): Promise<ICommissionModel[]> {
    try {
      const result = await CommissionSchema.aggregate([
        {
          $match: {
            is_withdraw: false,
            id_user_ref: this.toObjectId(user_id),
          },
        },
        {
          $group: {
            _id: '$type_commission',
            commission: {
              $sum: '$commission',
            },
          },
        },
        {
          $project: {
            _id: 0,
            type_commission: '$_id',
            commission: 1,
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async commissionTradeDetail(
    user_id: string,
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

      const aggregate = CommissionSchema.aggregate([
        {
          $match: {
            type_commission: 0,
            id_user_ref: this.toObjectId(user_id),
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
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
            localField: 'id_user',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $project: {
            createdAt: 1,
            username: '$users.username',
            level: 1,
            investment_amount: 1,
            commission: 1,
            is_withdraw: 1,
          },
        },
      ]);

      const result = await CommissionSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
