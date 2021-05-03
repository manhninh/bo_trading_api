import { SendCodeController } from '@src/controllers/admins/SendCodeController';
import { Router } from 'express';

export default (route: Router) => route.post('/send-code', SendCodeController);
