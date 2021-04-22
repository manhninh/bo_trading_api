import {GetCurrentOrderBusiness} from '@src/business/orders/GetCurrentOrderBusiness';
import {GetCurrentOrderValidator} from '@src/validator/orders/GetCurrentOrder';
import {NextFunction, Request, Response} from 'express';

export const GetCurrentOrderController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user['id'];
    const params = req.query;
    const data = new GetCurrentOrderValidator();
    data.userId = userId;
    data.typeUser = params.typeUser ? Number(params.typeUser) : null;
    const result = await GetCurrentOrderBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
