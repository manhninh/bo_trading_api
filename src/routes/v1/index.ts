import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';
import ComissionRoutes from './comissions';
import OrderRouters from './orders';
import TradeRoutes from './trade';
import UserRouters from './users';
import WalletRoutes from './wallet';

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use('/users', new UserRouters().router);
    this.routers.use('/orders', isAuthenticated, new OrderRouters().router);
    this.routers.use('/wallet', isAuthenticated, new WalletRoutes().router);
    this.routers.use('/trade', isAuthenticated, new TradeRoutes().router);
    this.routers.use('/comissions', isAuthenticated, new ComissionRoutes().router);
  }
}

export default new MainRoutes().routers;
