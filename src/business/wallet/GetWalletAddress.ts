import UserWalletRepository from '@src/repository/UserWalletRepository';

export const getWalletAddressBusiness = async (id: string): Promise<any> => {
  try {
    const model = new UserWalletRepository();
    const row = await model.getUserWalletById(id);

    // Convert user wallet
    if (row) {
      if (row?.trc20) {
        const tronWallet = JSON.parse(row.trc20);
        if (typeof tronWallet == 'object')
          row.trc20 = tronWallet.address.base58;
      }
    }

    return row;
  } catch (err) {
    throw err;
  }
};
