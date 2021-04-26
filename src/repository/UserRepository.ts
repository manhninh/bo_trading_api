import { verifyTOTP } from '@src/middleware/auth/otp';
import { decrypt } from '@src/utils/helpers';
import { IUserModel } from 'bo-trading-common/lib/models/users';
import { UserSchema, UserWalletSchema } from 'bo-trading-common/lib/schemas';
import moment from 'moment';
import mongoose, { ObjectId, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { RepositoryBase } from './base';
export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema);
  }

  public async checkUserOrEmail(userOrEmail: string): Promise<IUserModel> {
    try {
      const result = await UserSchema.findOne({
        $or: [{ username: userOrEmail }, { email: userOrEmail }],
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
      await UserSchema.findByIdAndUpdate(id, { ref_code }, { new: true, upsert: true });
    } catch (err) {
      throw err;
    }
  }

  public async activeUser(id: ObjectId): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserSchema.updateOne({ _id: id }, { status: 1 });
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
              $cond: [{ $ifNull: ['$tfa', false] }, true, false],
            },
            is_sponsor: '$is_sponsor',
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
          },
        },
      ]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async readyTransfer(user_id: string, amount: number, password: string, tfa: string): Promise<Boolean> {
    try {
      const row = await UserSchema.findById(user_id);
      if (!row) {
        return false;
      } else {
        // TODO: Need to check TFA code
        const wallet = await UserWalletSchema.findOne({ user_id: row._id });
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
            is_sponsor: { $ifNull: [false, true] },
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
}
