import { CreateMfaQrCodeBusiness } from '@src/business/user/CreateMfaQrCodeBusiness';
import { NextFunction, Request, Response } from 'express';

export const CreateMfaQrCodeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const result = await CreateMfaQrCodeBusiness(id);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
