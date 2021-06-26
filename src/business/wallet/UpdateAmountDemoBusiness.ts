import UserWalletRepository from '@src/repository/UserWalletRepository';

export const UpdateAmountDemoBusiness = async (id: string): Promise<boolean> => {
  try {
    const userWalletRes = new UserWalletRepository();
    await userWalletRes.updateByUserId(id, {amount_demo: 10000});
    return true;
  } catch (err) {
    throw err;
  }
};
