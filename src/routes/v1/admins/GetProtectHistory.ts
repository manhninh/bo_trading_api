import {GetProtectHistoryController} from '@src/controllers/admins/GetProtectHistoryController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.get('/get-protect-logs', isAuthenticated, GetProtectHistoryController);
