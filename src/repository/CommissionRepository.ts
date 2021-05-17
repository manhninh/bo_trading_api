import {ICommissionModel} from 'bo-trading-common/lib/models/commissions';
import {CommissionSchema, CommissionTransactionSchema, UserWalletSchema} from 'bo-trading-common/lib/schemas';
import moment from 'moment';
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
              $gte: new Date(moment(fromDate).startOf('day').toISOString()),
              $lte: new Date(moment(toDate).endOf('day').toISOString()),
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

  public async commissionWithdraw(user_id: string, typeCommission: number, date: Date): Promise<boolean> {
    try {
      // lấy ra số tiền cần withdraw đến thời điểm hiện tại
      const totalCommission = await CommissionSchema.aggregate([
        {
          $match: {
            id_user_ref: this.toObjectId(user_id),
            is_withdraw: false,
            type_commission: typeCommission,
            createdAt: {
              $lte: date,
            },
          },
        },
        {
          $group: {
            _id: '$id_user_ref',
            commission: {
              $sum: '$commission',
            },
          },
        },
      ]);
      if (totalCommission.length > 0) {
        let amountCommission = totalCommission[0].commission;
        amountCommission = Math.floor(amountCommission * 100) / 100;
        // cập nhật số tiền vào amount của tài khoản
        await UserWalletSchema.findOneAndUpdate(
          {user_id: this.toObjectId(user_id)},
          {
            $inc: {amount: amountCommission},
          },
        );
        // tạo bản ghi mới bên commission_transactions
        await CommissionTransactionSchema.create({
          type_commission: typeCommission,
          id_user: this.toObjectId(user_id),
          amount: amountCommission,
        });

        // thay đổi trạng thái của các commisson sang withdraw
        await CommissionSchema.updateMany(
          {
            id_user_ref: this.toObjectId(user_id),
            is_withdraw: false,
            createdAt: {
              $lte: date,
            },
          },
          {
            is_withdraw: true,
          },
        );
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
