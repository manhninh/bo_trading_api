import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';
import OrderRouters from "./orders";
import UserRouters from "./users";

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use('/users', new UserRouters().router);
    this.routers.use('/orders', isAuthenticated, new OrderRouters().router);
  }
}

export default new MainRoutes().routers;
