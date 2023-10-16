/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/prefer-ternary */
const TransactionModel = require('../Models/TransactionModel');
const TransactionUpiModel = require('../Models/Transaction_upiModel');
const Responder = require('../App/Responder');
const moment = require('moment');
const TransactionController= {
	/**
	 * create transaction
	 * @param {*} req
	 * @param {*} res
	 */
	createTransaction : (req, res) => {
		let requestData = req.body;
		TransactionModel.create(requestData, (err, createData) => {
			if (!err && createData) {
				return Responder.sendSuccessData(res, 'crteate Success', createData);
			} else {
				return Responder.sendFailureMessage(res, 'create Failure');
			}
		});
	},
	/**
	 * transactionUPIDashboard
	 * @param {*} req
	 * @param {*} res
	 */
	transactionUPIDashboard : (req, res) => {
		let format = 'YYYYMMDD';
		let date = new Date();
		let dateTime = moment(date).format(format);

		TransactionModel.aggregate(
			[
				{
					$match: {
						status: 'success',
						'payment.mode': 'upi',
						created_on: dateTime
					}
				},
				{
					$group: {
						_id: {
							merchantId: '$merchant.id',
							merchantName: '$merchant.name',
							storeId: '$store.id',
							storeName: '$store.name',
							created_on: '$created_on'
						},
						volume: {$sum: '$cost.paid'},
						count: {$sum: 1}
					}
				},
				{
					$project: {
						_id: 0,
						merchant: {
							id: '$_id.merchantId',
							name: '$_id.merchantName'
						},
						store: {
							id: '$_id.storeId',
							name: '$_id.storeName'
						},
						created_on: '$_id.created_on',
						transaction: {
							volume: '$volume',
							count: '$count'
						}
					}
				}
			],
			(err, documents) => {
				TransactionUpiModel.insertMany(documents, (err, result) => {
					if (!err && result) {
						return Responder.sendSuccessData(res, 'Transaction created', result);
					} else {
						return Responder.sendFailureMessage(res, 'transaction create failure');
					}
				});
			}
		);
	}
}

module.exports = TransactionController;
