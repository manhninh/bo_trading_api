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

      if (row?.erc20) {
        const ETHWallet = JSON.parse(row.erc20);
        if (typeof ETHWallet == 'object')
          row.erc20 = ETHWallet.address;
      }
    }

    return row;
  } catch (err) {
    throw err;
  }
};
