import IUserModel from '@src/models/Users/IUserModel';
import UserSchema from '@src/schemas/UserSchema';
import {ObjectId} from 'mongoose';
import {RepositoryBase} from './base';

export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema);
  }

  public async checkUserOrEmail(userOrEmail: string): Promise<IUserModel> {
    try {
      const result = await UserSchema.findOne({
        $or: [{username: userOrEmail}, {email: userOrEmail}],
      });
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public createAccessToken(id: ObjectId, token: string): void {
    try {
      UserSchema.updateOne({id}, {$set: {acces_token: token}});
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
