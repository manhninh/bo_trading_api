import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import ICommissionTransactionModel from 'bo-trading-common/lib/models/commissionTransactions/ICommissionTransactionModel';

export const GetTranferUserOnAdminBusiness = async (
  id: string,
  page: number,
  limit: number,
): Promise<ICommissionTransactionModel[]> => {
  try {
    const userTransactionRes = new UserTransactionsRepository();
    const result = await userTransactionRes.tranferUsersOnAdmin(id, page, limit);
    return result;
  } catch (err) {
    throw err;
  }
};
