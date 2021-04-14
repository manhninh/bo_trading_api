import { IOrderModel } from 'bo-trading-common/lib/models/Orders';
import { OrderSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class OrderRepository extends RepositoryBase<IOrderModel> {
  constructor() {
    super(OrderSchema);
  }
}
