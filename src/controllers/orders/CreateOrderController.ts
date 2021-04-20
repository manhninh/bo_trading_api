import {CreateOrderBusiness} from '@src/business/orders/CreateOrderBusiness';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {NextFunction, Request, Response} from 'express';

export const CreateOrderController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (global.openTrade) {
      const username = req.user['username'];
      const userId = req.user['id'];
      const params = req.body;
      const data = new CreateOrderValidator();
      data.userId = userId;
      data.typeUser = params.typeUser;
      data.typeOrder = params.typeOrder;
      data.amount = params.amount;
      const result = await CreateOrderBusiness(data, username);
      res.status(200).send({data: result});
    } else {
      next(new Error('Your order is not accepted due to time out'));
    }
  } catch (err) {
    next(err);
  }
};
