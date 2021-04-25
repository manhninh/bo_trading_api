import {Router} from 'express';
import GetCommissions from './GetCommissions';

export default class CommissionRouters {
  public router: Router = Router();

  constructor() {
    GetCommissions(this.router);
  }
}
