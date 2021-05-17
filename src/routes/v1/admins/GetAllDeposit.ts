import {GetAllDepositController} from '@src/controllers/admins/GetAllDepositController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-all-deposit', GetAllDepositController);
