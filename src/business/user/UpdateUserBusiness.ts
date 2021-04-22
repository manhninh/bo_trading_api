import UserRepository from "@src/repository/UserRepository";
import { UpdateUserValidator } from "@src/validator/users/UpdateUser";
import { validate } from 'class-validator';

/**
 * Verification user
 * @param id id của object
 * @param data FormData user
 */
export const updateUserBusiness = async (id: string, data: UpdateUserValidator): Promise<boolean> => {
  try {
    const validation = await validate(data);
    if (validation.length !== 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    console.log(data);
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      await userRes.updateById(user.id, data);
      return true;
    }
  } catch (err) {
    throw err;
  }
};
