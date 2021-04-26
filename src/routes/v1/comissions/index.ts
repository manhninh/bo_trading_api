import {Router} from 'express';
import CommissionMemberList from './CommissionMemberList';
import CommissionTradeDetail from './CommissionTradeDetail';
import GetCommissions from './GetCommissions';
import CommissionWithdraw from './CommissionWithdraw';

export default class CommissionRouters {
  public router: Router = Router();

  constructor() {
    GetCommissions(this.router);
    CommissionTradeDetail(this.router);
    CommissionMemberList(this.router);
    CommissionWithdraw(this.router);
  }
}
