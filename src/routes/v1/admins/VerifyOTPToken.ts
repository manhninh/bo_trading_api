import {verifyOTPTokenController} from '@src/controllers/admins/VerifyOTPTokenController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.post('/verify_otp', isAuthenticated, verifyOTPTokenController);
