import {GetAllSponsorController} from '@src/controllers/admins/GetAllSponsorController';
import {Router} from 'express';

export default (route: Router) => route.get('/get-all-sponsor', GetAllSponsorController);
