import UserRepository from '@src/repository/UserRepository';

export const ResetTFAUserBusiness = async (userId: string): Promise<boolean> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.findById(userId);
    if (!user) throw new Error('Không tồn tại tài khoản!');
    const update2Fa = await userRes.updateById(user.id, {tfa: null}, {new: true});
    if (update2Fa) return true;
    throw new Error('Đặt lại 2FA thất bại!');
  } catch (err) {
    throw err;
  }
};
