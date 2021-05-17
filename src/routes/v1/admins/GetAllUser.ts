import {GetAllUserController} from '@src/controllers/admins/GetAllUserController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-all-user', GetAllUserController);
