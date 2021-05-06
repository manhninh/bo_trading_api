import {GetProtectDetailController} from '@src/controllers/admins/GetProtectDetailController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.get('/get-protect-details', isAuthenticated, GetProtectDetailController);
