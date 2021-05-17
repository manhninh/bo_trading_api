import UserRepository from '@src/repository/UserRepository';
import ICommissionTransactionModel from 'bo-trading-common/lib/models/commissionTransactions/ICommissionTransactionModel';
import {GetAllUserValidator} from '@src/validator/admins/GetAllUserValidator';
import {validate} from 'class-validator';

export const GetAllUserBusiness = async (obj: GetAllUserValidator): Promise<ICommissionTransactionModel[]> => {
  try {
    const validation = await validate(obj);
    if (validation.length !== 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const userRepositoryRes = new UserRepository();
    const result = await userRepositoryRes.getListUsers(obj.textSearch, obj.hideAmountSmall, obj.page, obj.limit);
    return result;
  } catch (err) {
    throw err;
  }
};
