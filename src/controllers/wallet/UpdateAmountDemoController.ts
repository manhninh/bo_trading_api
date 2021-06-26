import { UpdateAmountDemoBusiness } from '@src/business/wallet/UpdateAmountDemoBusiness';
import { NextFunction, Request, Response } from 'express';

export const UpdateAmountDemoController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const result = await UpdateAmountDemoBusiness(id);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
