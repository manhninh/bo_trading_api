import {CommissionWithdrawBusiness} from '@src/business/comissions/CommissionWithdrawBusiness';
import {CommissionWithdrawValidator} from '@src/validator/commissions/CommissionWithdrawValidator';
import {NextFunction, Request, Response} from 'express';

export const CommissionWithdrawController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user['id'];
    const params = req.body;
    const data = new CommissionWithdrawValidator();
    data.userId = userId;
    data.date = new Date(params.date);
    data.typeComission = Number(params.typeComission);
    const result = await CommissionWithdrawBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
