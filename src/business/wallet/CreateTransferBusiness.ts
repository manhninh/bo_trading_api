import config from "@src/config/index";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateTransferValidator } from "@src/validator/wallet/CreateTransfer";
import axios from "axios";
import { IUserTransactionsModel } from "bo-trading-common/lib/models/userTransactions";
import { Constants } from "bo-trading-common/lib/utils";
import { validate } from "class-validator";
export const CreateTransferBusiness = async (transaction: CreateTransferValidator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // docs recaptcha v3
      // https://developers.google.com/recaptcha/docs/verify

      const response = await axios({
        method: 'POST',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${config.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${transaction.response}`,
      });
      if (response.status === 200 && response.status) {
        const data = response.data;
        if (data.score > 0.5) {
          // TODO
          // Check user is real user && balance of user
          const userModel = new UserRepository();
          const receiver = await userModel.findOne({ username: transaction.username, type_user: 0 });
          const canTransfer = await userModel.readyTransfer(transaction.user_id, transaction.amount);

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
            const txModel = new UserWalletRepository();
            txModel.updateByUserId(transaction.user_id, { $inc: { amount: (-1 * transaction.amount) } });
            txModel.updateByUserId(receiver._id, { $inc: { amount: transaction.amount } });

            return result;
          } catch (err) {
            throw err;
          }
        } else {
          throw new Error(`${response.data['error-codes'][0]}`);
        }
      } else {
        throw new Error('Can not made the transfer, please try again later!');
      }
    }
  } catch (err) {
    throw err;
  }
};
