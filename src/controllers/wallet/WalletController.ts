import { getTransactionsHistory } from '@src/business/wallet/GetTransactionsHistory';
import { NextFunction, Request, Response } from 'express';

export const GetTransactionsHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = {
      user_id: req.user["id"],
      page: params.page,
      limit: params.limit,
      type: params.type
    };
    const result = await getTransactionsHistory(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
