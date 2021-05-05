import {Router} from 'express';
import ActivateExchangeProtection from './ActivateExchangeProtection';
import CreateMFACode from './CreateMFACode';
import GetAdminInfor from './GetAdminInfor';
import SendCodeLogin from './SendCodeLogin';
import SendCodeVerify from './SendCodeVerify';
import VerifyOTPToken from './VerifyOTPToken';
import GetProtectHistory from './GetProtectHistory';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    SendCodeLogin(this.router);
    CreateMFACode(this.router);
    GetAdminInfor(this.router);
    SendCodeVerify(this.router);
    VerifyOTPToken(this.router);
    ActivateExchangeProtection(this.router);
    GetProtectHistory(this.router);
  }
}
