import {ActivateExchangeProtectionController} from '@src/controllers/admins/ActivateExchangeProtectionController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) =>
  route.post('/activate-protection', isAuthenticated, ActivateExchangeProtectionController);
