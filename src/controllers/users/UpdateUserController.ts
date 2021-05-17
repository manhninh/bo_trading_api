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
    if ("full_name" in params) data.full_name = params.full_name;
    if ("phone" in params) data.phone = params.phone;
    if (req?.file) data.avatar = req.file;
    const result = await updateUserBusiness(id, data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};
