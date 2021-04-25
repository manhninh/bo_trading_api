import { verifyTOTP } from '@src/middleware/auth/otp';
import { decrypt } from '@src/utils/helpers';
import { IUserModel } from 'bo-trading-common/lib/models/users';
import { UserSchema, UserWalletSchema } from 'bo-trading-common/lib/schemas';
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

  public async activeManyUsers(ids: mongoose.Types.ObjectId[]): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserSchema.updateMany({ _id: { $in: ids } }, { status: 1 });
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
            ref_code: '$ref_code',
            isEnabledTFA: {
              $cond: { if: { $ne: ['$tfa', null] }, then: true, else: false },
            },
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
}
