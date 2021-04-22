import { Router } from 'express';
import getTradeHistory from "./getTradeHistory";
export default class TradeRouters {
  public router: Router = Router();

  constructor() {
    getTradeHistory(this.router);
  }
}
