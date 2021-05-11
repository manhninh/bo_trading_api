import { SystemConfigController } from '@src/controllers/admins/SystemConfigController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

export default (route: Router) => route.post('/config/system', isAuthenticated, SystemConfigController);
