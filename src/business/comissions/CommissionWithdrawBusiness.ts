import CommissionRepository from '@src/repository/CommissionRepository';
import UserRepository from '@src/repository/UserRepository';
import {CommissionWithdrawValidator} from '@src/validator/commissions/CommissionWithdrawValidator';
import {ICommissionModel} from 'bo-trading-common/lib/models/Commissions';
import {validate} from 'class-validator';

export const CommissionWithdrawBusiness = async (obj: CommissionWithdrawValidator): Promise<boolean> => {
  try {
    const validation = await validate(obj);
    if (validation.length !== 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const commissionRes = new CommissionRepository();
    const result = await commissionRes.commissionWithdraw(obj.userId, obj.typeComission, obj.date);
    return result;
  } catch (err) {
    throw err;
  }
};
