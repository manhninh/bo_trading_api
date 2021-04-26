import { updateUserController } from '@src/controllers/users/UpdateUserController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';
import multer from "multer";
const upload = multer({ dest: 'uploads/' });

/**
 * @api {post} /users/update Create new user
 * @apiVersion 1.0.0
 * @apiGroup I. Users
 *
 * @apiHeader {String} Content-Type multipart/form-data.
 * 
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "multipart/form-data"
 *
 * @apiParam {String} full_name
 * @apiParam {String} phone
 * @apiParam {object} avatar
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *        "data": true
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

export default (route: Router) => route.post('/update', upload.single('avatar'), isAuthenticated, updateUserController);
