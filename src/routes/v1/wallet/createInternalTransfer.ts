import { CreateInternalTransferController } from '@src/controllers/wallet/WalletController';
import { Router } from 'express';

export default (route: Router) => route.post('/transfer/internal/create', CreateInternalTransferController);
