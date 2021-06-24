import { getTradeHistoryBusiness } from '@src/business/trade/GetTradeHistoryBusiness';
import { GetTradeHistoryValidator } from '@src/validator/trade/GetTradeHistory';
import { NextFunction, Request, Response } from 'express';

export const GetTradeHistoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = Object.assign({} as object, req.query);
    const id = req.user["id"];
    const data = new GetTradeHistoryValidator();
    // data.from = new Date(params.from as any);
    // data.to = new Date(params.to as any);
    data.type = parseInt(params.type as string);
    data.page = parseInt(params.page as string);
    // data.limit = parseInt(params.limit as string);
    const result = await getTradeHistoryBusiness(id, data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
