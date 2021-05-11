import { SystemConfiglBusiness } from '@src/business/admins/SystemConfigBusiness';
import { SystemConfigValidator } from '@src/validator/admins/SystemConfigValidator';
import { NextFunction, Request, Response } from 'express';

export const SystemConfigController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = new SystemConfigValidator();
    data.key = params.key;
    data.value = params.value;
    const result = await SystemConfiglBusiness(data);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
