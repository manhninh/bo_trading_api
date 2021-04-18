import {IQueueLogModel} from 'bo-trading-common/lib/models/queueLogs';
import {QueueLogSchema} from 'bo-trading-common/lib/schemas';
import {RepositoryBase} from './base';

export default class QueueLogRepository extends RepositoryBase<IQueueLogModel> {
  constructor() {
    super(QueueLogSchema);
  }
}
