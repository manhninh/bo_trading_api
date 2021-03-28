import {ObjectId} from 'mongoose';
import IUserModel from './IUserModel';

export default class UserModel {
  private _UserModel: IUserModel;

  constructor(UserModel: IUserModel) {
    this._UserModel = UserModel;
  }

  get full_name(): string {
    return this._UserModel.full_name;
  }

  get username(): string {
    return this._UserModel.username;
  }

  get email(): string {
    return this._UserModel.email;
  }

  get salt(): string {
    return this._UserModel.salt;
  }

  get hashed_password(): string {
    return this._UserModel.hashed_password;
  }

  get phone(): string {
    return this._UserModel.phone;
  }

  get real_user(): boolean {
    return this._UserModel.real_user;
  }

  get tfa(): string {
    return this._UserModel.tfa;
  }

  get commission_level(): ObjectId[] {
    return this._UserModel.commission_level;
  }

  get ref_code(): string {
    return this._UserModel.ref_code;
  }

  get amount(): number {
    return this._UserModel.amount;
  }

  get acces_token(): string {
    return this._UserModel.acces_token;
  }

  get verify_code(): string {
    return this._UserModel.verify_code;
  }

  get status(): number {
    return this._UserModel.status;
  }
}
