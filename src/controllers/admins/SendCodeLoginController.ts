import {SendCodeLoginBusiness} from '@src/business/admins/SendCodeLoginBusiness';
import {SendCodeLoginValidator} from '@src/validator/admins/SendCodeLoginValidator';
import {NextFunction, Request, Response} from 'express';

export const SendCodeLoginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = new SendCodeLoginValidator();
    data.email = req.body.email.toString();
    await SendCodeLoginBusiness(data);
    res.status(200).send({data: true});
  } catch (err) {
    next(err);
  }
};
