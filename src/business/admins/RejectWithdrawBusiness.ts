import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { RejectWithdrawValidator } from "@src/validator/admins/RejectWithdraw";
import { Constants } from "bo-trading-common/lib/utils";
import { validate } from "class-validator";

export const RejectWithdrawBusiness = async (input: RejectWithdrawValidator): Promise<any> => {
  try {
    const validation = await validate(input);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // Get transaction
      const txModel = new UserTransactionsRepository();
      const transaction = await txModel.GetTransactionDetail(input.transactionId);

      if (transaction && !transaction.tx && transaction.type == Constants.TRANSACTION_TYPE_WITHDRAW && transaction.status == Constants.TRANSACTION_STATUS_PENDING) {
        // Increment the user's amount
        const walletModel = new UserWalletRepository();
        walletModel.updateByUserId(transaction.user_id, { $inc: { amount: (Number(transaction.amount) + Number(transaction.fee)) } });

        // Update status for transaction
        txModel.updateById(transaction._id, {
          'status': Constants.TRANSACTION_STATUS_CANCELLED
        });

        return txModel.GetTransactionDetail(input.transactionId);
      } else {
        throw new Error('Can not reject this transaction, please check transaction status!');
      }
    }
  } catch (err) {
    throw err;
  }
};
