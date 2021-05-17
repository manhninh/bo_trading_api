import {CommissionMemberListController} from '@src/controllers/comissions/CommissionMemberListController';
import {Router} from 'express';

export default (route: Router) => route.get('/member-list', CommissionMemberListController);
