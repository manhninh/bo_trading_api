import { VerifyOTPTokenBusiness } from '@src/business/user/VerifyOTPTokenBusiness';
import { NextFunction, Request, Response } from 'express';

export const VerifyOTPTokenController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const params = req.body;
    const result = await VerifyOTPTokenBusiness(params.password, params.code, params.secret, id);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
