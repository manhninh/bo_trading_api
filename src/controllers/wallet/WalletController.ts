import { CreateTransferBusiness } from '@src/business/wallet/CreateTransferBusiness';
import { CreateWithdrawBusiness } from '@src/business/wallet/CreateWithdrawBusiness';
import { getTransactionsHistory } from '@src/business/wallet/GetTransactionsHistory';
import { CreateTransferValidator } from '@src/validator/wallet/CreateTransfer';
import { CreateWithdrawValidator } from '@src/validator/wallet/CreateWithdraw';
import { NextFunction, Request, Response } from 'express';

export const GetTransactionsHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = {
      user_id: req.user["id"],
      page: params.page,
      limit: params.limit,
      type: params.type
    };
    const result = await getTransactionsHistory(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};

export const CreateTransferController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = new CreateTransferValidator();
    data.user_id = req.user["id"];
    data.password = params.password;
    data.amount = Number(params.amount);
    data.username = params.username;
    data.tfa = params.tfa;
    const result = await CreateTransferBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};

export const CreateWithdrawController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = new CreateWithdrawValidator();
    data.user_id = req.user["id"];
    data.password = params.password;
    data.amount = Number(params.amount);
    data.address = params.address;
    data.tfa = params.tfa;
    data.symbol = params.symbol;
    const result = await CreateWithdrawBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};