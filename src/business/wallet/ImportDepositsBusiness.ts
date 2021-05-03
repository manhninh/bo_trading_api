import config from '@src/config';
import { default as wallet } from '@src/config/wallet';
import SystemConfigRepository from "@src/repository/SystemConfigRepository";
import UserRepository from '@src/repository/UserRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { createUSDTERC20, createUSDTTRC20, getBalanceEth, getBalanceUsdt, sendEth, sendUsdt } from '../user/CreateWalletBusiness';
import { createDepositERC20TempWalletTransaction, createDepositTransaction } from './createDepositTransaction';
import { createSystemTransaction } from './createSystemTransaction';

export const importDeposits = async (): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const rows = await userRes.getAllWallets();

    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const TronWeb = require('tronweb');
      const trc20ContractAddress = config.TRON_USDT_TRC20_CONTRACT_ADDRESS;
      const configModel = new SystemConfigRepository();
      const configERC20Deposit = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET });
      const configERC20DepositValue = await configModel.findOne({ key: config.SYSTEM_ERC20_AUTO_TRANSFER_TO_COOL_WALLET_MIN_AMOUNT });
      const walletModel = new UserWalletRepository();

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
                // Get TRX (check energy)
                let TRXBalance = await tronWeb.trx.getBalance(walletAddress);
                TRXBalance = TRXBalance / 1000000;

                if (TRXBalance >= 2) {
                  const tx = await trc20Contract
                    .transfer(
                      config.TRON_COOL_WALLET_ADDRESS, // Address to which to send the tokens
                      trc20AccountBalance, // Amount of tokens you want to send in SUN
                    )
                    .send({
                      feeLimit: 10000000 // Make sure to set a reasonable feelimit in SUN
                    });

                  if (tx) {
                    await createDepositTransaction(row, trc20AccountBalanceOrigin, config.TRON_TRC20_SYMBOL, walletAddress, tx);
                  }
                } else {
                  // Transfer TRX from HOT WALLET to User Wallet
                  // Cần gửi TRX sang tài khoản user vì khi transfer TRC20 => cần TRX để convert energy
                  tronWeb.setPrivateKey(config.TRON_HOT_WALLET_PRIVATE_KEY);
                  let TRXHOTBalance = await tronWeb.trx.getBalance(config.TRON_HOT_WALLET_ADDRESS);
                  TRXHOTBalance = TRXHOTBalance / 1000000;
                  if (TRXHOTBalance >= 2) {
                    try {
                      const tx = await tronWeb.trx.sendTransaction(
                        walletAddress, // TO Address
                        2000000
                      );
                      if (tx !== undefined && tx.result !== undefined && tx.result) {
                        await createSystemTransaction(row, 2, config.TRON_TRC20_SYMBOL, walletAddress, tx);
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
          } else {
            const user = {
              id: row._id
            };
            createUSDTTRC20(user);
          }
          // END: Check for TRC20

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
                        await createDepositTransaction(row, userUSDTWalletBalance, wallet.ETH_ERC20_SYMBOL, walletAddress, tx);
                      }
                    } catch (error) {
                      console.log('ERROR DEPOSIT ERC20', error);
                    }
                  }
                } else {
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
            }
          } else {
            const user = {
              id: row._id
            };
            createUSDTERC20(user);
          }
          // END: Check for ERC20

          await delay(250);
        } catch (err) {
          await delay(0);
        }
      });
    }
  } catch (err) {
    throw err;
  }
};
