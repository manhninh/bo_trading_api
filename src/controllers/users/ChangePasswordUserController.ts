import { changePasswordUserBusiness } from '@src/business/user/ChangePasswordUserBusiness';
import { ChangePasswordUserValidator } from '@src/validator/users/ChangePasswordUser';
import { NextFunction, Request, Response } from 'express';

export const changePasswordUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const params = req.body;
    const data = new ChangePasswordUserValidator();
    data.current_password = params.current_password;
    data.new_password = params.new_password;
    data.tfa = params.tfa;
    const result = await changePasswordUserBusiness(id, data);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
