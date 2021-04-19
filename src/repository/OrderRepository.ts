import {IOrderModel} from 'bo-trading-common/lib/models/orders';
import {OrderSchema} from 'bo-trading-common/lib/schemas';
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
}
