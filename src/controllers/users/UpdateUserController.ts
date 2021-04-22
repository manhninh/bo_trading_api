import { updateUserBusiness } from '@src/business/user/UpdateUserBusiness';
import { UpdateUserValidator } from '@src/validator/users/UpdateUser';
import { NextFunction, Request, Response } from 'express';

interface MulterRequest extends Request {
  file: any;
}

export const updateUserController = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user["id"];
    const params = req.body;
    const data = new UpdateUserValidator();
    data.email = params.email;
    data.full_name = params.full_name;
    data.username = params.username;
    data.phone = params.phone;
    if (req?.file) data.avatar = req.file;
    const result = await updateUserBusiness(id, data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
