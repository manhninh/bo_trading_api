import TradeHistoryRepository from '@src/repository/TradeHistoryRepository';
import moment from 'moment';

export const ReportTransactionDayBusiness = async (date: Date): Promise<any[]> => {
  try {
    const tradeHistoryRepositoryRes = new TradeHistoryRepository();
    const from = moment(date).startOf('day').valueOf().toString();
    const to = moment(date).endOf('day').valueOf().toString();
    const logs = await tradeHistoryRepositoryRes.reportTransactionDay(from, to);
    return logs;
  } catch (err) {
    throw err;
  }
};
