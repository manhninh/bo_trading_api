import { UpdateAmountDemoController } from '@src/controllers/wallet/UpdateAmountDemoController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

export default (route: Router) => route.post('/update-amount-demo', isAuthenticated, UpdateAmountDemoController);
