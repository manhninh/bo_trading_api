import { Router } from 'express';
import createAccount from './createAccount';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    createAccount(this.router);
  }
}
