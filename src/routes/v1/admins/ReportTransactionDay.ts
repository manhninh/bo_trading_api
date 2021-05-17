import {ReportTransactionDayController} from '@src/controllers/admins/ReportTransactionDayController';
import {isAuthenticated} from '@src/middleware/auth/Oauth2';
import {Router} from 'express';

export default (route: Router) => route.get('/report-transaction-day', isAuthenticated, ReportTransactionDayController);
