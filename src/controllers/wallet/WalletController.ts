import { CreateInternalTransferBusiness } from '@src/business/wallet/CreateInternalTransferBusiness';
import { CreateTransferBusiness } from '@src/business/wallet/CreateTransferBusiness';
import { CreateWithdrawBusiness } from '@src/business/wallet/CreateWithdrawBusiness';
import { CreateWithdrawERC20Business } from '@src/business/wallet/CreateWithdrawERC20Business';
import { getTransactionsHistory } from '@src/business/wallet/GetTransactionsHistory';
import config from '@src/config';
import { CreateInternalTransferValidator } from '@src/validator/wallet/CreateInternalTransfer';
import { CreateTransferValidator } from '@src/validator/wallet/CreateTransfer';
import { CreateWithdrawValidator } from '@src/validator/wallet/CreateWithdraw';
import { CreateWithdrawERC20Validator } from '@src/validator/wallet/CreateWithdrawERC20';
import { GetTransactionsHistoryValidator } from '@src/validator/wallet/GetTransactionsHistory';
import { NextFunction, Request, Response } from 'express';

export const GetTransactionsHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = Object.assign({} as object, req.query);
    const data = new GetTransactionsHistoryValidator();
    data.user_id = req.user["id"];
    data.username = req.user["username"];
    data.page = Number(params?.page) ?? 1;
    data.limit = Number(params?.limit) ?? 10;
    data.type = params?.type ? Number(params?.type) : 0;
    data.from = params?.from ? new Date(params.from as any) : new Date();
    data.to = params?.to ? new Date(params.to as any) : new Date();
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
    data.amount = Number(params.amount);
    data.username = params.username;
    data.response = params.response;
    const result = await CreateTransferBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};

export const CreateWithdrawController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    let data: any = {};
    if (params.symbol == config.ETH_ERC20_SYMBOL) {
      data = new CreateWithdrawERC20Validator();
    } else {
      data = new CreateWithdrawValidator();
    }
    data.user_id = req.user["id"];
    data.password = params.password;
    data.amount = Number(params.amount);
    data.address = params.address;
    data.tfa = params.tfa;
    data.symbol = params.symbol;
    data.response = params.response;

    let result: any = {};
    if (params.symbol == config.ETH_ERC20_SYMBOL) {
      result = await CreateWithdrawERC20Business(data);
    } else {
      result = await CreateWithdrawBusiness(data);
    }

    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};

export const CreateInternalTransferController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body;
    const data = new CreateInternalTransferValidator();
    data.user_id = req.user["id"];
    data.amount = Number(params.amount);
    data.to_wallet = params.to_wallet;
    data.response = params.response;
    const result = await CreateInternalTransferBusiness(data);
    res.status(200).send({ data: result });
  } catch (err) {
    next(err);
  }
};