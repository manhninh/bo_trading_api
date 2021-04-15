import { Router } from 'express';
import CreateOrder from './CreateOrder';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    CreateOrder(this.router);
  }
}
