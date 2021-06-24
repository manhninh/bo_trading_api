import { GetTradeHistoryController } from '@src/controllers/trade/GetTradeHistoryController';
import { Router } from 'express';

/**
 * @api {get} /trade Get trade history
 * @apiVersion 1.0.0
 * @apiGroup I. trade
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {Number} type loại giao dịch
 * @apiParam {Number} page số trang
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
export default (route: Router) => route.get('/history', GetTradeHistoryController);
