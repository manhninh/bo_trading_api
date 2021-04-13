import { CreateOrderValidator } from '@src/validator/orders/CreateOrder';
import { validate } from 'class-validator';
import { DoneCallback, Job } from 'kue';
import moment from 'moment';

export const CreateOrderBusiness = async (order: CreateOrderValidator): Promise<Boolean> => {
  try {
    const validation = await validate(order);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      global.queue.create(`User Order - ${order.userId}`, {
        order,
        date: moment()
      }).priority("high").save();
      global.queue.process(`User Order - ${order.userId}`, (job: Job, done: DoneCallback) => {
        console.log(job.data.order, "order");
        done();
      });
    }
    return true;
  } catch (err) {
    throw err;
  }
};
