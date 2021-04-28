import {TYPE_ORDER} from '@src/contants/System';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {validate} from 'class-validator';

export const CreateOrderBusiness = async (order: CreateOrderValidator, username: string): Promise<Boolean | String> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      global.queue
        .create(`Order Queue`, {
          title: `Username ${username} - order ${order.typeOrder === TYPE_ORDER.BUY ? 'buy' : 'sell'}`,
          order,
        })
        .save();
      return true;
    }
  } catch (err) {
    throw err;
  }
};
