import {GetAllSponsorBusiness} from '@src/business/admins/GetAllSponsorBusiness';
import {NextFunction, Request, Response} from 'express';

export const GetAllSponsorController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const username = params.username.toString();
    const page = Number(params.page);
    const limit = Number(params.limit);
    const result = await GetAllSponsorBusiness(username, page, limit);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
