import {CreateRandomUserController} from '@src/controllers/users/CreateRandomUserController';
import {Router} from 'express';

export default (route: Router) => route.post('/create-random-user', CreateRandomUserController);
