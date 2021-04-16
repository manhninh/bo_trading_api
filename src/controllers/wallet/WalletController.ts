import { CreateTransferBusiness } from '@src/business/wallet/CreateTransferBusiness';
import { CreateWithdrawBusiness } from '@src/business/wallet/CreateWithdrawBusiness';
import { getTransactionsHistory } from '@src/business/wallet/GetTransactionsHistory';
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
    const data = {
      user_id: req.user["id"],
      password: params.password,
      amount: Number(params.amount),
      username: params.username,
      tfa: params.tfa
    };
    const result = await CreateTransferBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};

export const CreateWithdrawController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = {
      user_id: req.user["id"],
      password: params.password,
      amount: Number(params.amount),
      address: params.address,
      tfa: params.tfa,
      symbol: params.symbol
    };
    const result = await CreateWithdrawBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};