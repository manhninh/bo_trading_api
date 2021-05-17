import config from '@src/config';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants } from 'bo-trading-common/lib/utils';


export const ScheduleVerifyTX = async (): Promise<any> => {
  try {
    const transaction = new UserTransactionsRepository();
    const walletModel = new UserWalletRepository();
    const rows = await transaction.getAllPendingTransactions(Constants.TRANSACTION_TYPE_WITHDRAW);
    if (rows !== undefined && rows.length) {
      // First contstruct a tronWeb object with a private key
      const TronWeb = require('tronweb');
      const tronWeb = new TronWeb({
        fullHost: config.TRON_FULL_NODE,
        headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY }
      });

      //
      const TRON_ERRORS = [
        'OUT_OF_ENERGY',
        'REVERT',
        'OUT_OF_TIME'
      ];

      //channelArray.includes('three')

      rows.forEach(async row => {
        try {
          // START: Check status for each TX

          // FOR TRC20 - USDT
          if (row.symbol == config.TRON_TRC20_SYMBOL) {
            tronWeb.trx.getTransaction(row.tx).then((result) => {
              if (result && result.ret !== undefined && result.ret[0] !== undefined) {
                if (result.ret[0].contractRet == 'SUCCESS') {
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_SUCCESS });
                } else if (TRON_ERRORS.includes(result.ret[0].contractRet)) {
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_CANCELLED, noted: result.ret[0].contractRet });
                }
              }
            });
          }

          // END: Check status for each TX
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
