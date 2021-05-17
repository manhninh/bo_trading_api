import { createMfaQrCodeController } from '@src/controllers/users/CreateMfaQrCodeController';
import { isAuthenticated } from '@src/middleware/auth/Oauth2';
import { Router } from 'express';

/**
 * @api {get} /users/create_mfa_qrcode Create mfa QR code
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
 *        "data": { "url" : "otpauth://totp/Finimix:vietibeer@gmail.com?algorithm=SHA1&digits=6&period=30&issuer=Finimix&secret=LKZLFWZ77ZIWTPDQ2YSG5AQ", "secret": "LKZLFWZ77ZIWTPDQ2YSG5AQ" }
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
export default (route: Router) => route.get('/create_mfa_qrcode', isAuthenticated, createMfaQrCodeController);
