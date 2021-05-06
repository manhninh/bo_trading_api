import config from "@src/config/index";
import wallet from "@src/config/wallet";
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateWithdrawERC20Validator } from "@src/validator/wallet/CreateWithdrawERC20";
import { validate } from "class-validator";
import { getBalanceEth, getBalanceUsdt, sendUsdt } from "../user/CreateWalletBusiness";
import { createWithdrawTransaction } from "./createWithdrawTransaction";

export const CreateWithdrawERC20Business = async (transaction: CreateWithdrawERC20Validator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // TODO
      // Check user is real user && balance of user
      const userModel = new UserRepository();
      const txModel = new UserWalletRepository();
      const canWithdraw = await userModel.readyWithdraw(transaction.user_id, transaction.amount, transaction.password, transaction.tfa);

      if (!canWithdraw) {
        throw new Error('Can not withdraw, please try again later!');
      }

      try {
        const txAmount = (transaction.amount - Number(wallet.ETH_ERC20_TRANSACTION_FEE));
        // Withdraw with Tronweb
        if (transaction.symbol == config.ETH_ERC20_SYMBOL) {
          // Create tx
          const trx = await createWithdrawTransaction(transaction.user_id, txAmount, config.ETH_ERC20_SYMBOL, transaction.address, null, Number(wallet.ETH_ERC20_TRANSACTION_FEE));
          if (trx) {

            // Decrement the user's amount
            txModel.updateByUserId(transaction.user_id, { $inc: { amount: (-1 * Number(transaction.amount)) } });

            // Check auto withdraw for this user & system
            const configModel = new SystemConfigRepository();
            const enableWithdraw = await configModel.findOne({ key: config.SYSTEM_ENABLE_AUTO_WITHDRAW_KEY });
            if (enableWithdraw && Boolean(enableWithdraw.value)) {
              createERC20transfer(transaction, trx, txAmount);
            }
          }

          return trx;
        } else if (transaction.symbol == config.ETH_ERC20_SYMBOL) {

        } else {
          throw new Error('This symbol does not support, please try with other!');
        }
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    throw err;
  }
};

async function createERC20transfer(transaction, trx, txAmount) {
  // Valid amount
  if (transaction.amount < Number(wallet.ETH_ERC20_WITHDRAW_MIN_AMOUNT)) {
    throw new Error('Can not withdraw, the amount at least ' + wallet.ETH_ERC20_WITHDRAW_MIN_AMOUNT + '!');
  }

  const hotUSDTWalletBalance = await getBalanceUsdt(wallet.HOT_WALLET_ETH_PRIVATE_KEY, wallet.HOT_WALLET_ETH_ADDRESS);
  if (hotUSDTWalletBalance >= Number(txAmount)) {
    // Get ETH (check energy)
    const hotETHWalletBalance = await getBalanceEth(wallet.HOT_WALLET_ETH_PRIVATE_KEY, wallet.HOT_WALLET_ETH_ADDRESS);

    if (Number(hotETHWalletBalance) >= 0.01) {
      // Get config gas from DB - Admin setup
      const configModel = new SystemConfigRepository();
      const configWithdrawGasPrice = await configModel.findOne({ key: config.SYSTEM_ERC20_GAS_KEY });

      const tx = await sendUsdt(
        wallet.HOT_WALLET_ETH_PRIVATE_KEY,
        wallet.HOT_WALLET_ETH_ADDRESS,
        transaction.address,
        String(txAmount),
        (configWithdrawGasPrice ? configWithdrawGasPrice.value : '90')
      );;

      if (tx && trx) {
        const txModel = new UserTransactionsRepository();
        txModel.updateById(trx._id, {
          'tx': tx as string
        });
      }
    }
  }
}
