import {buySponsorBusiness} from '@src/business/user/BuySponsorBusiness';
import {NextFunction, Request, Response} from 'express';

export const buySponsorController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user['id'];
    const result = await buySponsorBusiness(userId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
