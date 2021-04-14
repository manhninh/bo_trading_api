import { getUserInforBusiness } from '@src/business/user/GetUserInforBusiness';
import { NextFunction, Request, Response } from 'express';

export const getUserInforController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const result = await getUserInforBusiness(id);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
