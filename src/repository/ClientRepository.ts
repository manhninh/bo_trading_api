import { IClientModel } from 'bo-trading-common/lib/models/clients';
import { ClientSchema } from 'bo-trading-common/lib/schemas';
import { RepositoryBase } from './base';

export default class ClientRepository extends RepositoryBase<IClientModel> {
  constructor() {
    super(ClientSchema);
  }

  public async findByClientId(clientId: string): Promise<IClientModel> {
    try {
      const result = await ClientSchema.findOne({ client_id: clientId });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
