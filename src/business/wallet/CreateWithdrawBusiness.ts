import config from "@src/config/index";
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateWithdrawValidator } from "@src/validator/wallet/CreateWithdraw";
import { validate } from "class-validator";
import { createWithdrawTransaction } from "./createWithdrawTransaction";

export const CreateWithdrawBusiness = async (transaction: CreateWithdrawValidator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      // TODO
      // Check user is real user && balance of user
      const userModel = new UserRepository();
      const txModel = new UserWalletRepository();
      const canTransfer = await userModel.readyTransfer(transaction.user_id, transaction.amount, transaction.password, transaction.tfa);

      if (!canTransfer) {
        throw new Error('Can not withdraw, please try again later!');
      }

      try {
        const txAmount = (transaction.amount - Number(config.TRON_TRC20_TRANSACTION_FEE));
        // Withdraw with Tronweb
        if (transaction.symbol == config.TRON_TRC20_SYMBOL) {
          // Create tx
          const trx = await createWithdrawTransaction(transaction.user_id, txAmount, config.TRON_TRC20_SYMBOL, transaction.address, null);
          if (trx) {

            // Decrement the user's amount
            txModel.updateByUserId(transaction.user_id, { $inc: { amount: (-1 * Number(transaction.amount)) } });

            // Check auto withdraw for this user & system
            const configModel = new SystemConfigRepository();
            const enableWithdraw = await configModel.findOne({ key: config.SYSTEM_ENABLE_AUTO_WITHDRAW_KEY });
            if (enableWithdraw && Boolean(enableWithdraw.value)) {
              createTRC20transfer(transaction, trx);
            }
          }

          return trx;
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

async function createTRC20transfer(transaction, trx) {
  // Valid amount
  if (transaction.amount < Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
    throw new Error('Can not withdraw, the amount at least ' + config.TRON_TRC20_DEPOSIT_MIN_AMOUNT + '!');
  }

  const TronWeb = require('TronWeb');
  const trc20ContractAddress = config.TRON_USDT_TRC20_CONTRACT_ADDRESS;
  const tronWeb = new TronWeb({
    fullHost: config.TRON_FULL_NODE,
    headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY }
  });
  tronWeb.setPrivateKey(config.TRON_HOT_WALLET_PRIVATE_KEY);
  const trc20Contract = await tronWeb.contract().at(trc20ContractAddress);
  const trc20Decimals = await trc20Contract.decimals().call();
  const trc20AccountBalance = await trc20Contract.balanceOf(config.TRON_HOT_WALLET_ADDRESS).call();
  const decimals = (Math.pow(10, trc20Decimals.toNumber()));
  const trc20AccountBalanceOrigin = Number(trc20AccountBalance.toString()) / decimals;
  if (trc20AccountBalanceOrigin >= Number(transaction.amount)) {
    // Get TRX (check energy)
    let TRXBalance = await tronWeb.trx.getBalance(config.TRON_HOT_WALLET_ADDRESS);
    TRXBalance = TRXBalance / 1000000;

    if (TRXBalance >= 2) {
      const tx = await trc20Contract
        .transfer(
          transaction.address, // Address to which to send the tokens
          (1 * decimals).toString(), // Amount of tokens you want to send in SUN
        )
        .send({
          feeLimit: 100000000 // Make sure to set a reasonable feelimit in SUN
        });

      if (tx && trx) {
        const txModel = new UserTransactionsRepository();
        txModel.updateById(trx._id, {
          'tx': tx
        });
      }
    }
  }
}
