import {getAdminInforBusiness} from '@src/business/admins/GetAdminInforBusiness';
import {NextFunction, Request, Response} from 'express';

export const getAdminInforController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user['id'];
    const result = await getAdminInforBusiness(id);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
