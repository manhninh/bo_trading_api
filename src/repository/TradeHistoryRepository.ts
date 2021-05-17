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

  public async reportTransactionDay(fromDate: string, toDate: string): Promise<any[]> {
    try {
      const result = await TradeHistorySchema.aggregate([
        {
          $match: {
            order_uuid: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        },
        {
          $group: {
            _id: {
              order_uuid: '$order_uuid',
              open_result: '$open_result',
              close_result: '$close_result',
              result_win: {
                $cond: [
                  {
                    $gte: ['$open_result', '$close_result'],
                  },
                  true, //sell
                  false, //buy
                ],
              },
            },
            buy_amount_order: {
              $sum: '$buy_amount_order',
            },
            sell_amount_order: {
              $sum: '$sell_amount_order',
            },
            amount_result: {
              $sum: '$amount_result',
            },
          },
        },
        {
          $project: {
            _id: 0,
            time: '$_id.order_uuid',
            open_result: '$_id.open_result',
            close_result: '$_id.close_result',
            buy_amount_order: 1,
            sell_amount_order: 1,
            amount_result: {
              $cond: {
                if: {
                  $eq: ['$_id.result_win', true],
                },
                then: {
                  $subtract: ['$sell_amount_order', '$amount_result'],
                },
                else: {
                  $subtract: ['$buy_amount_order', '$amount_result'],
                },
              },
            },
          },
        },
        {
          $sort: {
            time: -1,
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
