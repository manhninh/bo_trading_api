import {GetAllTranferController} from '@src/controllers/admins/GetAllTranferController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-all-tranfers', GetAllTranferController);
