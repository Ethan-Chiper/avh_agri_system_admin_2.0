/* eslint-disable unicorn/no-array-callback-reference,unicorn/no-array-method-this-argument */
const VpaReconciliationsModel = require('../Models/VpaReconciliationsModel');
const {isEmpty, dateFinder} = require('../Helpers/Utils');
const Moment = require('moment');
const MomentTimeZone = require('moment-timezone');
const Fs = require('node:fs');

const VpaReconciliationsController = {
	/**
	 * To Export the reconciliations list of store_transactions
	 * @param request
	 * @param response
	 * @returns {Promise<{response.write(bufferdata)}|{error: boolean, message: string}>}
	 */
	exportStoreTransactionsList: async (request, response) => {
		try {
			let queryData = request?.query;
			let query = {};
			if (queryData?.date_option) {
				let slotDates = dateFinder(queryData);
				slotDates.$gte = Number.parseInt(Moment(slotDates?.$gte)?.format('YYYYMMDD'));
				slotDates[Object.keys(slotDates)[1]] = Number.parseInt(
					Moment(slotDates?.$lt || slotDates?.$lte)?.format('YYYYMMDD')
				);
				query['slot'] = slotDates;
			}
			if (queryData?.from_date && queryData?.to_date) {
				let fromDate = Number.parseInt(Moment(queryData?.from_date)?.format('YYYYMMDD'));
				let toDate = Number.parseInt(Moment(queryData?.to_date)?.format('YYYYMMDD'));
				query['slot'] = {$gte: fromDate, $lte: toDate};
			} else {
				if (queryData?.from_date) {
					let fromDate = Number.parseInt(Moment(queryData?.from_date)?.format('YYYYMMDD'));
					query['slot'] = {$gte: fromDate};
				}
				if (queryData?.to_date) {
					let toDate = Number.parseInt(Moment(queryData?.to_date)?.format('YYYYMMDD'));
					query['slot'] = {$lte: toDate};
				}
			}
			let storeTransactionList = VpaReconciliationsModel.find(query, {
				_id: 0,
				recon_id: 1,
				slot: 1,
				bank: 1,
				'result.available_transaction_count': 1,
				'result.missed_transaction_count': 1,
				'result.other_transaction_count': 1
			}).cursor();
			let filename = 'temp/report_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';

			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(filename);

			let headers = ['recon_id', 'slot', 'Bank', 'M_ID', 'Available', 'Missed', 'Other'];
			csvWriteStream.write(`${headers.join(',')}\n`);
			await storeTransactionList.on(
				'data',
				(data) => {
					const csvRow = `${data?.recon_id || ''}, ${data?.slot || ''}, ${data?.bank || ''}, ${' '},${
						data?.result?.available_transaction_count || ''
					}, ${data?.result?.missed_transaction_count || ''},${
						data?.result?.other_transaction_count || ''
					}\n`;

					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						throw new Error('some error while fetching data:', error);
					}
					csvWriteStream.end();
				}
			);
			storeTransactionList.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(filename);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');

				response.setHeader('Content-disposition', 'attachment; filename=Store_Transactions_Report.csv');

				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('some error while fetching data:', error);
						}
						csvFile.close();
					}
				);
				csvFile.on('close', async () => {
					// eslint-disable-next-line security/detect-non-literal-fs-filename
					Fs.unlinkSync(filename);
					return await response.end();
				});
			});
		} catch (error) {
			return {error: true, message: 'Something went wrong' + error.message};
		}
	},
	/**
	 * To Export the reconciliations details for one recon_id
	 * @param reconId
	 * @param response
	 * @returns {Promise<{response.write(bufferdata)}|{error: boolean, message: string}>}
	 */
	exportStoreTransactionsDetail: async (reconId, response) => {
		try {
			let otherTransactions = await VpaReconciliationsModel.findOne(
				{recon_id: reconId},
				{_id: 0, other_trans: '$result.other_transactions'}
			).lean();
			let existingTransactions = VpaReconciliationsModel.find(
				{recon_id: reconId},
				{_id: 0, other_trans: '$result.other_transactions'}
			).cursor();
			let transactions = otherTransactions?.other_trans;
			let fileName =
				'temp/report_reconDetail_<' + reconId + '>_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(fileName);
			let headers = Object.keys(transactions[0]);
			csvWriteStream.write(`${headers.join(',')}\n`);
			await existingTransactions.on(
				'data',
				(data) => {
					let transactions = data['_doc']?.other_trans;
					for (let trans of transactions) {
						let row = '';
						for (let key of headers) {
							let colData = trans[key];
							row += `${colData},`;
						}
						row = `${row.slice(0, -1)}\n`;
						csvWriteStream.write(row);
					}
				},
				(error) => {
					if (error) {
						throw new Error('some error while fetching data:', error);
					}
					csvWriteStream.end();
				}
			);
			existingTransactions.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(fileName);
				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('some error while fetching data:', error);
						}
						csvFile.close();
					}
				);
				csvFile.on('close', async () => {
					// eslint-disable-next-line security/detect-non-literal-fs-filename
					Fs.unlinkSync(fileName);
					return await response.end();
				});
			});
		} catch (error) {
			return {error: true, message: 'Something went wrong' + error.message};
		}
	},
	/**
	 * To List the store transactions in reconciliations
	 * @param queryData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	storeTransactionList: async (queryData) => {
		try {
			let limit = 20;
			let page = 1;
			let query = {};
			if (queryData?.limit) {
				limit = queryData?.limit <= 100 ? Number.parseInt(queryData?.limit) : 100;
			}
			if (queryData?.page) {
				page = Number.parseInt(queryData?.page);
			}
			if (queryData?.date_option) {
				let slotDates = dateFinder(queryData);
				slotDates.$gte = Number.parseInt(Moment(slotDates?.$gte)?.format('YYYYMMDD'));
				slotDates[Object.keys(slotDates)[1]] = Number.parseInt(
					Moment(slotDates?.$lt || slotDates?.$lte)?.format('YYYYMMDD')
				);
				query['slot'] = slotDates;
			}
			if (queryData?.from_date && queryData?.to_date) {
				let fromDate = Number.parseInt(Moment(queryData?.from_date)?.format('YYYYMMDD'));
				let toDate = Number.parseInt(Moment(queryData?.to_date)?.format('YYYYMMDD'));
				query['slot'] = {$gte: fromDate, $lte: toDate};
			} else {
				if (queryData?.from_date) {
					let fromDate = Number.parseInt(Moment(queryData?.from_date)?.format('YYYYMMDD'));
					query['slot'] = {$gte: fromDate};
				}
				if (queryData?.to_date) {
					let toDate = Number.parseInt(Moment(queryData?.to_date)?.format('YYYYMMDD'));
					query['slot'] = {$lte: toDate};
				}
			}
			let storeTransactionRequest = await VpaReconciliationsModel.find(query, {
				_id: 0,
				recon_id: 1,
				slot: 1,
				bank: 1,
				'result.available_transaction_count': 1,
				'result.missed_transaction_count': 1,
				'result.other_transaction_count': 1
			})
				.limit(limit)
				.skip(limit * (page - 1) || 0)
				.sort({_id: -1})
				.lean();

			return isEmpty(storeTransactionRequest)
				? {error: true, message: 'Transactions List not found'}
				: {
						error: false,
						message: 'Store Transaction List are',
						data: {store_transactions: storeTransactionRequest, length: storeTransactionRequest?.length}
				  };
		} catch {
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 * To detail other_transactions with recon_id
	 * @param request
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	storeTransactionDetail: async (request) => {
		try {
			let reconId = request?.params?.reconId;
			if (isEmpty(reconId)) {
				return {error: true, message: 'Please provide recon_id'};
			}

			let storeTransactionRequest = await VpaReconciliationsModel.findOne(
				{recon_id: reconId},
				{
					_id: 0,
					recon_id: 1,
					slot: 1,
					bank: 1,
					'result.other_transaction_count': 1,
					'result.other_transactions': 1
				}
			).lean();
			return isEmpty(storeTransactionRequest)
				? {error: true, message: 'recon_id is not found'}
				: {error: false, message: 'Store Transaction Detail', data: storeTransactionRequest};
		} catch (error) {
			return {error: true, message: error?.message};
		}
	}
};

module.exports = VpaReconciliationsController;
