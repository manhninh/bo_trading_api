import {STATUS} from '@src/contants/Response';
import IUserModel from '@src/models/users/IUserModel';
import UserRepository from '@src/repository/UserRepository';
import {checkPassword} from '@src/utils/SecurityPass';
import {randomBytes} from 'crypto';
import {createServer, exchange, ExchangeDoneFunction} from 'oauth2orize';
import passport from 'passport';

// initialization token
const initToken = async (userModel: IUserModel, done: ExchangeDoneFunction) => {
  try {
    const userRes = new UserRepository();
    const accessToken = randomBytes(512).toString('hex');
    userRes.createAccessToken(userModel.id, accessToken);
    done(null, accessToken);
  } catch (error) {
    done(error);
  }
};

// Create OAuth 2.0 server
const server = createServer();

// Exchange username & password for an access token.
server.exchange(
  exchange.password(
    {},
    async (_client, username: string, password: string, _scope, _body, issused: ExchangeDoneFunction) => {
      try {
        const userRes = new UserRepository();
        const user = await userRes.checkUserOrEmail(username);
        if (!user) {
          return issused(new Error('ACCOUNT_NOT_EXIST'));
        }
        if (!checkPassword(password, user.salt, user.hashed_password)) {
          return issused(new Error('ACCOUNT_LOGIN_FAIL'));
        } else {
          if (user.status === STATUS.ACTIVE) {
            initToken(user, issused);
          } else if (user.status === STATUS.BLOCK) {
            return issused(new Error('ACCOUNT_BLOCK'));
          } else {
            return issused(new Error('ACCOUNT_NOT_ACTIVE'));
          }
        }
      } catch (error) {
        issused(error);
      }
    },
  ),
);

/**
 * @api {post} /oauth/token 1. Sign in
 * @apiVersion 0.1.0
 * @apiGroup VII. Authorization
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParam {String} type (ADMIN/USER/EXPERT)
 * @apiParam {String} grant_type password
 * @apiParam {String} client_id b109f3bbbc244eb82441917ed06d618b9008dd09b3bef
 * @apiParam {String} client_secret password
 * @apiParam {String} scope offline_access
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "access_token": "d8e52612c0015c818fc76b007797e342bad3a6959f4241f11642c4249be7dae31d023112e0",
 *      "token_type": "Bearer"
 *    }
 *
 * @apiError (404 Not Found) NotFound API not found
 * @apiErrorExample {json} 404 Not Found Error
 *    HTTP/1.1 404 Not Found
 *
 * @apiError (500 Internal Server Error) InternalServerError The server encountered an internal error
 * @apiErrorExample {json} 500 Account not exist
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "Account not exist"
 *       }
 *    }
 * @apiErrorExample {json} 500 Login Fail
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "Login Fail"
 *       }
 *    }
 * @apiErrorExample {json} 500 Account not active
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "ACCOUNT_NOT_ACTIVE"
 *       }
 *    }
 */

const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
  server.token(),
  server.errorHandler(),
];

const isAuthenticated = passport.authenticate('bearer', {session: false});

export {token, isAuthenticated};
