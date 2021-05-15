import {logger} from 'bo-trading-common/lib/utils';
import {Socket} from 'socket.io-client';
import {EVENTS, ROOM} from './type';

export default (io: Socket) => {
  try {
    io.on('connect', () => {
      io.emit(ROOM.ETHUSDT);
    });

    io.on('connect_error', (error: any) => {
      logger.error(`Socket Candlestick Connect Error: ${error.message}\n`);
    });

    io.on('error', (error: any) => {
      logger.error(`Socket Candlestick Error: ${error.message}\n`);
    });

    io.on('disconnect', (reason: string) => {
    });

    /** nhận dữ liệu đóng mở trade mỗi 30s một lần */
    io.on(EVENTS.OPEN_TRADE, (result: any) => {
      global.openTrade = result;
    });
  } catch (error) {
    logger.error(`Socket Candlestick Error: ${error.message}\n`);
  }
};
