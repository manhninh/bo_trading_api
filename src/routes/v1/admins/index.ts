import {Router} from 'express';
import sendCode from './sendCode';

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    sendCode(this.router);
  }
}
