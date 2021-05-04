import {createMFACodeController} from '@src/controllers/admins/CreateMFACodeController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.post('/create-mfa', isAuthenticated, createMFACodeController);
