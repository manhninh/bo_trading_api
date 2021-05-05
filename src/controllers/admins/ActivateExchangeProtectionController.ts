import {ActivateExchangeProtectionBusiness} from '@src/business/admins/ActivateExchangeProtectionBusiness';
import {NextFunction, Request, Response} from 'express';

export const ActivateExchangeProtectionController = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const protectStatus = req.body.protectStatus;
    const result = ActivateExchangeProtectionBusiness(protectStatus);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
