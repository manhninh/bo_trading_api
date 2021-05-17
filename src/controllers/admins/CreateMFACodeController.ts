import {CreateMFACodeBusiness} from '@src/business/admins/CreateMFACodeBusiness';
import {NextFunction, Request, Response} from 'express';

export const createMFACodeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user['id'];
    const result = await CreateMFACodeBusiness(id);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
