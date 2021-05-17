import TradeHistoryRepository from '@src/repository/TradeHistoryRepository';
import {GetTradeHistoryValidator} from '@src/validator/trade/GetTradeHistory';
import {validate} from 'class-validator';

export const getTradeHistoryBusiness = async (id: string, data: GetTradeHistoryValidator): Promise<any> => {
  try {
    const validation = await validate(data);
    if (validation.length !== 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    const tradeRes = new TradeHistoryRepository();
    const result = await tradeRes.getTradeHistory(id, data);
    return result;
  } catch (err) {
    throw err;
  }
};
