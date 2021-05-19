import config, { configSendEmail } from '@src/config';
import AdminRepository from '@src/repository/AdminRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants, EmailConfig, logger } from 'bo-trading-common/lib/utils';

export const importTRC20DepositsSystem = async (): Promise<any> => {
  try {
    const transaction = new UserTransactionsRepository();
    const walletModel = new UserWalletRepository();
    const rows = await transaction.getAllPendingTransactions(Constants.TRANSACTION_TYPE_DEPOSIT);
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

          // Get all email from admin
          const adminRepos = new AdminRepository();
          const admins = await adminRepos.findAll();
          const emailConfig = new EmailConfig(configSendEmail);

          // FOR TRC20 - USDT
          if (row.symbol == config.TRON_TRC20_SYMBOL && row?.tx) {
            tronWeb.trx.getTransaction(row.tx).then((result) => {
              if (result && result.ret !== undefined && result.ret[0] !== undefined) {
                if (result.ret[0].contractRet == 'SUCCESS') {
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_SUCCESS });

                  // Cap nhat value trong temp wallet
                  walletModel.updateByUserId(row.user_id, { amount_wallet: 0 });

                } else if (TRON_ERRORS.includes(result.ret[0].contractRet)) {
                  // Cap nhat TX
                  transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_CANCELLED, noted: result.ret[0].contractRet });

                  // Send email to admin
                  admins.map(async (admin) => {
                    emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/transaction_error.html`, (html: string) => {
                      const template = Handlebars.compile(html);
                      const replacements = {
                        'username': admin.email,
                        'link': config.TRON_EXPLORER + '#/transaction/' + row.tx
                      };
                      const htmlToSend = template(replacements);
                      emailConfig
                        .send(config.EMAIL_ROOT, admin.email, 'TRC20 - Transaction Error: Hot wallet not send enough TRX!', htmlToSend)
                        .catch((err) => logger.error(err.message));
                    });
                  });
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
