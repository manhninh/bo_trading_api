import { forgotPasswordController } from '@src/controllers/users/forgotPasswordController';
import { Router } from 'express';

export default (route: Router) => route.post('/forgot-password', forgotPasswordController);
