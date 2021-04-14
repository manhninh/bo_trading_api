import { CreateOrderController } from '@src/controllers/orders/CreateOrderController';
import { Router } from 'express';

/**
 * @api {post} /orders Create order
 * @apiVersion 1.0.0
 * @apiGroup I. Orders
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {String} typeUser Loại user đặt lệnh (real account, demo account, expert account)
 * @apiParam {String} typeOrder Loại lệnh (buy, sell)
 * @apiParam {String} amount Số tiền đặt lệnh
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *        "dât": true
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
export default (route: Router) => route.post('/', CreateOrderController);
