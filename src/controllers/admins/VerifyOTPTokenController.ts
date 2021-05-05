import {VerifyOTPTokenBusiness} from '@src/business/admins/VerifyOTPTokenBusiness';
import {VerifyOTPTokenValidator} from '@src/validator/admins/VerifyOTPToken';
import {NextFunction, Request, Response} from 'express';

export const verifyOTPTokenController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user['id'];
    const params = req.body;
    const data = new VerifyOTPTokenValidator();
    data.userId = id;
    data.password = params.password;
    data.code = params.code;
    data.secret = params.secret;
    data.disabled = params.disabled;
    const result = await VerifyOTPTokenBusiness(data);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
