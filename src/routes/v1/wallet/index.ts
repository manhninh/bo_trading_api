import { Router } from 'express';
import createInternalTransfer from './createInternalTransfer';
import createTransfer from './createTransfer';
import createWithdraw from './createWithdraw';
import getAddress from './getAddress';
import TransactionsHistory from './TransactionsHistory';
import updateAmountDemo from './updateAmountDemo';

export default class WalletRoutes {
  public router: Router = Router();

  constructor() {
    TransactionsHistory(this.router);
    createTransfer(this.router);
    createInternalTransfer(this.router);
    createWithdraw(this.router);
    getAddress(this.router);
    updateAmountDemo(this.router);
  }
}
