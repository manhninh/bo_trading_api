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
}
