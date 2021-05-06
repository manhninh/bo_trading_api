import config from "@src/config/index";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateInternalTransferValidator } from "@src/validator/wallet/CreateInternalTransfer";
import { IUserTransactionsModel } from "bo-trading-common/lib/models/userTransactions";
import { Constants } from "bo-trading-common/lib/utils";
import { validate } from "class-validator";

export const CreateInternalTransferBusiness = async (transaction: CreateInternalTransferValidator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // TODO
      // Check user is real user && balance of user
      transaction.from_wallet = transaction.from_wallet == 'spot' ? 'amount' : transaction.from_wallet;
      const userModel = new UserRepository();
      const canTransfer = await userModel.readyInternalTransfer(transaction.user_id, transaction.amount, transaction.from_wallet);

      if (!canTransfer) {
        throw new Error('Can not transfer, please try again later!');
      }

      try {
        // Create transaction for transfer
        const faker = require('faker');
        const uuid = faker.datatype.uuid();
        const userWalletRes = new UserTransactionsRepository();
        const result = await userWalletRes.create(<IUserTransactionsModel>{
          user_id: transaction.user_id,
          to_user_id: transaction.user_id,
          amount: transaction.amount,
          symbol: config.TRANSFER_SYMBOL,
          address: null,
          tx: uuid,
          status: Constants.TRANSACTION_STATUS_SUCCESS,
          type: Constants.TRANSACTION_TYPE_TRANSFER,
          noted: 'Transfer from ' + transaction.from_wallet + ' to ' + transaction.to_wallet
        });

        // Update amount for Sender & Receiver (No fee)
        const txModel = new UserWalletRepository();
        let inc = { $inc: {} };

        // TO WALLET
        if (transaction.to_wallet == 'amount') {
          inc.$inc['amount'] = transaction.amount;
        } else {
          inc.$inc['amount_' + transaction.to_wallet] = transaction.amount;
        }

        // FROM WALLET
        if (transaction.from_wallet == 'amount') {
          inc.$inc['amount'] = -1 * transaction.amount;
        } else {
          inc.$inc['amount_' + transaction.from_wallet] = -1 * transaction.amount;
        }
        txModel.updateByUserId(transaction.user_id, inc);

        return result;
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    throw err;
  }
};
