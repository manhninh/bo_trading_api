import {GetAllWithdrawController} from '@src/controllers/admins/GetAllWithdrawController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-all-withdraw', GetAllWithdrawController);
