import { detailUserOnAdminController } from '@src/controllers/users/DetailUserOnAdminController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

export default (route: Router) => route.get('/detail-user-on-admin', isAuthenticated, detailUserOnAdminController);
