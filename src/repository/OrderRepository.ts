import {IOrderModel} from 'bo-trading-common/lib/models/orders';
import {OrderSchema} from 'bo-trading-common/lib/schemas';
import moment from 'moment';
import {RepositoryBase} from './base';

export default class OrderRepository extends RepositoryBase<IOrderModel> {
  constructor() {
    super(OrderSchema);
  }

  public async totalBuySell(user_id: string): Promise<IOrderModel[]> {
    try {
      const result = await OrderSchema.aggregate([
        {
          $match: {
            user_id: this.toObjectId(user_id),
            status: false,
          },
        },
        {
          $group: {
            _id: '$status_order',
            amount_order: {
              $sum: '$amount_order',
            },
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getCurrentBuySell(user_id: string, typeUser: number, date: Date): Promise<IOrderModel[]> {
    try {
      const result = await OrderSchema.aggregate([
        {
          $match: {
            status: false,
            user_id: this.toObjectId(user_id),
            type_user: typeUser,
            createdAt: {
              $gte: new Date(moment(date).startOf('minute').toISOString()),
              $lte: new Date(moment(date).endOf('minute').toISOString()),
            },
          },
        },
        {
          $group: {
            _id: '$status_order',
            amount_order: {$sum: '$amount_order'},
          },
        },
        {
          $project: {
            _id: 0,
            status_order: '$_id',
            amount_order: 1,
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
