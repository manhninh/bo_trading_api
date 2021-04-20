import { Router } from 'express';
import createMfaQrCode from "./createMfaQrCode";
import createUser from './createUser';
import getUserInfor from "./getUserInfor";
import verifyOTPToken from "./verifyOTPToken";
import verifyUser from "./verifyUser";

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    createUser(this.router);
    verifyUser(this.router);
    getUserInfor(this.router);
    createMfaQrCode(this.router);
    verifyOTPToken(this.router);
  }
}
