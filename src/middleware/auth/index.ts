import config from '@src/config';
import AccessTokenRepository from '@src/repository/AccessTokenRepository';
import AdminRepository from '@src/repository/AdminRepository';
import ClientRepository from '@src/repository/ClientRepository';
import UserRepository from '@src/repository/UserRepository';
import moment from 'moment';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';

export default () => {
  passport.use(
    new BasicStrategy(async (username, password, done) => {
      try {
        const clientRes = new ClientRepository();
        clientRes
          .findByClientId(username)
          .then((client) => {
            if (!client) return done(null, false);
            if (client.client_secret != password) {
              return done(null, false);
            }
            return done(null, client);
          })
          .catch((err) => done(err));
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new ClientPasswordStrategy((clientId, clientSecret, done) => {
      try {
        const clientRes = new ClientRepository();
        clientRes
          .findOne({client_id: clientId})
          .then((client) => {
            if (!client) return done(null, false);
            if (client.client_secret !== clientSecret) return done(null, false);
            return done(null, client);
          })
          .catch((err) => done(err));
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const accessTokenRes = new AccessTokenRepository();
        const accessToken = await accessTokenRes.findByToken(token);
        if (!accessToken) return done({code: 403, type: 'INVALID_TOKEN'});
        const diffSeconds = moment.duration(moment().diff(moment(accessToken.createdAt))).asHours();
        if (diffSeconds > Number(config.TOKEN_LIFE)) {
          accessTokenRes.removeToken(token);
          return done({code: 403, type: 'TOKEN_EXPRIED'});
        }
        const userRes = new UserRepository();
        const user = await userRes.findById(accessToken.user_id);
        if (!user) {
          const adminRes = new AdminRepository();
          const admin = await adminRes.findById(accessToken.user_id);
          if (!admin) done(null, false, {message: 'Your account does not exist', scope: '*'});
          else done(null, admin, {scope: '*'});
        } else done(null, user, {scope: '*'});
      } catch (error) {
        done({code: 403, type: 'INVALID_TOKEN'});
      }
    }),
  );
};
