import config from "@src/config/index";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateTransferValidator } from "@src/validator/wallet/CreateTransfer";
import { IUserTransactionsModel } from "bo-trading-common/lib/models/userTransactions";
import { Constants } from "bo-trading-common/lib/utils";
import { validate } from "class-validator";

export const CreateTransferBusiness = async (transaction: CreateTransferValidator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // TODO
      // Check user is real user && balance of user
      const userModel = new UserRepository();
      const receiver = await userModel.findOne({ username: transaction.username, type_user: 0 });
      const canTransfer = await userModel.readyTransfer(transaction.user_id, transaction.amount, transaction.password);

      if (!receiver) {
        throw new Error('Can not find the receiver by username, please try again later!');
      }

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
          to_user_id: receiver._id,
          amount: transaction.amount,
          symbol: config.TRANSFER_SYMBOL,
          address: null,
          tx: uuid,
          status: Constants.TRANSACTION_STATUS_SUCCESS,
          type: Constants.TRANSACTION_TYPE_TRANSFER
        });

        // Update amount for Sender & Receiver (No fee)
        const walletModel = new UserWalletRepository;
        walletModel.updateByUserId(transaction.user_id, { $inc: { amount: (-1 * transaction.amount) } });
        walletModel.updateByUserId(receiver._id, { $inc: { amount: transaction.amount } });

        return result;

      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    throw err;
  }
};
