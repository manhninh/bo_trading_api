import {Router} from 'express';
import buySponsor from './buySponsor';
import changePasswordUser from './changePasswordUser';
import createMfaQrCode from './createMfaQrCode';
import createUser from './createUser';
import disableMfaUser from './disableMfaUser';
import getUserInfor from './getUserInfor';
import updateUser from './updateUser';
import verifyOTPToken from './verifyOTPToken';
import verifyUser from './verifyUser';
import createRandomUser from './createRandomUser';
import createRandomOrderUser from './createRandomOrderUser';
import forgotPassword from './forgotPassword';
import detailUserOnAdmin from './detailUserOnAdmin';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    createUser(this.router);
    updateUser(this.router);
    verifyUser(this.router);
    getUserInfor(this.router);
    createMfaQrCode(this.router);
    verifyOTPToken(this.router);
    changePasswordUser(this.router);
    disableMfaUser(this.router);
    buySponsor(this.router);
    createRandomUser(this.router);
    createRandomOrderUser(this.router);
    forgotPassword(this.router);
    detailUserOnAdmin(this.router);
  }
}
