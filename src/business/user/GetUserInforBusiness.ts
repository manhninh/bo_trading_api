import UserRepository from '@src/repository/UserRepository';

export const getUserInforBusiness = async (id: string): Promise<Number> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.getUserById(id);

    // Convert user wallet
    if (user) {
      if (user[0].trc20 !== undefined && user[0].trc20) {
        const tronWallet = JSON.parse(user[0].trc20);
        if (tronWallet !== undefined && typeof tronWallet == 'object')
          user[0].trc20 = tronWallet.address.base58;
      }

      if (user[0].tfa !== undefined && user[0].tfa) {
        user[0].isEnabledTFA = true;
        delete user[0].tfa;
      } else {
        user[0].isEnabledTFA = false;
      }
    }

    return user;
  } catch (err) {
    throw err;
  }
};
