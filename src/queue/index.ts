import config from '@src/config';
import {TYPE_ORDER, TYPE_USER} from '@src/contants/System';
import OrderRepository from '@src/repository/OrderRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import {IOrderModel} from 'bo-trading-common/lib/models/orders';
import {logger} from 'bo-trading-common/lib/utils';
import kue, {DoneCallback, Job} from 'kue';

export default class QueueKue {
  queue = null;

  public processOrder = (userId: string) => {
    global.queue
      //queue handling order
      .process(`Order Queue ${userId}`, async (job: Job, done: DoneCallback) => {
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
            case TYPE_USER.COPY_TRADE:
              amountTrade = userWallet.amount_copytrade;
              fieldUpdateAmount = 'amount_copytrade';
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
              type_user: order.typeUser,
              status_order: order.typeOrder === TYPE_ORDER.BUY ? false : true,
              amount_order: order.amount,
              prev_total_amount: amountTrade,
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
            } else {
              orderRes.delete(resultOrder.id);
              done(new Error('Order fail!'));
            }
          } else done(new Error('Your balance is not enough!'));
        } else done(new Error('Your balance is not enough!'));
      });
  };

  public init() {
    this.queue = kue.createQueue({
      redis: {
        port: config.REDIS_PORT,
        host: config.REDIS_HOST,
        auth: config.REDIS_AUTH,
      },
      jobEvents: false,
    });
    global.queue = this.queue;
  }
}
