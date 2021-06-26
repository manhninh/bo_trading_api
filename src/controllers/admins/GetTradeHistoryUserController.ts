import {getTradeHistoryBusiness} from '@src/business/trade/GetTradeHistoryBusiness';
import {GetTradeHistoryValidator} from '@src/validator/trade/GetTradeHistory';
import {NextFunction, Request, Response} from 'express';

export const GetTradeHistoryUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = Object.assign({} as object, req.query);
    const data = new GetTradeHistoryValidator();
    data.type = parseInt(params.type as string);
    data.page = parseInt(params.page as string);
    data.limit = parseInt(params.limit as string);
    const result = await getTradeHistoryBusiness(params.id.toString(), data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
