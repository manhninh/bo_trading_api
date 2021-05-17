import { IRefreshTokenModel } from 'bo-trading-common/lib/models/refreshTokens';
import { RefreshTokenSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class RefreshTokenRepository extends RepositoryBase<IRefreshTokenModel> {
  constructor() {
    super(RefreshTokenSchema);
  }

  public async removeByUserIdAndClientId(userId: string, clientId: string): Promise<void> {
    try {
      await RefreshTokenSchema.deleteMany({user_id: this.toObjectId(userId), client_id: clientId});
    } catch (err) {
      throw err;
    }
  }

  public async findByToken(token: string): Promise<IRefreshTokenModel> {
    try {
      const result = await RefreshTokenSchema.findOne({ token });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
