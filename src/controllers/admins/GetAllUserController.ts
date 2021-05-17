import {GetAllUserBusiness} from '@src/business/admins/GetAllUserBusiness';
import {GetAllUserValidator} from '@src/validator/admins/GetAllUserValidator';
import {NextFunction, Request, Response} from 'express';

export const GetAllUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.query;
    const data = new GetAllUserValidator();
    data.textSearch = params.textSearch.toString();
    data.hideAmountSmall = Boolean(params.hideAmountSmall);
    data.page = Number(params.page);
    data.limit = Number(params.limit);
    const result = await GetAllUserBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
