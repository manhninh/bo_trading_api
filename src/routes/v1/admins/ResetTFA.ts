import {ResetTFAUserController} from '@src/controllers/admins/ResetTFAUserController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.post('/reset-2fa-user', isAuthenticated, ResetTFAUserController);
