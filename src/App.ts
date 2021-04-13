import { errorMiddleware, notFoundMiddleware } from 'bo-trading-common/lib/utils';
import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import cors from "cors";
import express from 'express';
import kue from "kue";
import passport from 'passport';
import auth from './middleware/auth';
import { token } from './middleware/auth/Oauth2';
import v1Routes from './routes/v1';
import Scheduler from './schedulers';

class App {
  public app: express.Application;
  public scheduler: Scheduler;

  constructor() {
    this.app = express();
    this.config();
    /** cronjob */
    new Scheduler().config();
  }

  private config() {
    global.queue = kue.createQueue({
      redis: {
        port: 11663,
        host: 'redis-11663.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        auth: 'q0h3eJRjjqQ4BotP73QG23ynzUmIi3C6'
      }
    });
    this.app.use(express.static(`${__dirname}/wwwroot`));
    this.app.use(cors({ origin: "*", methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'] }));
    this.app.use(compression());

    /** support application/json type post data */
    this.app.use(json({ limit: '10MB' }));
    this.app.use(urlencoded({ extended: true }));

    /** middle-ware that initialises Passport */
    this.app.use(passport.initialize());
    auth();
    this.app.post('/api/v1/oauth/token', token);

    /** add routes */
    this.app.use('/api/v1', v1Routes);

    this.app.use("/kue-api/", kue.app);

    /** not found error */
    this.app.use(notFoundMiddleware);

    /** internal server Error  */
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
