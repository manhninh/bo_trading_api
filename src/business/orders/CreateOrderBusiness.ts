import {TYPE_ORDER, TYPE_USER} from '@src/contants/System';
import OrderRepository from '@src/repository/OrderRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {IOrderModel} from 'bo-trading-common/lib/models/orders';
import {validate} from 'class-validator';
import {DoneCallback, Job} from 'kue';

export const CreateOrderBusiness = async (order: CreateOrderValidator, username: string): Promise<Boolean | String> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      global.queue
        .create(`User ${username}`, {
          title: `Order ${order.typeOrder === TYPE_ORDER.BUY ? 'Buy' : 'Sell'}`,
          order,
        })
        .save();

      // queue handling order
      global.queue.process(`User ${username}`, 1, async (job: Job, done: DoneCallback) => {
        const order = job.data.order;
        /** kiểm tra số dư tài khoản có đủ để đặt lệnh */
        const userWalletRes = new UserWalletRepository();
        const userWallet = await userWalletRes.findOne({user_id: order.userId});
        if (userWallet) {
          let amountTrade = 0;
          let fieldUpdateAmount = '';
          switch (order.typeUser) {
            case TYPE_USER.DEMO:
              amountTrade = userWallet.amount_demo;
              fieldUpdateAmount = 'amount_demo';
              break;
            case TYPE_USER.EXPERT:
              amountTrade = userWallet.amount_expert;
              fieldUpdateAmount = 'amount_expert';
              break;
            default:
              amountTrade = userWallet.amount_trade;
              fieldUpdateAmount = 'amount_trade';
              break;
          }
          const orderRes = new OrderRepository();
          // nếu như tổng số buy/sell hiện tại + số tiền đánh lệnh > số tiền hiện tại thì không được đánh lệnh
          const totalAmountNew = amountTrade - order.amount;
          if (totalAmountNew > 0) {
            const faker = require('faker');
            const order_uuid = faker.datatype.uuid();
            const resultOrder = await orderRes.create(<IOrderModel>{
              order_uuid,
              user_id: order.userId,
              status_order: order.typeOrder === TYPE_ORDER.BUY ? false : true,
              amount_order: order.amount,
              status: false,
            });
            if (resultOrder) {
              const updateWallet = await userWalletRes.updateByUserId(order.userId, {
                [fieldUpdateAmount]: totalAmountNew,
              });
              if (updateWallet) done();
              else {
                orderRes.delete(resultOrder.id);
                done(new Error('Order fail!'));
              }
            } else done(new Error('Order fail!'));
          } else done(new Error('Your balance is not enough!'));
        } else done(new Error('Your balance is not enough!'));
      });
    }
    return true;
  } catch (err) {
    throw err;
  }
};
