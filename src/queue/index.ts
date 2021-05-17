import config from '@src/config';
import {logger} from 'bo-trading-common/lib/utils';
import kue from 'kue';

export default class QueueKue {
  queue = null;

  public init() {
    this.queue = kue.createQueue({
      redis: {
        port: config.REDIS_PORT,
        host: config.REDIS_HOST,
        auth: config.REDIS_AUTH,
      },
      jobEvents: false,
    });
    this.queue
      // error handling
      .on('error', (err: any) => {
        logger.error('QUEUE EROR: ', err);
      });
    global.queue = this.queue;
  }
}
