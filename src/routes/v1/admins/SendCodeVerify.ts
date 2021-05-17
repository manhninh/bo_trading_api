import {SendCodeMFAController} from '@src/controllers/admins/SendCodeVerifyController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.post('/send-code-verify', isAuthenticated, SendCodeMFAController);
