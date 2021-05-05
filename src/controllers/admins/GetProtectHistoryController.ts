import {GetProtectHistoryBusiness} from '@src/business/admins/GetProtectHistoryBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetProtectHistoryController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await GetProtectHistoryBusiness();
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
