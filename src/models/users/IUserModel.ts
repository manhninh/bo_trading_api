import mongoose, {ObjectId} from 'mongoose';

export default interface IUserModel extends mongoose.Document {
  full_name: string;
  username: string;
  email: string;
  salt: string;
  hashed_password: string;
  phone: string;
  real_user: boolean;
  tfa: string;
  commission_level: ObjectId[];
  ref_code: string;
  amount: number;
  acces_token: string;
  verify_code: string;
  status: number;
}
