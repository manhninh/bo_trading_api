import { Router } from 'express';
import createTransfer from './createTransfer';
import createWithdraw from './createWithdraw';
import getAddress from './getAddress';
import TransactionsHistory from './TransactionsHistory';

export default class WalletRoutes {
  public router: Router = Router();

  constructor() {
    TransactionsHistory(this.router);
    createTransfer(this.router);
    createWithdraw(this.router);
    getAddress(this.router);
  }
}
