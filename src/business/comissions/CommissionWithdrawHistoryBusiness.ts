import CommissionTransactionRepository from '@src/repository/CommissionTransactionRepository';
import UserRepository from '@src/repository/UserRepository';
import {CommissionWithdrawHistoryValidator} from '@src/validator/commissions/CommissionWithdrawHistoryValidator';
import {ICommissionModel} from 'bo-trading-common/lib/models/Commissions';
import ICommissionTransactionModel from 'bo-trading-common/lib/models/commissionTransactions/ICommissionTransactionModel';
import {validate} from 'class-validator';

export const CommissionWithdrawHistoryBusiness = async (obj: CommissionWithdrawHistoryValidator): Promise<ICommissionTransactionModel[]> => {
  try {
    const validation = await validate(obj);
    if (validation.length !== 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const commissionTransactionRes = new CommissionTransactionRepository();
    const result = await commissionTransactionRes.commissionWithdrawHistories(
      obj.userId,
      obj.fromDate,
      obj.toDate,
      obj.page,
      obj.limit,
    );
    return result;
  } catch (err) {
    throw err;
  }
};
