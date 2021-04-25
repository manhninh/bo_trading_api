import {CommissionTradeDetailBusiness} from '@src/business/comissions/CommissionTradeDetailBusiness';
import {CommissionTradeDetailValidator} from '@src/validator/commissions/CommissionTradeDetailValidator';
import {NextFunction, Request, Response} from 'express';

export const CommissionTradeDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user['id'];
    const params = req.body;
    const data = new CommissionTradeDetailValidator();
    data.userId = userId;
    data.fromDate = new Date(params.fromDate);
    data.toDate = new Date(params.toDate);
    data.page = Number(params.page);
    data.limit = Number(params.limit);
    const result = await CommissionTradeDetailBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
