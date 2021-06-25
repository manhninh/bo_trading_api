import { detailUserOnAdminBusiness } from '@src/business/user/DetailUserOnAdminBusiness';
import { NextFunction, Request, Response } from 'express';

export const detailUserOnAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const result = await detailUserOnAdminBusiness(params.id?.toString());
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
