import {CommissionTradeDetailController} from '@src/controllers/comissions/CommissionTradeDetailController';
import {Router} from 'express';

export default (route: Router) => route.get('/trade-detail', CommissionTradeDetailController);
