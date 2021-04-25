import {disableMfaUserBusinness} from '@src/business/user/DisableMfaUserBusinness';
import {NextFunction, Request, Response} from 'express';

export const disableMfaUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user['id'];
    const result = await disableMfaUserBusinness(id);
    res.status(200).send({data: result});
  } catch (err) {
    next(err);
  }
};
