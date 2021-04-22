import {Router} from 'express';
import CreateOrder from './CreateOrder';
import GetCurrentOrder from './GetCurrentOrder';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    CreateOrder(this.router);
    GetCurrentOrder(this.router);
  }
}
