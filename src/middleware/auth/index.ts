import CAccountRepository from '@src/repositories/accounts.repository';
import ClientRepository from '@src/repositories/clients.repository';
import {security} from '@src/utils';
import {createHash} from 'crypto';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';

export default () => {
  passport.use(
    new BasicStrategy(async (username, password, done) => {
      try {
        const cAccountRes = new CAccountRepository();
        const cAccount = await cAccountRes.findOne({where: {email: username}});
        if (!cAccount) return done(null, false);
        if (!security.checkPassword(password, cAccount.salt, cAccount.hashed_password)) return done(null, false);
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
      try {
        const clientRes = new ClientRepository();
        const result = await clientRes.findById(clientId);
        if (!result) return done(null, false);
        const hashClientSecret = createHash('sha512').update(clientSecret).digest('hex');
        if (result.client_secret !== hashClientSecret) return done(null, false);
        return done(null, result);
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const accessTokenRes = new AccessTokenRepository();
        const accessToken = await accessTokenRes.findOne({where: {token}});
        if (!accessToken) return done({code: 403, type: 'invalidToken', message: 'Token invalid'});
        const cAccountRes = new CAccountRepository();
        const cAccount = await cAccountRes.findById(accessToken.account_id);
        if (!cAccount) return done(null, false, {message: 'Unknown account', scope: '*'});
        done(null, cAccount);
      } catch (error) {
        done({code: 403, type: 'invalidToken', message: 'Token invalid'});
      }
    }),
  );
};
