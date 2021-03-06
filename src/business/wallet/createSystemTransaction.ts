import SystemTransactionsRepository from "@src/repository/SystemTransactionsRepository";
import { ISystemTransactionsModel } from "bo-trading-common/lib/models/systemTransactions";
import Constants from 'bo-trading-common/lib/utils/Constants';

export const createSystemTransaction = async (user, amount, symbol, address, tx): Promise<any> => {
  try {
    const systemWalletRes = new SystemTransactionsRepository();
    const res = systemWalletRes.create(<ISystemTransactionsModel>{
      user_id: user._id,
      amount: amount,
      symbol: symbol,
      address: address,
      tx: tx,
      response: tx,
      status: Constants.TRANSACTION_STATUS_PENDING
    });

    return res;
  } catch (err) {
    throw err;
  }
};
