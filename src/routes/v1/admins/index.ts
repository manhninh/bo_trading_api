import {Router} from 'express';
import ActivateExchangeProtection from './ActivateExchangeProtection';
import CreateMFACode from './CreateMFACode';
import GetAdminInfor from './GetAdminInfor';
import SendCodeLogin from './SendCodeLogin';
import SendCodeVerify from './SendCodeVerify';
import VerifyOTPToken from './VerifyOTPToken';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    SendCodeLogin(this.router);
    CreateMFACode(this.router);
    GetAdminInfor(this.router);
    SendCodeVerify(this.router);
    VerifyOTPToken(this.router);
    ActivateExchangeProtection(this.router);
  }
}
