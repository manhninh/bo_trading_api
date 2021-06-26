import {CommissionTradeUserController} from '@src/controllers/admins/CommissionTradeUserController';
import {Router} from 'express';

export default (route: Router) => route.get('/commission-detail-user', CommissionTradeUserController);
