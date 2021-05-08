import {Router} from 'express';
import ActivateExchangeProtection from './ActivateExchangeProtection';
import CreateMFACode from './CreateMFACode';
import GetAdminInfor from './GetAdminInfor';
import SendCodeLogin from './SendCodeLogin';
import SendCodeVerify from './SendCodeVerify';
import VerifyOTPToken from './VerifyOTPToken';
import GetProtectHistory from './GetProtectHistory';
import GetProtectDetail from './GetProtectDetail';
import SaveProtectDetail from './SaveProtectDetail';
import ReportTransactionDay from './ReportTransactionDay';
import GetAllUser from './GetAllUser';
import ResetTFA from './ResetTFA';
import GetAllDeposit from "./GetAllDeposit";

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
    GetProtectDetail(this.router);
    SaveProtectDetail(this.router);
    ReportTransactionDay(this.router);
    GetAllUser(this.router);
    ResetTFA(this.router);
    GetAllDeposit(this.router);
  }
}
