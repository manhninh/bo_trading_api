import {CreateOrderBusiness} from '@src/business/orders/CreateOrderBusiness';
import UserRepository from '@src/repository/UserRepository';
import {random} from '@src/utils/Formatter';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {NextFunction, Request, Response} from 'express';

export const CreateRandomOrderController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const userRes = new UserRepository();
    const faker = require('faker');
    userRes.findAll().then((user) => {
      Promise.all(
        user.map(async (item) => {
          const data = new CreateOrderValidator();
          data.userId = item.id;
          data.typeUser = item.type_user;
          data.typeOrder = Number(faker.datatype.boolean());
          data.amount = random(1, 2);
          await CreateOrderBusiness(data, item.username);
        }),
      );
    });
    res.status(200).send({data: true});
  } catch (err) {
    next(err);
  }
};
