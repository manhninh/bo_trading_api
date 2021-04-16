import { Router } from 'express';
import TransactionsHistory from './TransactionsHistory';

export default class WalletRoutes {
  public router: Router = Router();

  constructor() {
    TransactionsHistory(this.router);
  }
}
