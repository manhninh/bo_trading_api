import {verifyTOTP} from '@src/middleware/auth/otp';
import {decrypt} from '@src/utils/helpers';
import {IUserModel} from 'bo-trading-common/lib/models/users';
import {UserSchema, UserWalletSchema} from 'bo-trading-common/lib/schemas';
import moment from 'moment';
import mongoose, {ObjectId, UpdateQuery, UpdateWriteOpResult} from 'mongoose';
import {RepositoryBase} from './base';
export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema);
  }

  public async checkUserOrEmail(userOrEmail: string): Promise<IUserModel> {
    try {
      const result = await UserSchema.findOne({
        $or: [{username: userOrEmail}, {email: userOrEmail}],
        type_user: 0,
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async updateById(
    id: ObjectId,
    update: UpdateQuery<IUserModel>,
    options?: mongoose.QueryOptions,
  ): Promise<IUserModel> {
    try {
      const result = await UserSchema.findByIdAndUpdate(id, update, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async renderRefCodeUsers(id: ObjectId): Promise<void> {
    try {
      const faker = require('faker');
      const ref_code = faker.vehicle.vrm();
      await UserSchema.findByIdAndUpdate(id, {ref_code}, {new: true, upsert: true});
    } catch (err) {
      throw err;
    }
  }

  public async activeUser(id: ObjectId): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserSchema.updateOne({_id: id}, {status: 1});
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getUserById(id: string): Promise<any> {
    try {
      const result = await UserSchema.aggregate([
        {
          $match: {
            _id: this.toObjectId(id),
            status: 1,
          },
        },
        {
          $lookup: {
            from: 'user_wallets',
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_wallets',
          },
        },
        {
          $unwind: '$user_wallets',
        },
        {
          $project: {
            _id: '$_id',
            username: '$username',
            email: '$email',
            avatar: '$avatar',
            ref_code: '$ref_code',
            isEnabledTFA: {
              $cond: [{$ifNull: ['$tfa', false]}, true, false],
            },
            is_sponsor: '$is_sponsor',
            is_expert: '$is_expert',
            amount: '$user_wallets.amount',
            amount_trade: '$user_wallets.amount_trade',
            amount_demo: '$user_wallets.amount_demo',
            amount_expert: '$user_wallets.amount_expert',
            amount_copytrade: '$user_wallets.amount_copytrade',
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getAllWallets(): Promise<any> {
    try {
      const result = await UserSchema.aggregate([
        {
          $match: {
            status: 1,
          },
        },
        {
          $lookup: {
            from: 'user_wallets',
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_wallets',
          },
        },
        {
          $unwind: '$user_wallets',
        },
        {
          $project: {
            _id: '$_id',
            username: '$username',
            email: '$email',
            trc20: '$user_wallets.trc20',
            erc20: '$user_wallets.erc20',
            amount: '$user_wallets.amount',
            amount_wallet: '$user_wallets.amount_wallet',
            amount_erc20_wallet: '$user_wallets.amount_erc20_wallet',
            amount_trc20_wallet: '$user_wallets.amount_trc20_wallet',
            user_id: '$user_wallets.user_id',
          },
        },
      ]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async readyTransfer(user_id: string, amount: number): Promise<Boolean> {
    try {
      const row = await UserSchema.findById(user_id);
      if (!row) {
        return false;
      } else {
        const wallet = await UserWalletSchema.findOne({user_id: row._id});
        if (row.type_user == 0 && wallet?.amount >= amount) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      return false;
    }
  }

  public async readyInternalTransfer(user_id: string, amount: number, from_wallet: string): Promise<Boolean> {
    try {
      const row = await UserSchema.findById(user_id);
      if (!row) {
        return false;
      } else {
        from_wallet = from_wallet == 'spot' ? 'amount' : 'amount_' + from_wallet;
        const wallet = await UserWalletSchema.findOne({user_id: row._id});
        if (row.type_user == 0 && wallet?.[from_wallet] >= amount) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      return false;
    }
  }

  public async readyWithdraw(user_id: string, amount: number, password: string, tfa: string): Promise<Boolean> {
    try {
      const row = await UserSchema.findById(user_id);
      if (!row) {
        return false;
      } else {
        // TODO: Need to check TFA code
        const wallet = await UserWalletSchema.findOne({user_id: row._id});
        if (row.type_user == 0 && row.checkPassword(password) && wallet && wallet.amount >= amount) {
          // TODO: Need to check TFA code
          if (row?.tfa) {
            const secret = decrypt(user_id, row.tfa);
            if (verifyTOTP(tfa, secret)) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
    } catch (err) {
      return false;
    }
  }

  public async commissionMemberList(
    user_id: string,
    fromDate: Date,
    toDate: Date,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };
      const aggregate = UserSchema.aggregate([
        {
          $match: {
            commission_level: {
              $elemMatch: {
                $eq: user_id,
              },
            },
            createdAt: {
              $gte: new Date(moment(fromDate).startOf('day').toISOString()),
              $lte: new Date(moment(toDate).endOf('day').toISOString()),
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            createdAt: 1,
            username: 1,
            level: {
              $size: '$commission_level',
            },
            sponsor_id: {
              $toObjectId: {
                $arrayElemAt: ['$commission_level', -1],
              },
            },
            is_sponsor: {$ifNull: [false, true]},
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sponsor_id',
            foreignField: '_id',
            as: 'user_sponsor',
          },
        },
        {
          $unwind: '$user_sponsor',
        },
        {
          $project: {
            createdAt: 1,
            username: 1,
            level: 1,
            sponsor: '$user_sponsor.username',
            agency: '$is_sponsor',
          },
        },
      ]);
      const result = await UserSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getListUsers(textSearch: string, hideAmountSmall: boolean, page: number, limit: number): Promise<any> {
    try {
      const options = {
        page: page ?? 1,
        limit: limit,
      };
      let match = {};
      let search = null;
      let amountSmall = null;
      if (textSearch)
        search = {$or: [{username: {$regex: '.*' + textSearch + '.*'}}, {email: {$regex: '.*' + textSearch + '.*'}}]};
      if (hideAmountSmall)
        amountSmall = {
          $or: [
            {amount: {$gte: 1}},
            {amount_trade: {$gte: 1}},
            {amount_expert: {$gte: 1}},
            {amount_copytrade: {$gte: 1}},
          ],
        };
      if (search && hideAmountSmall) {
        match = {
          $and: [
            {$or: [{username: {$regex: '.*' + textSearch + '.*'}}, {email: {$regex: '.*' + textSearch + '.*'}}]},
            {
              $or: [
                {amount: {$gte: 1}},
                {amount_trade: {$gte: 1}},
                {amount_expert: {$gte: 1}},
                {amount_copytrade: {$gte: 1}},
              ],
            },
          ],
        };
      } else {
        if (search) match = search;
        else if (hideAmountSmall) match = amountSmall;
      }
      const aggregate = UserSchema.aggregate([
        {
          $lookup: {
            from: 'user_wallets',
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_wallets',
          },
        },
        {
          $unwind: '$user_wallets',
        },
        {
          $project: {
            _id: '$_id',
            username: '$username',
            email: '$email',
            avatar: '$avatar',
            is_sponsor: '$is_sponsor',
            is_expert: '$is_expert',
            isEnabledTFA: {
              $cond: [{$ifNull: ['$tfa', false]}, true, false],
            },
            amount: '$user_wallets.amount',
            amount_trade: '$user_wallets.amount_trade',
            amount_expert: '$user_wallets.amount_expert',
            amount_copytrade: '$user_wallets.amount_copytrade',
          },
        },
        {
          $match: match,
        },
      ]);
      const result = await UserSchema.aggregatePaginate(aggregate, options);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async updateNewPassword(id: string, salt: string, hashedPassword: string): Promise<true> {
    try {
      await UserSchema.updateOne({_id: this.toObjectId(id)}, {salt: salt, hashed_password: hashedPassword});
      return true;
    } catch (err) {
      throw err;
    }
  }

  // thông tin tổng hợp cho admin
  public async detailUserOnAdmin(user_id: string): Promise<any> {
    try {
      const result = UserSchema.aggregate([
        {
          $match: {
            _id: this.toObjectId(user_id),
          },
        },
        // ---- Thông tin sponsor của user ----
        {
          $project: {
            username: 1,
            email: 1,
            commission_level: {
              $toObjectId: {
                $last: '$commission_level',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'commission_level',
            foreignField: '_id',
            as: 'users_sponsor',
          },
        },
        {
          $unwind: {
            path: '$users_sponsor',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            username: 1,
            email: 1,
            commission_level: 1,
            sponsor: '$users_sponsor.username',
          },
        },
        // ---- END: Thông tin sponsor của user ----
        // ---- Join với bảng wallet để lấy thông tin ví ----
        {
          $lookup: {
            from: 'user_wallets',
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_wallets',
          },
        },
        {
          $unwind: '$user_wallets',
        },
        {
          $project: {
            username: 1,
            email: 1,
            sponsor: 1,
            trc20: '$user_wallets.trc20',
            erc20: '$user_wallets.erc20',
            amount_spot: '$user_wallets.amount',
            amount_trade: '$user_wallets.amount_trade',
          },
        },
        // ---- END: Join với bảng wallet để lấy thông tin ví ----
        // ---- Join với bảng transaction để lấy tổng số tiền đã deposit ----
        {
          $lookup: {
            from: 'user_transactions',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$user_id', '$$user_id'],
                      },
                      {
                        $eq: ['$type', 0],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'user_deposits',
          },
        },
        {
          $unwind: {
            path: '$user_deposits',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
            },
            user_deposits: {
              $sum: '$user_deposits.amount',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: 1,
          },
        },
        // ---- END: Join với bảng transaction để lấy tổng số tiền đã deposit ----
        // ---- Join với bảng transaction để lấy tổng số tiền đã withdraw ----
        {
          $lookup: {
            from: 'user_transactions',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$user_id', '$$user_id'],
                      },
                      {
                        $eq: ['$type', 2],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'user_withdraws',
          },
        },
        {
          $unwind: {
            path: '$user_withdraws',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
            },
            user_withdraws: {
              $sum: { $add: [ '$user_withdraws.amount', '$user_withdraws.fee' ] },
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$user_withdraws',
          },
        },
        // ---- END: Join với bảng transaction để lấy tổng số tiền đã withdraw ----
        // ---- Join với bảng commissions để lấy tổng số tiền hoa hồng ----
        {
          $lookup: {
            from: 'commissions',
            localField: '_id',
            foreignField: 'id_user_ref',
            as: 'commissions',
          },
        },
        {
          $unwind: {
            path: '$commissions',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
              user_withdraws: '$user_withdraws',
            },
            commissions: {
              $sum: '$commissions.commission',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$_id.user_withdraws',
            commissions: '$commissions',
          },
        },
        // ---- END: Join với bảng commissions để lấy tổng số tiền hoa hồng ----
        // ---- Join với bảng trade_histories để lấy tổng số tiền đã win ----
        {
          $lookup: {
            from: 'trade_histories',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$user_id', '$$user_id'],
                      },
                      {
                          $eq: ['$type', 0],
                      },
                      {
                        $gte: ['$amount_result', 0],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'trade_win',
          },
        },
        {
          $unwind: {
            path: '$trade_win',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
              user_withdraws: '$user_withdraws',
              commissions: '$commissions',
            },
            trade_win: {
              $sum: '$trade_win.amount_result',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$_id.user_withdraws',
            commissions: '$_id.commissions',
            trade_win: '$trade_win',
          },
        },
        // ---- END: Join với bảng trade_histories để lấy tổng số tiền đã win ----
        // ---- Join với bảng trade_histories để lấy tổng số tiền đã loss ----
        {
          $lookup: {
            from: 'trade_histories',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$user_id', '$$user_id'],
                      },
                      {
                          $eq: ['$type', 0],
                      },
                      {
                        $lte: ['$amount_result', 0],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'trade_loss',
          },
        },
        {
          $unwind: {
            path: '$trade_loss',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
              user_withdraws: '$user_withdraws',
              commissions: '$commissions',
              trade_win: '$trade_win',
            },
            trade_loss: {
              $sum: '$trade_loss.amount_result',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$_id.user_withdraws',
            commissions: '$_id.commissions',
            trade_win: '$_id.trade_win',
            trade_loss: '$trade_loss',
          },
        },
        // ---- END: Join với bảng trade_histories để lấy tổng số tiền đã loss ----
        // ---- Join với bảng user_transactions để lấy tổng số tiền user đã tranfers sang người khác ----
        {
          $lookup: {
            from: 'user_transactions',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$user_id', '$$user_id'],
                      },
                      {
                        $ne: ['$to_user_id', '$$user_id'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'tranfers_to_user',
          },
        },
        {
          $unwind: {
            path: '$tranfers_to_user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
              user_withdraws: '$user_withdraws',
              commissions: '$commissions',
              trade_win: '$trade_win',
              trade_loss: '$trade_loss',
            },
            tranfers_to_user: {
              $sum: '$tranfers_to_user.amount',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$_id.user_withdraws',
            commissions: '$_id.commissions',
            trade_win: '$_id.trade_win',
            trade_loss: '$_id.trade_loss',
            tranfers_to_user: '$tranfers_to_user',
          },
        },
        // ---- END: Join với bảng user_transactions để lấy tổng số tiền user đã tranfers sang người khác ----
        // ---- Join với bảng user_transactions để lấy tổng số tiền user nhận đc từ người khác ----
        {
          $lookup: {
            from: 'user_transactions',
            let: {
              user_id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $ne: ['$user_id', '$$user_id'],
                      },
                      {
                        $eq: ['$to_user_id', '$$user_id'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'receive_to_user',
          },
        },
        {
          $unwind: {
            path: '$receive_to_user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              trc20: '$trc20',
              erc20: '$erc20',
              amount_spot: '$amount_spot',
              amount_trade: '$amount_trade',
              sponsor: '$sponsor',
              user_deposits: '$user_deposits',
              user_withdraws: '$user_withdraws',
              commissions: '$commissions',
              trade_win: '$trade_win',
              trade_loss: '$trade_loss',
              tranfers_to_user: '$tranfers_to_user',
            },
            receive_to_user: {
              $sum: '$receive_to_user.amount',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            username: '$_id.username',
            email: '$_id.email',
            sponsor: '$_id.sponsor',
            trc20: '$_id.trc20',
            erc20: '$_id.erc20',
            amount_spot: '$_id.amount_spot',
            amount_trade: '$_id.amount_trade',
            user_deposits: '$_id.user_deposits',
            user_withdraws: '$_id.user_withdraws',
            commissions: '$_id.commissions',
            trade_win: '$_id.trade_win',
            trade_loss: '$_id.trade_loss',
            tranfers_to_user: '$_id.tranfers_to_user',
            receive_to_user: '$receive_to_user',
          },
        },
        // ---- END: Join với bảng user_transactions để lấy tổng số tiền user nhận đc từ người khác ----
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
