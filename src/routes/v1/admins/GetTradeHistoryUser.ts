import { GetTradeHistoryUserController } from '@src/controllers/admins/GetTradeHistoryUserController';
import { Router } from 'express';

export default (route: Router) => route.get('/histories-trade-user', GetTradeHistoryUserController);
