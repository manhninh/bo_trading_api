import {CommissionTradeDetailBusiness} from '@src/business/comissions/CommissionTradeDetailBusiness';
import {CommissionTradeDetailValidator} from '@src/validator/commissions/CommissionTradeDetailValidator';
import {NextFunction, Request, Response} from 'express';

export const CommissionTradeUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const data = new CommissionTradeDetailValidator();
    data.userId = params.id.toString();
    data.fromDate = new Date(params.fromDate.toString());
    data.toDate = new Date(params.toDate.toString());
    data.page = Number(params.page);
    data.limit = Number(params.limit);
    const result = await CommissionTradeDetailBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
