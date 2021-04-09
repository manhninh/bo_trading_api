import { Router } from 'express';
import createUser from './createUser';
import getUserInfor from "./getUserInfor";
import verifyUser from "./verifyUser";

export default class UserRouters {
  public router: Router = Router();

  constructor() {
    createUser(this.router);
    verifyUser(this.router);
    getUserInfor(this.router);
  }
}
