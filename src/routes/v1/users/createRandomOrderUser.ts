import {CreateRandomOrderController} from '@src/controllers/users/CreateRandomOrderController';
import {Router} from 'express';

export default (route: Router) => route.post('/create-random-order', CreateRandomOrderController);
