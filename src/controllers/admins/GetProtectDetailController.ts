import {GetProtectDetailBusiness} from '@src/business/admins/GetProtectDetailBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetProtectDetailController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await GetProtectDetailBusiness();
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
