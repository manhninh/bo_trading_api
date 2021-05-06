import {SendCodeVerifyBusiness} from '@src/business/admins/SendCodeVerifyBusiness';
import {NextFunction, Request, Response} from 'express';

export const SendCodeMFAController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user['id'];
    await SendCodeVerifyBusiness(id);
    res.status(200).send({data: true});
  } catch (err) {
    next(err);
  }
};
