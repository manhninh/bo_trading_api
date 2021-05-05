import {getAdminInforController} from '@src/controllers/admins/GetAdminInforController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.get('/', isAuthenticated, getAdminInforController);
