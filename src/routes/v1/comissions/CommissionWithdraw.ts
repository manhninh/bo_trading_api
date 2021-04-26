import {CommissionWithdrawController} from '@src/controllers/comissions/CommissionWithdrawController';
import {Router} from 'express';

export default (route: Router) => route.post('/withdraw', CommissionWithdrawController);
