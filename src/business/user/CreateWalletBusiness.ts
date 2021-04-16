import config from '@src/config';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { IUserWalletModel } from 'bo-trading-common/lib/models/userWallets';

export const createUSDTTRC20 = async (user: any): Promise<any> => {
  try {
    const TronWeb = require('TronWeb');
    const privateKey = config.CRYPTO_PRIVATE_KEY;
    const tronWeb = new TronWeb({
      fullHost: config.TRON_FULL_NODE,
      headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY },
      privateKey: privateKey
    });

    (async () => {
      const trc20Result = await tronWeb.createAccount();;
      const userWalletRes = new UserWalletRepository();
      userWalletRes.create(<IUserWalletModel>{
        user_id: user.id,
        trc20: JSON.stringify(trc20Result)
      });
    })();
  } catch (err) {
    throw err;
  }
};
