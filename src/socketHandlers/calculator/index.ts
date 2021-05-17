import {logger} from 'bo-trading-common/lib/utils';
import {Socket} from 'socket.io-client';

export default (io: Socket) => {
  try {
    global.ioCalculator = io;

    io.on('connect', () => {
    });

    io.on('connect_error', (error: any) => {
      logger.error(`Socket Calculator Connect Error: ${error.message}\n`);
    });

    io.on('error', (error: any) => {
      logger.error(`Socket Calculator Error: ${error.message}\n`);
    });

    io.on('disconnect', (reason: string) => {
    });
  } catch (error) {
    logger.error(`Socket Calculator Error: ${error.message}\n`);
  }
};
