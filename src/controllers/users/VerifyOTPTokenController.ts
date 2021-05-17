import { VerifyOTPTokenBusiness } from '@src/business/user/VerifyOTPTokenBusiness';
import { VerifyOTPTokenValidator } from '@src/validator/users/VerifyOTPToken';
import { NextFunction, Request, Response } from 'express';

export const verifyOTPTokenController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const params = req.body;
    const data = new VerifyOTPTokenValidator();
    data.password = params.password;
    data.code = params.code;
    data.secret = params.secret;
    const result = await VerifyOTPTokenBusiness(id, data);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
