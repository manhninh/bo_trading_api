import {ReportTransactionDayBusiness} from '@src/business/admins/ReportTransactionDayBusiness';
import {NextFunction, Request, Response} from 'express';

export const ReportTransactionDayController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.query;
    const date = new Date(params.date.toString());
    const result = await ReportTransactionDayBusiness(date);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
