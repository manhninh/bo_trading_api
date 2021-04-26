import {CommissionWithdrawHistoryController} from '@src/controllers/comissions/CommissionWithdrawHistoryController';
import {Router} from 'express';

export default (route: Router) => route.get('/withdraw-histories', CommissionWithdrawHistoryController);
