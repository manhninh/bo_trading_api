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
      status: Constants.TRANSACTION_STATUS_PROCESSING,
      type: Constants.TRANSACTION_TYPE_DEPOSIT
    });
    return true;
  } catch (err) {
    throw err;
  }
};

export const createDepositERC20TempWalletTransaction = async (user, amount, symbol, address, tx): Promise<any> => {
  try {
    const userWalletRes = new UserTransactionsRepository();
    userWalletRes.create(<IUserTransactionsModel>{
      user_id: user._id,
      to_user_id: null,
      amount: amount,
      symbol: symbol,
      address: address,
      tx: tx,
      status: Constants.TRANSACTION_STATUS_SUCCESS,
      type: Constants.TRANSACTION_TYPE_TEMP_DEPOSIT
    });
    return true;
  } catch (err) {
    throw err;
  }
};
