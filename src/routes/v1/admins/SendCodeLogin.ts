import {SendCodeLoginController} from '@src/controllers/admins/SendCodeLoginController';
import {Router} from 'express';

export default (route: Router) => route.post('/send-code-login', SendCodeLoginController);
