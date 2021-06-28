import {SaveProtectDetailBusiness} from '@src/business/admins/SaveProtectDetailBusiness';
import {SaveProtectDetailValidator} from '@src/validator/admins/SaveProtectDetailValidator';
import {NextFunction, Request, Response} from 'express';

export const SaveProtectDetailController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = new SaveProtectDetailValidator();
    data.protectLevel1 = params.protectLevel1;
    data.protectLevel2 = params.protectLevel2;
    data.protectLevel3 = params.protectLevel3;
    data.protectLevel4 = params.protectLevel4;
    const result = await SaveProtectDetailBusiness(data);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
