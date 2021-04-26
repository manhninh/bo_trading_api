import {CommissionMemberListBusiness} from '@src/business/comissions/CommissionMemberListBusiness';
import {CommissionMemberListValidator} from '@src/validator/commissions/CommissionMemberListValidator';
import {NextFunction, Request, Response} from 'express';

export const CommissionMemberListController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user['id'];
    const params = req.query;
    const data = new CommissionMemberListValidator();
    data.userId = userId;
    data.fromDate = new Date(params.fromDate.toString());
    data.toDate = new Date(params.toDate.toString());
    data.page = Number(params.page);
    data.limit = Number(params.limit);
    const result = await CommissionMemberListBusiness(data);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
