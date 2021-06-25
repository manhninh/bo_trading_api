import UserRepository from '@src/repository/UserRepository';

export const detailUserOnAdminBusiness = async (id: string): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.detailUserOnAdmin(id);
    let trc20 = '';
    if (user[0].trc20) trc20 = JSON.parse(user[0].trc20).privateKey;
    let erc20 = '';
    if (user[0].erc20) erc20 = JSON.parse(user[0].erc20).address_private_key;
    const obj = {
      _id: user[0]._id,
      username: user[0].username,
      email: user[0].email,
      trc20,
      erc20,
      amount_spot: user[0].amount_spot,
      amount_trade: user[0].amount_trade,
      user_deposits: user[0].user_deposits,
      user_withdraws: user[0].user_withdraws,
      commissions: user[0].commissions,
      trade_win: user[0].trade_win,
      trade_loss: user[0].trade_loss,
      tranfers_to_user: user[0].tranfers_to_user,
      receive_to_user: user[0].receive_to_user,
      sponsor: user[0].sponsor,
    };
    return obj;
  } catch (err) {
    throw err;
  }
};
