import { createTRC20transfer } from '@src/business/wallet/CreateWithdrawBusiness';
import { createERC20transfer } from '@src/business/wallet/CreateWithdrawERC20Business';
import config from "@src/config/index";
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import { ConfirmWithdrawValidator } from "@src/validator/admins/ConfirmWithdraw";
import { Constants } from 'bo-trading-common/lib/utils';
import { validate } from "class-validator";

export const ConfirmWithdrawBusiness = async (input: ConfirmWithdrawValidator): Promise<any> => {
  try {
    const validation = await validate(input);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // Get transaction
      const txModel = new UserTransactionsRepository();
      const transaction = await txModel.GetTransactionDetail(input.transactionId);

      if (transaction && !transaction.tx && transaction.type == Constants.TRANSACTION_TYPE_WITHDRAW && transaction.status == Constants.TRANSACTION_STATUS_PENDING) {
        // Withdraw with Tronweb
        let result = false;
        const txAmount = transaction.amount;
        transaction.amount += transaction.fee;
        if (transaction.symbol == config.TRON_TRC20_SYMBOL) {
          result = await createTRC20transfer(transaction, transaction, txAmount);
        } else if (transaction.symbol == config.ETH_ERC20_SYMBOL) {
          result = await createERC20transfer(transaction, transaction, txAmount);
        } else {
          throw new Error('This symbol does not support, please try with other!');
        }

        if (!result) {
          throw new Error('Can not create withdraw for this transaction, please check the receiver address & Hot wallet balance!');
        } else {
          // Update status for transaction
          txModel.updateById(transaction._id, {
            'status': Constants.TRANSACTION_STATUS_PROCESSING
          });

          return await txModel.GetTransactionDetail(input.transactionId);
        }
      } else {
        throw new Error('This transaction is not existed yet or can not to create withdraw!');
      }
    }
  } catch (err) {
    throw err;
  }
};
