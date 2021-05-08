import { forgotPasswordBusiness } from '@src/business/user/ForgotPasswordBusiness';
import { ForgotPasswordValidator } from '@src/validator/users/ForgotPassword';
import { NextFunction, Request, Response } from 'express';

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = new ForgotPasswordValidator();
    data.email = req.body.email.toString();
    const result = await forgotPasswordBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
