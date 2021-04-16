import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import { IUserTransactionsModel } from "bo-trading-common/lib/models/userTransactions";
import Constants from 'bo-trading-common/lib/utils/Constants';

export const createDepositTransaction = async (user, amount, symbol, address, tx): Promise<any> => {
  try {
    const userWalletRes = new UserTransactionsRepository();
    userWalletRes.create(<IUserTransactionsModel>{
      user_id: user._id,
      to_user_id: null,
      amount: amount,
      symbol: symbol,
      address: address,
      tx: tx,
      status: Constants.TRANSACTION_STATUS_PENDING,
      type: Constants.TRANSACTION_TYPE_DEPOSIT
    });

  } catch (err) {
    throw err;
  }
};
