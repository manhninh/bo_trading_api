import { SendCodeBusiness } from '@src/business/admins/SendCodeBusiness';
import { SendCodeValidator } from '@src/validator/admins/SendCodeValidator';
import { NextFunction, Request, Response } from 'express';

export const SendCodeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = new SendCodeValidator();
    data.email = req.body.email.toString();
    await SendCodeBusiness(data);
    res.status(200).send({ data: true });
  } catch (err) {
    next(err);
  }
};
