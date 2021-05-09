import config from '@src/config';
import { default as wallet } from '@src/config/wallet';
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from '@src/repository/UserRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { createUSDTERC20, getBalanceEth, getBalanceUsdt, sendEth, sendUsdt } from '../user/CreateWalletBusiness';
import { createDepositERC20TempWalletTransaction } from './createDepositTransaction';
import { createSystemTransaction } from './createSystemTransaction';

export const importERC20Deposits = async (): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const rows = await userRes.getAllWallets();

    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const configModel = new SystemConfigRepository();
      const configERC20Deposit = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET });
      const configERC20DepositValue = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET_MIN_AMOUNT });
      const walletModel = new UserWalletRepository();

      rows.forEach(async row => {
        try {
          // START: Check for ERC20
          if (row?.erc20) {
            const ethWallet = JSON.parse(row.erc20);
            if (ethWallet !== undefined && typeof ethWallet == 'object') {
              const walletAddress = ethWallet.address;

              // Check amount user wallet and withdraw to cold wallet
              const userETHWalletBalance = await getBalanceEth(ethWallet.address_private_key, walletAddress);
              /*if (Number(userETHWalletBalance) > 0.01) {
                const txHash = await sendEth(
                  ethWallet.address_private_key,
                  walletAddress,
                  walletConstant.COOL_WALLET_ETH_ADDRESS,
                  (Number(userETHWalletBalance) - 0.01) as Number
                );
              }*/

              const userUSDTWalletBalance = await getBalanceUsdt(ethWallet.address_private_key, walletAddress);
              // Send fee for withdraw usdt
              if (userUSDTWalletBalance >= wallet.ETH_ERC20_DEPOSIT_MIN_AMOUNT) {
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
                    const configModel = new SystemConfigRepository();
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
                        await createSystemTransaction(row, userUSDTWalletBalance, wallet.ETH_ERC20_SYMBOL, walletAddress, tx);
                      }
                    } catch (error) {
                      console.log('ERROR DEPOSIT ERC20', error);
                    }
                  }
                }

                // Add to wallet balance (temp) => amount_wallet
                const currentAmountWallet = Number(row?.amount_wallet) || 0;
                const realBalance = Number(userUSDTWalletBalance) - currentAmountWallet;
                if (realBalance >= Number(wallet.ETH_ERC20_DEPOSIT_MIN_AMOUNT)) {
                  walletModel.updateByUserId(row.user_id, { $inc: { amount: realBalance } });

                  await createDepositERC20TempWalletTransaction(row, realBalance, wallet.ETH_ERC20_SYMBOL, walletAddress, null);
                }
                walletModel.updateByUserId(row.user_id, { amount_wallet: Number(userUSDTWalletBalance) });
              }
            }
          } else {
            const user = {
              id: row._id
            };
            createUSDTERC20(user);
          }
          // END: Check for ERC20

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
