import { getUserInforController } from '@src/controllers/users/GetUserInforController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

/**
 * @api {post} /users Get user infor
 * @apiVersion 1.0.0
 * @apiGroup I. Users
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *        "data": { "_id" : ObjectId("606fca356c6b0524c0c3da31"), "username" : "manhninh91", "email" : "manhninh91@gmail.com", "ref_code" : "CJ51BNY", "amount_trade" : 0, "amount_demo" : 10000, "amount_expert" : 0, "amount_copytrade" : 0 }
 *    }
 *
 * @apiError (404 Not Found) NotFound API not found
 * @apiErrorExample {json} 404 Not Found Error
 *    HTTP/1.1 404 Not Found
 *
 * @apiError (500 Internal Server Error) InternalServerError The server encountered an internal error
 * @apiErrorExample {json} 500 Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       "message": "error message"
 *    }
 */
export default (route: Router) => route.get('/', isAuthenticated, getUserInforController);
