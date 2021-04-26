import UserRepository from '@src/repository/UserRepository';
import {CommissionMemberListValidator} from '@src/validator/commissions/CommissionMemberListValidator';
import {ICommissionModel} from 'bo-trading-common/lib/models/Commissions';
import {validate} from 'class-validator';

export const CommissionMemberListBusiness = async (obj: CommissionMemberListValidator): Promise<ICommissionModel[]> => {
  try {
    const validation = await validate(obj);
    if (validation.length !== 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const userRes = new UserRepository();
    const result = await userRes.commissionMemberList(obj.userId, obj.fromDate, obj.toDate, obj.page, obj.limit);
    return result;
  } catch (err) {
    throw err;
  }
};
