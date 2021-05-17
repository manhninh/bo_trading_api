import UserRepository from '@src/repository/UserRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import ICommissionTransactionModel from 'bo-trading-common/lib/models/commissionTransactions/ICommissionTransactionModel';
import {validate} from 'class-validator';
import moment from 'moment';

export const GetAllDepositBusiness = async (
  username: string,
  status: number,
  fromDate: Date,
  toDate: Date,
  page: number,
  limit: number,
): Promise<ICommissionTransactionModel[]> => {
  try {
    const userTransactionRes = new UserTransactionsRepository();
    const from = new Date(moment(fromDate).startOf('day').toISOString());
    const to = new Date(moment(toDate).endOf('day').toISOString());
    const result = await userTransactionRes.depositUsers(username, status, from, to, page, limit);
    return result;
  } catch (err) {
    throw err;
  }
};
