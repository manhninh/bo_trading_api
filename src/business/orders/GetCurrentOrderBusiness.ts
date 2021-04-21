import OrderRepository from '@src/repository/OrderRepository';
import {GetCurrentOrderValidator} from '@src/validator/orders/GetCurrentOrder';
import {IOrderModel} from 'bo-trading-common/lib/models/orders';
import {validate} from 'class-validator';

export const GetCurrentOrderBusiness = async (order: GetCurrentOrderValidator): Promise<IOrderModel[]> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      const orderRes = new OrderRepository();
      const orderModel = await orderRes.getCurrentBuySell(order.userId, order.typeUser, new Date());
      return orderModel;
    }
  } catch (err) {
    throw err;
  }
};
