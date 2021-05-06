import {SaveProtectDetailController} from '@src/controllers/admins/SaveProtectDetailController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.post('/save_protect', isAuthenticated, SaveProtectDetailController);
