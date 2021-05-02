import {TYPE_ORDER} from '@src/contants/System';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {logger} from 'bo-trading-common/lib/utils';
import {validate} from 'class-validator';

export const CreateOrderBusiness = async (order: CreateOrderValidator, username: string): Promise<Boolean | String> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      global.queue
        .create(`Order Queue ${order.userId.toString()}`, {
          title: `Username ${username} order ${order.typeOrder === TYPE_ORDER.BUY ? 'buy' : 'sell'} ${
            order.amount
          } USDF`,
          order,
        })
        .save((err: any) => {
          if (err) logger.error(err.message);
        });
      return true;
    }
  } catch (err) {
    throw err;
  }
};
