import {logger} from 'bo-trading-common/lib/utils';
import http from 'http';
import 'module-alias/register';
import mongoose from 'mongoose';
import IOClient from 'socket.io-client';
import app from './App';
import config from './config';
import CalculatorSocket from './socketHandlers/calculator';
import CandlestickSocket from './socketHandlers/candlestick';

app.set('port', config.port);

const server = http.createServer(app);

server.listen(config.port);

server.on('listening', () => {
  if (process.env.NODE_ENV !== 'production') mongoose.set('debug', true);
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoose.connection.once('open', () => {
    logger.info('\n🚀Connected to Mongo via Mongoose');
    logger.info(
      `\n🚀Server listening on port: ${config.port} - env: ${process.env.NODE_ENV}
      \n🚀API Document on http://localhost:${config.port}/apidoc/index.html\n`,
    );

    /** kết nối socket nến để lấy dữ liệu cần thiết */
    const socket = IOClient(config.WS_CANDLESTICK, {query: {token: config.WS_TOKEN_API}});
    CandlestickSocket(socket);

    /** kết nối socket CALCULATOR để tạo process job khi người dùng verify tài khoản xong */
    const socketCalculator = IOClient(config.WS_CALCULATOR, {query: {token: config.WS_TOKEN_API}});
    CalculatorSocket(socketCalculator);
  });
  mongoose.connection.on('error', (err) => {
    logger.error('\n🚀Unable to connect to Mongo via Mongoose', err);
  });
});

server.on('error', (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});

process.on('uncaughtException', (error, origin) => {
  logger.error('----- Uncaught exception -----')
  logger.error(error)
  logger.error('----- Exception origin -----')
  logger.error(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('----- Unhandled Rejection at -----')
  logger.error(promise)
  logger.error('----- Reason -----')
  logger.error(reason)
})