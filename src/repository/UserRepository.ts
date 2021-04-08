import {IUserModel} from 'bo-trading-common/lib/models/users';
import {UserSchema} from 'bo-trading-common/lib/schemas';
import {ObjectId, UpdateQuery, UpdateWriteOpResult} from 'mongoose';
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

  public async updateById(id: ObjectId, update: UpdateQuery<IUserModel>): Promise<IUserModel> {
    try {
      const result = await UserSchema.findOneAndUpdate({id}, update);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public renderRefCodeUsers(id: ObjectId): void {
    try {
      const faker = require('faker');
      const ref_code = faker.vehicle.vrm();
      UserSchema.updateOne({id}, {ref_code}, {upsert: true});
    } catch (err) {
      throw err;
    }
  }

  public async activeManyUsers(ids: ObjectId[]): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserSchema.updateMany({id: {$in: ids}}, {status: 1});
      return result;
    } catch (err) {
      throw err;
    }
  }
}
