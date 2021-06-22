import config, { configSendEmail } from "@src/config/index";
import AdminRepository from "@src/repository/AdminRepository";
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from "@src/repository/UserRepository";
import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import UserWalletRepository from "@src/repository/UserWalletRepository";
import { CreateWithdrawValidator } from "@src/validator/wallet/CreateWithdraw";
import axios from "axios";
import { EmailConfig, logger } from "bo-trading-common/lib/utils";
import { validate } from "class-validator";
import handlebars from 'handlebars';
import { createWithdrawTransaction } from "./createWithdrawTransaction";

export const CreateWithdrawBusiness = async (transaction: CreateWithdrawValidator): Promise<any> => {
  try {
    const validation = await validate(transaction);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
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
          const txModel = new UserWalletRepository();
          const canWithdraw = await userModel.readyWithdraw(transaction.user_id, transaction.amount, transaction.password, transaction.tfa);

          if (!canWithdraw) {
            throw new Error('Can not withdraw, please try again later!');
          }

          try {
            const txAmount = (transaction.amount - Number(config.TRON_TRC20_TRANSACTION_FEE));
            // Withdraw with Tronweb
            if (transaction.symbol == config.TRON_TRC20_SYMBOL) {
              // Create tx
              const trx = await createWithdrawTransaction(transaction.user_id, txAmount, config.TRON_TRC20_SYMBOL, transaction.address, null, Number(config.TRON_TRC20_TRANSACTION_FEE));
              if (trx) {

                // Decrement the user's amount
                txModel.updateByUserId(transaction.user_id, { $inc: { amount: (-1 * Number(transaction.amount)) } });

                // Check auto withdraw for this user & system
                const configModel = new SystemConfigRepository();
                const enableWithdraw = await configModel.findOne({ key: config.SYSTEM_ENABLE_AUTO_WITHDRAW_KEY });
                if (enableWithdraw && Boolean(enableWithdraw.value)) {
                  await createTRC20transfer(transaction, trx, txAmount);
                }

                // Get all email from admin
                const adminRepos = new AdminRepository();
                const admins = await adminRepos.findAll();
                const emailConfig = new EmailConfig(configSendEmail);

                // Get user info
                const user = await userModel.findById(transaction.user_id);

                // Send email to admin
                admins.map(async (admin) => {
                  emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/withdraw.html`, (html: string) => {
                    const template = handlebars.compile(html);
                    const replacements = {
                      'username': admin.email,
                      'symbol': config.TRON_TRC20_SYMBOL,
                      'user_account': user?.username,
                      'user_email': user?.email,
                      'amount': txAmount,
                      'address': transaction.address
                    };
                    const htmlToSend = template(replacements);
                    emailConfig
                      .send(config.EMAIL_ROOT, admin.email, 'TRC20 - Withdraw requested', htmlToSend)
                      .catch((err) => logger.error(err.message));
                  });
                });
              }

              return trx;
            } else {
              throw new Error('This symbol does not support, please try with other!');
            }
          } catch (err) {
            throw err;
          }
        } else {
          throw new Error(`${response.data['error-codes'][0]}`);
        }
      } else {
        throw new Error('Can not made the withdraw, please try again later!');
      }
    }
  } catch (err) {
    throw err;
  }
};

export const createTRC20transfer = async (transaction, trx, txAmount): Promise<any> => {
  // Valid amount
  if (transaction.amount < Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
    throw new Error('Can not withdraw, the amount at least ' + config.TRON_TRC20_DEPOSIT_MIN_AMOUNT + '!');
  }

  const TronWeb = require('tronweb');
  const trc20ContractAddress = config.TRON_USDT_TRC20_CONTRACT_ADDRESS;
  const tronWeb = new TronWeb({
    fullHost: config.TRON_FULL_NODE,
    headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY }
  });
  tronWeb.setPrivateKey(config.TRON_HOT_WALLET_PRIVATE_KEY);
  const trc20Contract = await tronWeb.contract().at(trc20ContractAddress);
  const trc20Decimals = await trc20Contract.decimals().call();
  const trc20AccountBalance = await trc20Contract.balanceOf(config.TRON_HOT_WALLET_ADDRESS).call();
  const decimals = (Math.pow(10, trc20Decimals));
  const trc20AccountBalanceOrigin = Number(trc20AccountBalance.toString()) / decimals;
  if (trc20AccountBalanceOrigin >= Number(txAmount)) {
    // Get TRX (check energy)
    let TRXBalance = await tronWeb.trx.getBalance(config.TRON_HOT_WALLET_ADDRESS);
    TRXBalance = TRXBalance / 1000000;

    if (TRXBalance >= config.TRON_TRC20_DEPOSIT_ENERGY_FEE) {
      const amount = (txAmount * decimals).toString();
      const tx = await trc20Contract
        .transfer(
          transaction.address, // Address to which to send the tokens
          amount, // Amount of tokens you want to send in SUN
        )
        .send({
          feeLimit: 10000000 // Make sure to set a reasonable feelimit in SUN
        });

      if (tx && trx) {
        const txModel = new UserTransactionsRepository();
        txModel.updateById(trx._id, {
          'tx': tx
        });

        return tx;
      } else {
        console.log('Case 1 - Can not made the TRC20 withdraw.');
        return false;
      }
    } else {
      console.log('Case 2 - Can not made the TRC20 withdraw. Hot wallet not have enough TRX');
      false;
    }
  } else {
    console.log('Case 3 - Can not made the TRC20 withdraw. Hot wallet not have enough USDT-TRC20');
    return false;
  }
};
