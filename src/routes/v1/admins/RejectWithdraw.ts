import { RejectWithdrawController } from '@src/controllers/wallet/WalletController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

export default (route: Router) => route.post('/withdraw/reject', isAuthenticated, RejectWithdrawController);
