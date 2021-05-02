import {createRandomUserBusiness} from '@src/business/user/CreateRandomUserBusiness';
import {NextFunction, Request, Response} from 'express';

export const CreateRandomUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const result = await createRandomUserBusiness();
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
