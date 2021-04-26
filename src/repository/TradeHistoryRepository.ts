import {GetTradeHistoryValidator} from '@src/validator/trade/GetTradeHistory';
import {ITradeHistoryModel} from 'bo-trading-common/lib/models/tradeHistories';
import {TradeHistorySchema} from 'bo-trading-common/lib/schemas';
import moment from 'moment';
import {RepositoryBase} from './base';
export default class TradeHistoryRepository extends RepositoryBase<ITradeHistoryModel> {
  constructor() {
    super(TradeHistorySchema);
  }

  public async getTradeHistory(id: string, data: GetTradeHistoryValidator): Promise<any> {
    try {
      const options = {
        page: data.page ?? 1,
        limit: data.limit,
        sort: {createdAt: -1},
      };

      const from = moment(data.from).startOf('day').toDate();
      const to = moment(data.to).endOf('day').toDate();

      const result = await TradeHistorySchema.paginate(
        {
          createdAt: {
            $gte: from,
            $lte: to, // endOf('day') To prevent actual results from the next day being included.
          },
          user_id: id,
        },
        options,
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}
