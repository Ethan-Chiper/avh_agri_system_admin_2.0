/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/prefer-ternary */
const TransactionModel = require('../Models/TransactionModel');
const TransactionUpiModel = require('../Models/Transaction_upiModel');
const moment = require('moment');
const cron = require('node-cron');
const Responder = require('../App/Responder');
const winston = require('winston');
const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});

const SettlementController = {
	/**
	 * generateSettlementCron
	 */
	generateSettlementCron : () => {
		cron.schedule(
			'*/2 * * * * *',
			() => {
				logger.log(
					'Running a job on ' + moment(new Date()).tz('Asia/Kolkata').format() + ' at Asia/Kolkata timezone'
				);
				SettlementController.generateSettlement();
			},
			{
				schedule: true,
				timezone: 'Asia/Kolkata'
			}
		);
	},
	/**
	 * generateSettlement
	 */
	generateSettlement : (req, res) => {
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
			(err, data) => {
				TransactionUpiModel.insertMany(data, (err, report) => {
					if (!err && report) {
						return Responder.sendSuccessData(res, 'UPI Dashboard', report);
					} else {
						return Responder.sendFailureMessage(res, 'UPI dashboard insert failure');
					}
				});
			}
		);
	}
}

module.exports = SettlementController;
