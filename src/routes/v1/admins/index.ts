import { Router } from 'express';
import ActivateExchangeProtection from './ActivateExchangeProtection';
import ConfirmWithdraw from './ConfirmWithdraw';
import CreateMFACode from './CreateMFACode';
import GetAdminInfor from './GetAdminInfor';
import GetAllDeposit from "./GetAllDeposit";
import GetAllSponsor from "./GetAllSponsor";
import GetAllTranfers from "./GetAllTranfers";
import GetAllUser from './GetAllUser';
import GetAllWithdraw from "./GetAllWithdraw";
import GetProtectDetail from './GetProtectDetail';
import GetProtectHistory from './GetProtectHistory';
import RejectWithdraw from './RejectWithdraw';
import ReportTransactionDay from './ReportTransactionDay';
import ResetTFA from './ResetTFA';
import SaveProtectDetail from './SaveProtectDetail';
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
    GetProtectHistory(this.router);
    GetProtectDetail(this.router);
    SaveProtectDetail(this.router);
    ReportTransactionDay(this.router);
    GetAllUser(this.router);
    ResetTFA(this.router);
    GetAllDeposit(this.router);
    ConfirmWithdraw(this.router);
    RejectWithdraw(this.router);
    GetAllWithdraw(this.router);
    GetAllTranfers(this.router);
    GetAllSponsor(this.router);
  }
}
