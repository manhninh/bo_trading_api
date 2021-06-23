import config from '@src/config';
import { default as wallet } from '@src/config/wallet';
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from '@src/repository/UserRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants } from 'bo-trading-common/lib/utils';
import { getBalanceEth, getBalanceUsdt, sendEth, sendUsdt } from '../user/CreateWalletBusiness';
import { createDepositTransaction } from './createDepositTransaction';
import { createSystemTransaction } from './createSystemTransaction';

export const importERC20Deposits = async (): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const rows = await userRes.getAllWallets();
    const configModel = new SystemConfigRepository();
    const configERC20Deposit = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET });
    const configERC20DepositValue = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET_MIN_AMOUNT });


    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        await getUserERCBalance(row, configERC20Deposit, configERC20DepositValue);
      }
    }
  } catch (err) {
    throw err;
  }
};

const getUserERCBalance = async (row, configERC20Deposit, configERC20DepositValue) => {
  await new Promise(async (resolve) => {
    try {
      const walletModel = new UserWalletRepository();
      const txModel = new UserTransactionsRepository();
      const configModel = new SystemConfigRepository();

      // START: Check for ERC20
      if (row?.erc20) {
        const ethWallet = JSON.parse(row.erc20);
        if (ethWallet !== undefined && typeof ethWallet == 'object') {
          const walletAddress = ethWallet.address;

          // Check amount user wallet and withdraw to cold wallet
          try {
            const userETHWalletBalance = await getBalanceEth(ethWallet.address_private_key, walletAddress);
            const userUSDTWalletBalance = await getBalanceUsdt(ethWallet.address_private_key, walletAddress);

            //console.log('ADDRESS-ERC: ', walletAddress, ' => ', userUSDTWalletBalance);

            // Send fee for withdraw usdt
            if (userUSDTWalletBalance >= wallet.ETH_ERC20_DEPOSIT_MIN_AMOUNT || userUSDTWalletBalance >= configERC20DepositValue?.value) {
              // Add to wallet balance (temp) => amount_trc20_wallet
              const currentAmountWallet = Number(row?.amount_erc20_wallet) || 0;
              const realBalance = Number(userUSDTWalletBalance) - currentAmountWallet;
              if (realBalance >= Number(wallet.ETH_ERC20_DEPOSIT_MIN_AMOUNT)) {
                await walletModel.updateByUserId(row.user_id, { $inc: { amount: realBalance } });
              }
              await walletModel.updateByUserId(row.user_id, { amount_erc20_wallet: Number(userUSDTWalletBalance) });

              let userTx;
              if (realBalance >= Number(wallet.ETH_ERC20_DEPOSIT_MIN_AMOUNT)) {
                // Create User transaction
                userTx = await createDepositTransaction(row, realBalance, config.ETH_ERC20_SYMBOL, walletAddress, null);
              } else {
                userTx = true;
              }
              if (userTx) {
                if (configERC20Deposit && Boolean(configERC20Deposit.value) && userUSDTWalletBalance >= configERC20DepositValue?.value) {
                  // Send fee to User address if we need to transfer USDT from User to COOL WALLET
                  if (Number(userETHWalletBalance) < 0.01) {
                    const hotETHWalletBalance = await getBalanceEth(wallet.HOT_WALLET_ETH_PRIVATE_KEY, wallet.HOT_WALLET_ETH_ADDRESS);
                    if (Number(hotETHWalletBalance) > 0.01) {
                      const tx = await sendEth(
                        wallet.HOT_WALLET_ETH_PRIVATE_KEY,
                        wallet.HOT_WALLET_ETH_ADDRESS,
                        walletAddress,
                        '0.01'
                      );

                      if (tx) {
                        await createSystemTransaction(row, 0.01, wallet.ETH_ERC20_SYMBOL, walletAddress, tx);
                      }
                    }
                  } else {
                    // Get config gas from DB - Admin setup
                    const configWithdrawGasPrice = await configModel.findOne({ key: config.SYSTEM_ERC20_GAS_KEY });
                    try {
                      const tx = await sendUsdt(
                        ethWallet.address_private_key,
                        walletAddress,
                        wallet.COOL_WALLET_ETH_ADDRESS,
                        String(userUSDTWalletBalance),
                        (configWithdrawGasPrice ? configWithdrawGasPrice.value : '90')
                      );
                      if (tx) {
                        await txModel.updateMany(
                          {
                            user_id: row.user_id,
                            symbol: config.ETH_ERC20_SYMBOL,
                            system_status: Constants.TRANSACTION_STATUS_PROCESSING,
                            type: Constants.TRANSACTION_TYPE_DEPOSIT,
                            address: walletAddress,
                            tx: null
                          },
                          {
                            tx: String(tx),
                            system_status: Constants.TRANSACTION_STATUS_PENDING
                          }
                        );
                      }
                    } catch (error) {
                      console.log('ERROR DEPOSIT ERC20', error);
                    }
                  }
                }
              }
            }
          } catch (werr) {
            throw new Error('ERC20: ' + werr);
          }
        }
      } else {
        /* const user = {
          id: row._id
        };
        createUSDTERC20(user);*/
      }
      // END: Check for ERC20

      await delay(1000);
      return resolve(true);
    } catch (err) {
      await delay(1000);
      return resolve(true);
    }
  });
};
