import { getWalletAddressBusiness } from '@src/business/wallet/GetWalletAddress';
import { NextFunction, Request, Response } from 'express';

export const getUserWalletController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const result = await getWalletAddressBusiness(id);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
