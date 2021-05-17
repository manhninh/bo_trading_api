import {GetAllWithdrawBusiness} from '@src/business/admins/GetAllWithdrawBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetAllWithdrawController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const username = params.username.toString();
    const status = Number(params.status);
    const fromDate = new Date(params.fromDate.toString());
    const toDate = new Date(params.toDate.toString());
    const page = Number(params.page);
    const limit = Number(params.limit);
    const result = await GetAllWithdrawBusiness(username, status, fromDate, toDate, page, limit);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
