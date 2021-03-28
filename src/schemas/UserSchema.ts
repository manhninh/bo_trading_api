import IRealUserModel from '@src/models/users/IUserModel';
import mongoose, {Schema} from 'mongoose';

class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema(
      {
        full_name: {type: Schema.Types.String, default: ''},
        username: {type: Schema.Types.String, required: true, unique: true},
        email: {type: Schema.Types.String, index: true, required: true, unique: true},
        salt: {type: Schema.Types.String, required: true},
        hashed_password: {type: Schema.Types.String, required: true},
        phone: {type: Schema.Types.String},
        real_user: {type: Schema.Types.Boolean, required: true, default: true},
        tfa: {type: Schema.Types.String},
        commission_level: {type: Schema.Types.Array},
        ref_code: {type: Schema.Types.String, required: true},
        amount: {type: Schema.Types.Number, required: true, default: 0},
        acces_token: {type: Schema.Types.String, required: true},
        verify_code: {type: Schema.Types.String, required: false},
        status: {type: Schema.Types.Number, required: true, default: 0}, // 0: Not Active - 1: Active - 2: Block
      },
      {
        timestamps: true,
      },
    );
    return schema;
  }
}

export default mongoose.model<IRealUserModel>('users', UserSchema.schema);
