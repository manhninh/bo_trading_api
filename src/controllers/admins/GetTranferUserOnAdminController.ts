import {GetTranferUserOnAdminBusiness} from '@src/business/admins/GetTranferByUserOnAdminBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetTranferUserOnAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const id = params.id.toString();
    const page = Number(params.page);
    const limit = Number(params.limit);
    const result = await GetTranferUserOnAdminBusiness(id, page, limit);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
