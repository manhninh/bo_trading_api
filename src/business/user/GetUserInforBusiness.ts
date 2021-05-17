import UserRepository from '@src/repository/UserRepository';

export const getUserInforBusiness = async (id: string): Promise<any> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.getUserById(id);
    return user;
  } catch (err) {
    throw err;
  }
};
