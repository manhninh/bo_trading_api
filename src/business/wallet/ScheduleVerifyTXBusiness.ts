import config from '@src/config';
import SystemConfigRepository from '@src/repository/SystemConfigRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import { delay } from '@src/utils/helpers';
import { Constants } from 'bo-trading-common/lib/utils';
import { getETHTransaction } from '../user/CreateWalletBusiness';
import { createTRC20transfer } from './CreateWithdrawBusiness';
import { createERC20transfer } from './CreateWithdrawERC20Business';


export const ScheduleVerifyTX = async (): Promise<any> => {
  try {
    const transaction = new UserTransactionsRepository();
    const configModel = new SystemConfigRepository();
    const rows = await transaction.getAllPendingTransactions(Constants.TRANSACTION_TYPE_WITHDRAW);
    if (rows !== undefined && rows.length) {
      //channelArray.includes('three')
      const enableWithdraw = await configModel.findOne({ key: config.SYSTEM_ENABLE_AUTO_WITHDRAW_KEY });
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        console.log('TX: ', row.tx);
        await verifyTX(row, transaction, enableWithdraw);
      }
    }
  } catch (err) {
    throw err;
  }
};

const verifyTX = async (row, transaction: UserTransactionsRepository, enableWithdraw) => {
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

  await new Promise(async (resolve) => {
    try {
      // START: Check system_status for each TX

      if (row?.tx) {
        // FOR TRC20 - USDT
        if (row.symbol == config.TRON_TRC20_SYMBOL) {
          tronWeb.trx.getTransaction(row.tx).then((result) => {
            if (result && result.ret !== undefined && result.ret[0] !== undefined) {
              if (result.ret[0].contractRet == 'SUCCESS') {
                // Cap nhat TX
                transaction.updateById(row._id, { system_status: Constants.TRANSACTION_STATUS_SUCCESS, status: Constants.TRANSACTION_STATUS_SUCCESS });
              } else if (TRON_ERRORS.includes(result.ret[0].contractRet)) {
                // Cap nhat TX
                transaction.updateById(row._id, { system_status: Constants.TRANSACTION_STATUS_CANCELLED, noted: result.ret[0].contractRet });
              }
            }
          });
        }

        // FOR ERC20 - USDT
        else if (row.symbol == config.ETH_ERC20_SYMBOL) {
          const result = await getETHTransaction(row.tx);
          if (result?.status) {
            // Cap nhat TX
            await transaction.updateById(row._id, { system_status: Constants.TRANSACTION_STATUS_SUCCESS, status: Constants.TRANSACTION_STATUS_SUCCESS });
          }
        }
      } else {
        if (enableWithdraw && Boolean(enableWithdraw.value)) {
          let result = false;
          const txAmount = row.amount;
          row.amount += row.fee;

          // FOR TRC20 - USDT
          if (row.symbol == config.TRON_TRC20_SYMBOL) {
            result = await createTRC20transfer(row, row, txAmount);
          }
          // FOR ERC20 - USDT
          else if (row.symbol == config.ETH_ERC20_SYMBOL) {
            result = await createERC20transfer(row, row, txAmount);
          }

          if (result) {
            // Update status for transaction
            await transaction.updateById(row._id, {
              'system_status': Constants.TRANSACTION_STATUS_PROCESSING
            });
          }
        }
      }

      // END: Check system_status for each TX
      await delay(1000);
      return resolve(true);
    } catch (err) {
      await delay(1000);
      return resolve(true);
    }
  });
};