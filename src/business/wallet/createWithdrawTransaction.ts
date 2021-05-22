import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import { IUserTransactionsModel } from "bo-trading-common/lib/models/userTransactions";
import Constants from 'bo-trading-common/lib/utils/Constants';

export const createWithdrawTransaction = async (user_id, amount, symbol, address, tx, fee = 0): Promise<any> => {
  try {
    const userWalletRes = new UserTransactionsRepository();
    const trx = await userWalletRes.create(<IUserTransactionsModel>{
      user_id: user_id,
      to_user_id: null,
      amount: amount,
      symbol: symbol,
      address: address,
      tx: tx,
      status: Constants.TRANSACTION_STATUS_PENDING,
      system_status: Constants.TRANSACTION_STATUS_PENDING,
      type: Constants.TRANSACTION_TYPE_WITHDRAW,
      fee: fee
    });

    return trx;
  } catch (err) {
    throw err;
  }
};