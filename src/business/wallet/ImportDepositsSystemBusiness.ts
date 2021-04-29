import config from '@src/config';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants } from 'bo-trading-common/lib/utils';
import { getETHTransaction } from '../user/CreateWalletBusiness';


export const importDepositsSystem = async (): Promise<any> => {
  try {
    const transaction = new UserTransactionsRepository();
    const walletModel = new UserWalletRepository();
    const rows = await transaction.getAllPendingTransactions();
    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const TronWeb = require('tronweb');
      const tronWeb = new TronWeb({
        fullHost: config.TRON_FULL_NODE,
        headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY }
      });

      const TRON_ERRORS = [
        'OUT_OF_ENERGY',
        'REVERT',
        'OUT_OF_TIME'
      ];

      rows.forEach(async row => {
        try {
          // START: Check status for each TX

          // FOR TRC20 - USDT
          if (row.symbol == config.TRON_TRC20_SYMBOL) {
            tronWeb.trx.getTransaction(row.tx).then((result) => {
              if (result && result.ret !== undefined && result.ret[0] !== undefined) {
                if (result.ret[0].contractRet == 'SUCCESS') {
                  // Them tien vao tai khoan
                  walletModel.updateByUserId(row.user_id, { $inc: { amount: row.amount } });
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_SUCCESS });
                } else if (TRON_ERRORS.includes(result.ret[0].contractRet)) {
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_CANCELLED, noted: result.ret[0].contractRet });
                }
              }
            });
          } else if (row.symbol == config.ETH_ERC20_SYMBOL) {
            const ethTx = await getETHTransaction(row.tx);
            if (ethTx?.hash) {
              // Them tien vao tai khoan
              walletModel.updateByUserId(row.user_id, { $inc: { amount: row.amount } });
              // Cap nhat TX
              transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_SUCCESS });
            }
          }

          // END: Check status for each TX
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
