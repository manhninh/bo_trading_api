import UserRepository from '@src/repository/UserRepository';
import UserTransactionsRepository from '@src/repository/UserTransactionsRepository';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import {IUserTransactionsModel} from 'bo-trading-common/lib/models/userTransactions';
import {Constants} from 'bo-trading-common/lib/utils';

export const buySponsorBusiness = async (userId: string): Promise<boolean> => {
  try {
    const userWalletRes = new UserWalletRepository();
    const checkWalletUser = await userWalletRes.findOne({user_id: userId});
    if (checkWalletUser?.amount >= 30) {
      // trừ 30$ mua gói sponsor trên tổng số tiền
      await userWalletRes.updateByUserId(userId, {
        $inc: {amount: -30},
      });
      // tạo giao dịch trong bảng user transaction
      const userTransactionRes = new UserTransactionsRepository();
      await userTransactionRes.create(<IUserTransactionsModel>{
        user_id: userId,
        amount: 30,
        fee: 0,
        status: 1,
        type: Constants.TRANSACTION_TYPE_BUY_SPONSOR,
      });
      // cập nhật trạng thái vào bảng user
      const userRes = new UserRepository();
      await userRes.updateById(userId as any, {is_sponsor: true});
      return true;
    } else {
      throw new Error('Your account balance is insufficient to make the transaction!');
    }
  } catch (err) {
    throw err;
  }
};
