import {ResetTFAUserBusiness} from '@src/business/admins/ResetTFAUserBusiness';
import {NextFunction, Request, Response} from 'express';

export const ResetTFAUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const result = await ResetTFAUserBusiness(params.userId);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
