import { GetTransactionsHistory } from '@src/controllers/wallet/WalletController';
import { Router } from 'express';

/**
 * @api {get} /wallet/transaction/history Get Deposit History with pagination
 * @apiVersion 1.0.0
 * @apiGroup III. Wallet
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {Number} page
 * @apiParam {Number} limit
 * @apiParam {Number} type (0: Deposit, 1: Transfer, 2: Withdraw)
 * 
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *        "data":{"docs":[{"amount":30,"fee":0,"symbol":"USDT-TRC20","address":"TGYu9ra7PZHEDPMiGG2hLQddnzaJTu6sFv","tx":"71a3c536e13c62903cf0aa41b4f0b2ba3db0049453a23b6ffb4e70978e238607","status":1,"type":0,"noted":"","_id":"60767b4917a0c525d402a79d","user_id":"607263005aeb5137acca6073","to_user_id":null,"createdAt":"2021-04-14T05:19:05.846Z","updatedAt":"2021-04-15T05:41:01.472Z","__v":0}],"total":9,"limit":1,"page":1,"pages":9}
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

export default (route: Router) => route.get('/transaction/history', GetTransactionsHistory);
