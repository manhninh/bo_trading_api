import {GetCommissionBusiness} from '@src/business/comissions/GetCommissionBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetCommissionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user['id'];
    const result = await GetCommissionBusiness(userId);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
