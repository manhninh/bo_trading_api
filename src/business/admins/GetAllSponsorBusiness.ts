import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import ICommissionTransactionModel from 'bo-trading-common/lib/models/commissionTransactions/ICommissionTransactionModel';

export const GetAllSponsorBusiness = async (
  username: string,
  page: number,
  limit: number,
): Promise<ICommissionTransactionModel[]> => {
  try {
    const userTransactionRes = new UserTransactionsRepository();
    const result = await userTransactionRes.allSponsor(username, page, limit);
    return result;
  } catch (err) {
    throw err;
  }
};
