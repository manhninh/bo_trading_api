import config, { configSendEmail } from '@src/config';
import AdminRepository from '@src/repository/AdminRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { delay } from '@src/utils/helpers';
import { Constants, EmailConfig, logger } from 'bo-trading-common/lib/utils';
import handlebars from 'handlebars';
import { getETHTransaction } from '../user/CreateWalletBusiness';

export const importERC20DepositsSystem = async (): Promise<any> => {
  try {
    const transaction = new UserTransactionsRepository();
    const walletModel = new UserWalletRepository();
    const rows = await transaction.getAllPendingTransactions(Constants.TRANSACTION_TYPE_DEPOSIT);
    if (rows !== undefined && rows.length) {
      rows.forEach(async row => {
        try {
          // START: Check status for each TX

          // Get all email from admin
          const adminRepos = new AdminRepository();
          const admins = await adminRepos.findAll();
          const emailConfig = new EmailConfig(configSendEmail);

          // FOR ERC20 - USDT
          if (row.symbol == config.ETH_ERC20_SYMBOL && row?.tx) {
            const result = await getETHTransaction(row.tx);
            if (result) {
              if (result?.status) {
                // Cap nhat TX
                transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_SUCCESS });
                // Cap nhat value trong temp wallet
                walletModel.updateByUserId(row.user_id, { amount_erc20_wallet: 0 });

              } else {
                // Cap nhat TX
                transaction.updateById(row._id, { status: Constants.TRANSACTION_STATUS_CANCELLED });

                // Send email to admin
                admins.map(async (admin) => {
                  emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/transaction_error.html`, (html: string) => {
                    const template = handlebars.compile(html);
                    const replacements = {
                      'username': admin.email,
                      'link': config.TRON_EXPLORER + '#/transaction/' + row.tx
                    };
                    const htmlToSend = template(replacements);
                    emailConfig
                      .send(config.EMAIL_ROOT, admin.email, 'ERC20 - Transaction Error: Hot wallet not send enough ETH!', htmlToSend)
                      .catch((err) => logger.error(err.message));
                  });
                });
              }
            }
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
