import {CommissionWithdrawHistoryBusiness} from '@src/business/comissions/CommissionWithdrawHistoryBusiness';
import {CommissionWithdrawHistoryValidator} from '@src/validator/commissions/CommissionWithdrawHistoryValidator';
import {NextFunction, Request, Response} from 'express';

export const CommissionWithdrawHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user['id'];
    const params = req.query;
    const data = new CommissionWithdrawHistoryValidator();
    data.userId = userId;
    data.fromDate = new Date(params.fromDate.toString());
    data.toDate = new Date(params.toDate.toString());
    data.page = Number(params.page);
    data.limit = Number(params.limit);
    const result = await CommissionWithdrawHistoryBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
