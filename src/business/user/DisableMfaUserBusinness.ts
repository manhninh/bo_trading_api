import UserRepository from "@src/repository/UserRepository";

/**
 * Disable Two-factor Authentication
 * @param id id của object
 */
export const disableMfaUserBusinness = async (id: string): Promise<boolean> => {
  try {
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      await userRes.updateById(user.id, { tfa: undefined });
      return true;
    }
  } catch (err) {
    throw err;
  }
};
