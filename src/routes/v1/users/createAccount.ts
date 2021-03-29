import { createUserController } from '@src/controllers/users/CreateUserController';
import { Router } from 'express';

/**
 * @api {post} /accounts/create 1. Create a new account
 * @apiVersion 0.1.0
 * @apiGroup II. Accounts
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {String} email
 * @apiParam {String} password
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} avatar
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *        "data": {
 *            "id": 14,
 *            "email": "manhninh91@gmail.com",
 *            "first_name": "Ninh",
 *            "last_name": "Pham",
 *            "updated_at": "2020-04-03T06:34:15.153Z",
 *            "created_at": "2020-04-03T06:34:15.153Z"
 *        }
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
export default (route: Router) => route.post('/create', createUserController);
