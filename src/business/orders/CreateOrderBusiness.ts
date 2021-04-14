import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {validate} from 'class-validator';
import {DoneCallback, Job} from 'kue';
import moment from 'moment';

export const CreateOrderBusiness = async (order: CreateOrderValidator): Promise<Boolean | String> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      global.queue.on('job failed', (id: number, fff: any) => {
        console.log('Job failed');
        return fff;
      });

      global.queue
        .create(`User Order - ${order.userId}`, {
          order,
          date: moment(),
        })
        .priority('high')
        .save();

      // queue handling order
      global.queue.process(`User Order - ${order.userId}`, 1, (job: Job, done: DoneCallback) => {
        console.log(job.data.order, 'order');
        done('không đủ số tiền');
      });
    }
    return true;
  } catch (err) {
    throw err;
  }
};
