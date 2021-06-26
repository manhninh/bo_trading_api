import {GetTranferUserOnAdminController} from '@src/controllers/admins/GetTranferUserOnAdminController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-tranfer-user', GetTranferUserOnAdminController);
