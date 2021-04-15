import config from '@src/config';
import UserRepository from '@src/repository/UserRepository';
import { delay } from '@src/utils/helpers';
import Web3 from 'web3';
import { createDepositTransaction } from './createDepositTransaction';
import { createSystemTransaction } from './createSystemTransaction';


export const importDeposits = async (): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const rows = await userRes.getAllWallets();

    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const TronWeb = require('TronWeb');
      const trc20ContractAddress = config.TRON_USDT_TRC20_CONTRACT_ADDRESS;

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
              const web3 = new Web3();
              // Get TRX (check energy)
              const TRXBalance = await tronWeb.trx.getBalance(walletAddress);
              if (TRXBalance >= 2) {
                // Connect with Contract
                const trc20Contract = await tronWeb.contract().at(trc20ContractAddress);
                const trc20Decimals = await trc20Contract.decimals().call();
                const trc20AccountBalance = await trc20Contract.balanceOf(walletAddress).call();
                const decimals = (Math.pow(10, trc20Decimals.toNumber()));
                const trc20AccountBalanceOrigin = Number(trc20AccountBalance.toString()) / decimals;

                // Transfer to COOL WALLET (TRON-USDT-TRC20)
                if (trc20AccountBalanceOrigin >= Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT)) {
                  const tx = await trc20Contract
                    .transfer(
                      config.TRON_COOL_WALLET_ADDRESS, // Address to which to send the tokens
                      //web3.utils.numberToHex('100000000000000000')
                      trc20AccountBalance, // Amount of tokens you want to send in SUN
                    )
                    .send({
                      feeLimit: 1000000 // Make sure to set a reasonable feelimit in SUN
                    });

                  if (tx) {
                    await createDepositTransaction(row, (trc20AccountBalanceOrigin - Number(config.TRON_TRC20_TRANSACTION_FEE)), config.TRON_TRC20_SYMBOL, walletAddress, tx);
                  }
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
          // END: Check for TRC20
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
