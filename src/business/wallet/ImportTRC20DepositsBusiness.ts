import config from '@src/config';
import UserRepository from '@src/repository/UserRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants } from 'bo-trading-common/lib/utils';
import { createUSDTTRC20 } from '../user/CreateWalletBusiness';
import { createDepositTransaction } from './createDepositTransaction';
import { createSystemTransaction } from './createSystemTransaction';

export const importTRC20Deposits = async (): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const rows = await userRes.getAllWallets();

    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const TronWeb = require('tronweb');
      const trc20ContractAddress = config.TRON_USDT_TRC20_CONTRACT_ADDRESS;
      const walletModel = new UserWalletRepository();
      const txModel = new UserTransactionsRepository();

      rows.forEach(async row => {
        try {
          // START: Check for TRC20
          if (row.trc20 !== undefined && row.trc20) {
            const tronWallet = JSON.parse(row.trc20);
            if (tronWallet !== undefined && typeof tronWallet == 'object') {
              const tronWeb = new TronWeb({
                fullHost: config.TRON_FULL_NODE,
                headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY }
              });
              tronWeb.setPrivateKey(tronWallet.privateKey);
              const walletAddress = tronWallet.address.base58;
              // Transfer to COOL WALLET (TRON-USDT-TRC20)
              // Connect with Contract
              const trc20Contract = await tronWeb.contract().at(trc20ContractAddress);
              const trc20Decimals = await trc20Contract.decimals().call();
              const trc20AccountBalance = await trc20Contract.balanceOf(walletAddress).call();
              const decimals = (Math.pow(10, trc20Decimals));
              const trc20AccountBalanceOrigin = Number(trc20AccountBalance.toString()) / decimals;
              if (trc20AccountBalanceOrigin >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {

                // Add to wallet balance (temp) => amount_trc20_wallet
                const currentAmountWallet = Number(row?.amount_trc20_wallet) || 0;
                const realBalance = Number(trc20AccountBalanceOrigin) - currentAmountWallet;
                if (realBalance >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
                  walletModel.updateByUserId(row.user_id, { $inc: { amount: realBalance } });
                }
                walletModel.updateByUserId(row.user_id, { amount_trc20_wallet: Number(trc20AccountBalanceOrigin) });

                // Check to send TRX
                if (realBalance >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT) || currentAmountWallet >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
                  // #########
                  let userTx;
                  if (realBalance >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
                    // Create User transaction
                    userTx = await createDepositTransaction(row, realBalance, config.TRON_TRC20_SYMBOL, walletAddress, null);
                  } else {
                    userTx = true;
                  }
                  if (userTx) {

                    // Get TRX (check energy)
                    let TRXBalance = await tronWeb.trx.getBalance(walletAddress);
                    TRXBalance = TRXBalance / 1000000;

                    if (TRXBalance >= config.TRON_TRC20_DEPOSIT_ENERGY_FEE) {
                      const tx = await trc20Contract
                        .transfer(
                          config.TRON_COOL_WALLET_ADDRESS, // Address to which to send the tokens
                          trc20AccountBalance, // Amount of tokens you want to send in SUN
                        )
                        .send({
                          feeLimit: 10000000 // Make sure to set a reasonable feelimit in SUN
                        });
                      if (tx) {
                        await txModel.updateMany(
                          {
                            user_id: row.user_id,
                            symbol: config.TRON_TRC20_SYMBOL,
                            system_status: Constants.TRANSACTION_STATUS_PROCESSING,
                            type: Constants.TRANSACTION_TYPE_DEPOSIT,
                            address: walletAddress,
                            tx: null
                          },
                          {
                            tx: tx,
                            system_status: Constants.TRANSACTION_STATUS_PENDING
                          }
                        );
                      }
                    } else {
                      // Transfer TRX from HOT WALLET to User Wallet
                      // Cần gửi TRX sang tài khoản user vì khi transfer TRC20 => cần TRX để convert energy
                      tronWeb.setPrivateKey(config.TRON_HOT_WALLET_PRIVATE_KEY);
                      let TRXHOTBalance = await tronWeb.trx.getBalance(config.TRON_HOT_WALLET_ADDRESS);
                      TRXHOTBalance = TRXHOTBalance / 1000000;
                      if (TRXHOTBalance >= config.TRON_TRC20_DEPOSIT_ENERGY_FEE) {
                        try {
                          const tx = await tronWeb.trx.sendTransaction(
                            walletAddress, // TO Address
                            Number(config.TRON_TRC20_DEPOSIT_ENERGY_FEE) * 1000000
                          );
                          if (tx !== undefined && tx.result !== undefined && tx.result) {
                            await createSystemTransaction(row, config.TRON_TRC20_DEPOSIT_ENERGY_FEE, config.TRON_TRC20_SYMBOL, walletAddress, tx.txid);
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      } else {
                        // Gửi email thông báo cho Admin (Hết TRX trong Hot wallet)
                      }
                    }

                  }
                }
              }
            }
          } else {
            const user = {
              id: row._id
            };
            createUSDTTRC20(user);
          }
          // END: Check for TRC20
          await delay(500);
        } catch (err) {
          await delay(0);
        }
      });
    }
  } catch (err) {
    throw err;
  }
};
