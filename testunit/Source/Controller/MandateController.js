/* eslint-disable unicorn/no-array-callback-reference,unicorn/no-array-method-this-argument */
const Config = require('../App/Config');
const {isEmpty, networkCall, dateFinder} = require('../Helpers/Utils');
const MandateRequestModel = require('../Models/MandateRequestModel');
const MandateTransactionModel = require('../Models/MandateTransactionModel');
const MomentTimeZone = require('moment-timezone');
const Moment = require('moment');
const Fs = require('node:fs');
const Utils = require('../Helpers/Utils');
const Xlsx = require('xlsx');

const MandateController = {
	/**
	 * To Fetch the Mandate List of a Merchant
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	list: async (queryData, loggedUser) => {
		try {
			if (isEmpty(loggedUser)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let limit = 20;
				let page = 1;
				let query = {};

				if (queryData?.limit) {
					limit = Number.parseInt(queryData?.limit);
				}

				if (queryData?.page) {
					page = Number.parseInt(queryData?.page);
				}

				if (queryData?.from_time || queryData?.to_time || queryData?.date_option) {
					query['createdAt'] = dateFinder(queryData);
				}

				if (queryData?.status) {
					query['status'] = queryData?.status;
				}

				if (queryData?.merchant_id) {
					query['merchant.id'] = queryData?.merchant_id;
				}

				if (queryData?.mandate_id) {
					query['mandate.mandate_id'] = queryData?.mandate_id;
				}

				if (queryData?.mandate_for) {
					query['mandate_asset_details.mandate_for'] = queryData?.mandate_for;
				}

				if (queryData?.store_id) {
					query['store.id'] = queryData?.store_id;
				}

				if (queryData?.plan_id) {
					query['plan.plan_id'] = queryData?.plan_id;
				}

				if (queryData?.phone) {
					query['phone.national_number'] = queryData?.phone;
				}

				let mandateRequest = await MandateRequestModel.find(query, {
					mandate_request_id: 1,
					merchant: 1,
					store: 1,
					plan: 1,
					mandate: 1,
					phone: 1,
					mandate_amount: 1,
					registration_fees: 1,
					subscription_fees: 1,
					mandate_asset_details: 1,
					transactions_details: 1,
					createdAt: 1,
					status: 1,
					_id: 0
				})
					.limit(limit)
					.skip(limit * (page - 1) || 0)
					.sort({_id: -1})
					.lean();

				return isEmpty(mandateRequest)
					? {error: true, message: 'Mandate list not found'}
					: {
							error: false,
							message: 'Mandate request list',
							data: {mandate_list: mandateRequest, total: mandateRequest?.length}
					  };
			}
		} catch {
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to revoke mandate
	 * @param loggedUser
	 * @param mandateId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	mandateRevoke: async (loggedUser, mandateId) => {
		try {
			if (isEmpty(mandateId)) {
				return {error: true, message: 'Mandate id should not be empty'};
			}
			let mandateData = await MandateRequestModel.findOne(
				{'mandate.mandate_id': mandateId},
				{mandate: 1, mandate_asset_details: 1, createdAt: 1}
			).lean();

			if (isEmpty(mandateData)) {
				return {
					error: true,
					message: 'Mandate data Not Found!'
				};
			}

			let options = {
				method: 'POST',
				headers: {
					'x-api-key': Config.SERVICE.MANDATE_COLLECTION.ICICI.API_KEY
				},
				body: {
					mandate_id: mandateData?.mandate?.mandate_id,
					merchant_id: Config.SERVICE.MANDATE_COLLECTION.ICICI.MERCHANT_ID
				},
				url: Config.SERVICE.MANDATE_COLLECTION.ICICI.BASE_URL + '/upi/revoke'
			};
			let mandateResult = await networkCall(options);
			let resultData = JSON.parse(mandateResult?.body);
			let valid = resultData?.success;
			return valid && resultData?.data?.response === '0'
				? {
						error: false,
						message: resultData?.message,
						data: resultData?.data
				  }
				: {error: true, message: resultData?.message || 'Mandate not found'};
		} catch {
			return {error: true, message: 'Something went wrong'};
		}
	},

	mandateDetails: async (request) => {
		try {
			let mandateId = request?.params?.mandateId;

			if (isEmpty(mandateId)) {
				return {error: true, message: 'Mandate Id not found'};
			}

			let mandateRequest = await MandateRequestModel.findOne(
				{'mandate.mandate_id': mandateId},
				{
					merchant: 1,
					store: 1,
					plan: 1,
					mandate: 1,
					mandate_asset_details: 1,
					transactions_details: 1,
					createdAt: 1,
					phone: 1,
					status: 1,
					_id: 0
				}
			).lean();

			return isEmpty(mandateRequest)
				? {error: true, message: 'Mandate details not found'}
				: {error: false, message: 'Mandate details', data: mandateRequest};
		} catch (error) {
			return {error: true, message: error?.message};
		}
	},
	mandate_stats: async (request) => {
		try {
			let requestQuery = request.query;

			let statsFor = requestQuery?.stats_for || 'sound_box';
			let query = {};
			if (requestQuery?.date_option || requestQuery?.from_time || requestQuery?.to_time) {
				query = Utils.dateFinder(requestQuery);
			}

			let [pausedCount, activeCount, revokedCount, notificationStats, collectionStats] = await Promise.all([
				await MandateRequestModel.find(
					{
						paused_at: query /* {
							$gte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').startOf('d')),
							$lte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').endOf('d'))
						} */,
						status: 'paused',
						'mandate.status': 'paused',
						'mandate_asset_details.mandate_for': statsFor
					},
					{mandate_request_id: 1}
				)
					.count()
					.lean(),
				await MandateRequestModel.find(
					{
						createdAt: query /* {
							$gte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').startOf('d')),
							$lte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').endOf('d'))
						} */,
						status: 'active',
						'mandate.status': 'active',
						'mandate_asset_details.mandate_for': statsFor
					},
					{mandate_request_id: 1}
				)
					.count()
					.lean(),
				await MandateRequestModel.find(
					{
						revoked_at: query /* {
							$gte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').startOf('d')),
							$lte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').endOf('d'))
						} */,
						status: 'revoked',
						'mandate.status': 'revoked',
						'mandate_asset_details.mandate_for': statsFor
					},
					{mandate_request_id: 1}
				)
					.count()
					.lean(),
				await MandateTransactionModel.aggregate([
					{
						$match: {
							notification_date: query /* {
								$gte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').startOf('d')),
								$lte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').endOf('d'))
							} */,
							// notification_status: 'failed',
							'merchant_details.notification_for': statsFor
						}
					},
					{
						$group: {
							_id: '$notification_status',
							count: {$sum: 1},
							amount: {
								$sum: {
									$toInt: '$amount'
								}
							}
						}
					},
					{
						$project: {
							_id: 0,
							status: '$_id',
							count: '$count',
							amount: '$amount'
						}
					}
				]),
				await MandateTransactionModel.aggregate([
					{
						$match: {
							collection_date: query /* {
								$gte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').startOf('d')),
								$lte: new Date(MomentTimeZone(requestQuery?.date).tz('Asia/Kolkata').endOf('d'))
							} */,
							notification_status: 'success',
							// collection_status: 'failed',
							'merchant_details.notification_for': statsFor
						}
					},
					{
						$group: {
							_id: '$collection_status',
							count: {$sum: 1},
							amount: {
								$sum: {
									$toInt: '$amount'
								}
							}
						}
					},
					{
						$project: {
							_id: 0,
							status: '$_id',
							count: '$count',
							amount: '$amount'
						}
					}
				])
			]);
			let notificationFailed = notificationStats.find((data) => data.status === 'failed');
			let notificationSuccess = notificationStats.find((data) => data.status === 'success');
			let notificationPending = notificationStats.find((data) => data.status === 'pending');
			let notifications = {
				failed: {
					count: notificationFailed?.count || 0,
					amount: notificationFailed?.amount || 0
				},
				success: {
					count: notificationSuccess?.count || 0,
					amount: notificationSuccess?.amount || 0
				},
				pending: {
					count: notificationPending?.count || 0,
					amount: notificationPending?.amount || 0
				}
			};

			let collectionFailed = collectionStats.find((data) => data.status === 'failed');
			let collectionSuccess = collectionStats.find((data) => data.status === 'success');
			let collectionPending = collectionStats.find((data) => data.status === 'initiated');

			let collections = {
				failed: {
					count: collectionFailed?.count || 0,
					amount: collectionFailed?.amount || 0
				},
				success: {
					count: collectionSuccess?.count || 0,
					amount: collectionSuccess?.amount || 0
				},
				pending: {
					count: collectionPending?.count || 0,
					amount: collectionPending?.amount || 0
				}
			};
			return {
				error: false,
				message: 'mandate stats details',
				data: {
					paused_count: pausedCount,
					active_count: activeCount,
					revoked_count: revokedCount,
					notification_stats: notifications,
					collection_stats: collections
				}
			};
		} catch (error) {
			return {error: true, message: 'Something went wrong ' + error.message};
		}
	},
	mandate_stats_for_merchant: async (request) => {
		try {
			let requestQuery = request?.query;
			let mandateId = request?.params?.mandate_id;
			let query = {};
			if (requestQuery?.date_option || requestQuery?.from_time || requestQuery?.to_time) {
				query['createdAt'] = Utils.dateFinder(requestQuery);
			}
			let limit = requestQuery?.limit > 99 ? 100 : requestQuery?.limit;
			let collectionList = await MandateTransactionModel.find(
				{
					mandate_id: mandateId,
					'merchant_details.notification_for': requestQuery?.stats_for || 'sound_box',
					...query
				},
				{
					_id: 0,
					transaction_id: 1,
					merchant_id: 1,
					mandate_id: 1,
					store_id: 1,
					merchant_details: 1,
					amount: 1,
					notification_id: 1,
					notification_date: 1,
					notification_status: 1,
					sequence_number: 1,
					collection_id: 1,
					collection_date: 1,
					collection_status: 1,
					collection_till: 1,
					collected_date: 1,
					createdAt: 1
				}
			)
				.limit(limit)
				.skip(limit * (Number.parseInt(requestQuery?.page) - 1) || 0)
				.lean();
			let mandateInformation = await MandateRequestModel.findOne(
				{
					'mandate.mandate_id': mandateId,
					'mandate_asset_details.mandate_for': requestQuery?.stats_for || 'sound_box'
				},
				{
					_id: 0,
					mandate_request_id: 1,
					merchant: 1,
					status: 1,
					mandate_amount: 1,
					registration_fees: 1,
					subscription_fees: 1,
					mandate_asset_details: 1,
					plan: 1,
					tenure: 1,
					phone: 1,
					mandate: 1,
					paused_at: 1,
					revoked_at: 1,
					transactions_details: 1,
					createdAt: 1
				}
			).lean();

			let notificationStats = await MandateTransactionModel.aggregate([
				{
					$match: {
						mandate_id: mandateId,
						'merchant_details.notification_for': requestQuery?.stats_for || 'sound_box',
						...query
					}
				},
				{
					$group: {
						_id: '$notification_status',
						count: {$sum: 1},
						amount: {
							$sum: {
								$toInt: '$amount'
							}
						}
					}
				},
				{
					$project: {
						_id: 0,
						status: '$_id',
						count: '$count',
						amount: '$amount'
					}
				}
			]);

			let collectionStats = await MandateTransactionModel.aggregate([
				{
					$match: {
						mandate_id: mandateId,
						notification_status: 'success',
						'merchant_details.notification_for': requestQuery?.stats_for || 'sound_box',
						...query
					}
				},
				{
					$group: {
						_id: '$collection_status',
						count: {$sum: 1},
						amount: {
							$sum: {
								$toInt: '$amount'
							}
						}
					}
				},
				{
					$project: {
						_id: 0,
						status: '$_id',
						count: '$count',
						amount: '$amount'
					}
				}
			]);
			let notificationFailed = notificationStats.find((data) => data.status === 'failed');
			let notificationSuccess = notificationStats.find((data) => data.status === 'success');
			let notificationPending = notificationStats.find((data) => data.status === 'pending');
			let notifications = {
				failed: {
					count: notificationFailed?.count || 0,
					amount: notificationFailed?.amount || 0
				},
				success: {
					count: notificationSuccess?.count || 0,
					amount: notificationSuccess?.amount || 0
				},
				pending: {
					count: notificationPending?.count || 0,
					amount: notificationPending?.amount || 0
				}
			};

			let collectionFailed = collectionStats.find((data) => data.status === 'failed');
			let collectionSuccess = collectionStats.find((data) => data.status === 'success');
			let collectionPending = collectionStats.find((data) => data.status === 'initiated');

			let collections = {
				failed: {
					count: collectionFailed?.count || 0,
					amount: collectionFailed?.amount || 0
				},
				success: {
					count: collectionSuccess?.count || 0,
					amount: collectionSuccess?.amount || 0
				},
				pending: {
					count: collectionPending?.count || 0,
					amount: collectionPending?.amount || 0
				}
			};

			let balance =
				Number.parseInt(collectionFailed?.amount || 0) + Number.parseInt(collectionPending?.amount || 0);
			return {
				error: false,
				message: 'mandate details',
				data: {
					collection_list: collectionList,
					mandate_information: mandateInformation,
					notification_stats: notifications,
					collection_stats: collections,
					unpaid_balance: balance
				}
			};
		} catch (error) {
			return {error: true, message: 'Something went wrong ' + error.message};
		}
	},
	transaction_details: async (request) => {
		try {
			let transactionId = request?.params?.transaction_id;
			let transaction = await MandateTransactionModel.findOne(
				{transaction_id: transactionId},
				{
					_id: 0,
					transaction_id: 1,
					merchant_id: 1,
					mandate_id: 1,
					store_id: 1,
					merchant_details: 1,
					amount: 1,
					notification_id: 1,
					notification_date: 1,
					notification_status: 1,
					sequence_number: 1,
					collection_id: 1,
					collection_date: 1,
					collection_status: 1,
					collection_till: 1,
					collected_date: 1
				}
			).lean();
			return isEmpty(transaction)
				? {
						error: true,
						message: 'transaction not found'
				  }
				: {
						error: false,
						message: 'transaction details',
						data: transaction
				  };
		} catch (error) {
			return {error: true, message: 'Something went wrong ' + error.message};
		}
	},
	exportCollectionList: async (request, response) => {
		try {
			let requestQuery = request.query;
			let mandateId = request?.params?.mandate_id;
			let query = {};
			if (requestQuery?.date_option) {
				query['createdAt'] = Utils.dateFinder({
					date_option: requestQuery?.date_option
				});
			}
			let checkCollection = await MandateTransactionModel.findOne(
				{
					mandate_id: mandateId,
					'merchant_details.notification_for': requestQuery?.stats_for || 'sound_box',
					...query
				},
				{
					transaction_id: 1
				}
			).lean();
			if (!checkCollection) {
				return response.status(400).send({success: false, message: 'no collection data found'});
			}
			let collectionList = MandateTransactionModel.find(
				{
					mandate_id: mandateId,
					'merchant_details.notification_for': requestQuery?.stats_for || 'sound_box',
					...query
				},
				{
					_id: 0,
					transaction_id: 1,
					merchant_id: 1,
					mandate_id: 1,
					store_id: 1,
					merchant_details: 1,
					amount: 1,
					notification_id: 1,
					notification_date: 1,
					notification_status: 1,
					sequence_number: 1,
					collection_id: 1,
					collection_date: 1,
					collection_status: 1,
					collection_till: 1,
					collected_date: 1
				}
			).cursor();

			let filename = 'temp/report_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';

			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(filename);

			let headers = [
				'transaction_id',
				'merchant_id',
				'mandate_id',
				'store_id',
				'amount',
				'type',
				'device_id',
				'notification_id',
				'notification_date',
				'notification_status',
				'sequence_number',
				'collection_date',
				'collection_id',
				'collection_status',
				'collection_till'
			];

			csvWriteStream.write(`${headers.join(',')}\n`);

			await collectionList.on(
				'data',
				(data) => {
					const csvRow = `${data?.transaction_id || ''},${data?.merchant_id || ''},${
						data?.mandate_id || ''
					},${data?.store_id || ''},${data?.amount || ''},${data?.merchant_details?.notification_for || ''},${
						data?.merchant_details?.device_id || ''
					},${data?.notification_id || ''},${
						data?.notification_date
							? MomentTimeZone(data?.notification_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: ''
					},${data?.notification_status || ''},${data?.sequence_number || ''},${
						data?.collection_date
							? MomentTimeZone(data?.collection_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: ''
					},${data?.collection_id || ''},${data?.collection_status || ''},${
						data?.collection_till
							? MomentTimeZone(data?.collection_till).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: ''
					}\n`;

					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						throw new Error('Error retrieving data from MongoDB:', error);
					}
					csvWriteStream.end();
				}
			);

			collectionList.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(filename);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');

				// Header to force download
				response.setHeader('Content-disposition', 'attachment; filename=Report.csv');

				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('Error retrieving data from MongoDB:', error);
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
			return {error: true, message: 'Something went wrong ' + error.message};
		}
	},
	mandate_reports: async (request, response) => {
		try {
			let queryData = request?.query;
			let query = {};

			if (queryData?.from_time || queryData?.to_time || queryData?.date_option) {
				query['createdAt'] = dateFinder(queryData);
			}

			if (queryData?.status) {
				query['status'] = queryData?.status;
			}

			if (queryData?.merchant_id) {
				query['merchant.id'] = queryData?.merchant_id;
			}

			if (queryData?.mandate_id) {
				query['mandate.mandate_id'] = queryData?.mandate_id;
			}

			if (queryData?.stats_for) {
				query['mandate_asset_details.mandate_for'] = queryData?.stats_for;
			}

			if (queryData?.store_id) {
				query['store.id'] = queryData?.store_id;
			}

			if (queryData?.phone) {
				query['phone.national_number'] = queryData?.phone;
			}

			let mandateCheck = await MandateRequestModel.findOne(query, {
				mandate_request_id: 1
			})
				.sort({_id: -1})
				.lean();

			if (!mandateCheck) {
				return response.status(400).send({success: false, message: 'no mandate data found'});
			}

			let mandateList = MandateRequestModel.find(query, {}).sort({_id: -1}).cursor();
			let filename = 'temp/mandte_report_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';

			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(filename);

			let headers = [
				'mandate_request_id',
				'merchant_id',
				'merchant_name',
				'phone_number',
				'store_id',
				'store_name',
				'plan_name',
				'plan_id',
				'status',
				'mandate_amount',
				'subscription_amount',
				'type',
				'device_id',
				'umn'
			];

			csvWriteStream.write(`${headers.join(',')}\n`);

			await mandateList.on(
				'data',
				(data) => {
					const csvRow = `${data?.mandate_request_id || ''},${data?.merchant.id || ''},${
						data?.merchant?.name || ''
					},${data?.phone?.national_number || ''},${data?.store?.id || ''},${data?.store?.name || ''},${
						data?.plan?.plan_name || ''
					},${data?.plan?.plan_id},${data?.status || ''},${data?.mandate_amount || ''},${
						data?.subscription_fees || ''
					},${data?.mandate_asset_details?.mandate_for || ''},${
						data?.mandate_asset_details?.device_reference_id || ''
					},${data?.mandate?.umn || ''}\n`;

					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						throw new Error('Error retrieving data from MongoDB:', error);
					}
					csvWriteStream.end();
				}
			);

			mandateList.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(filename);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');

				// Header to force download
				response.setHeader('Content-disposition', 'attachment; filename=Report.csv');

				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('Error retrieving data from MongoDB:', error);
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
		} catch {
			return {error: true, message: 'Something went wrong'};
		}
	},
	transactionReport: async (request, response) => {
		try {
			let requestData = request?.query;
			let query = {};

			let reportFor = requestData?.report_for === 'notification' ? 'notification_date' : 'collection_date';

			if (requestData?.date) {
				query[`${reportFor}`] = {
					$gte: new Date(MomentTimeZone(requestData?.date).tz('Asia/Kolkata').startOf('d')),
					$lte: new Date(MomentTimeZone(requestData?.date).tz('Asia/Kolkata').endOf('d'))
				};
			}

			let existCheck = await MandateTransactionModel.findOne(query, {transaction_id: 1}).lean();

			if (!existCheck) {
				return response.status(400).send({success: false, message: 'no transaction data found'});
			}

			let transactions = await MandateTransactionModel.find(query).cursor();
			let filename = 'temp/transaction_report_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';

			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(filename);

			let headers = [
				'Transaction Id',
				'Merchant Id',
				'Merchant Name',
				'Store Id',
				'Store Name',
				'Mandate Id',
				'Mandate For',
				'Device Id',
				'Sequence Number',
				'Colleciton Amount',
				'Notification Id',
				'Notification Retry Count',
				'Notification Date',
				'Notification Status',
				'Collection Id',
				'Collection Retry Count',
				'Collection Date',
				'Collection Status',
				'Collection Till Date',
				'Collected Date',
				'Created Date',
				'Collection Success/Failed Message',
				'Collection Success/Failed Code'
			];

			csvWriteStream.write(`${headers.join(',')}\n`);

			await transactions.on(
				'data',
				async (data) => {
					let mandate = await MandateRequestModel.findOne({'mandate.mandate_id': data?.mandate_id}).lean();
					let internal = data?.internal?.collection_meta;
					internal = internal[internal.length - 1];

					let csvRow = `${data?.transaction_id || '-'},${data?.merchant_id || '-'},${
						mandate?.merchant?.name || '-'
					},${data?.store_id || '-'},${mandate?.store?.name || '-'},${data?.mandate_id || '-'},${
						data?.merchant_details?.notification_for || '-'
					},${data?.merchant_details?.device_id || '-'},${data?.sequence_number || '-'},${
						data?.amount || '-'
					},${data?.notification_id || '-'},${data?.notification_retry || '-'},${
						data?.notification_date
							? MomentTimeZone(data?.notification_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},${data?.notification_status || '-'},${data?.collection_id || '-'},${
						data?.collection_retry || '-'
					},${
						data?.collection_date
							? MomentTimeZone(data?.collection_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},${data?.collection_status || '-'},${
						data?.collection_till
							? MomentTimeZone(data?.collection_till).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},${
						data?.collected_date
							? MomentTimeZone(data?.collected_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},${
						data?.createdAt
							? MomentTimeZone(data?.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},${internal?.data?.bank_detials?.message || internal?.bank_details?.TxnStatus || '-'},${
						internal?.bank_details?.ResponseCode || internal?.data?.bank_detials?.response || '-'
					}\n`;
					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						throw new Error('Error retrieving data from MongoDB:', error);
					}
					csvWriteStream.end();
				}
			);

			transactions.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(filename);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');

				// Header to force download
				response.setHeader('Content-disposition', 'attachment; filename=Report.csv');

				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('Error retrieving data from MongoDB:', error);
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
	collectionReportByMandate: async (request, response) => {
		try {
			let requestData = request?.query;
			let query = {};
			if (requestData?.mandate_for) {
				query['mandate_asset_details.mandate_for'] = requestData?.mandate_for;
			}
			// error menu handler
			let errorMessages = {
				U01: 'THE REQUEST IS DUPLICATE',
				U02: 'AMOUNT CAP IS EXCEEDED',
				U03: 'NET DEBIT CAP IS EXCEEDED',
				U04: 'REQUEST IS NOT FOUND',
				U05: 'FORMATION IS NOT PROPER',
				U06: 'TRANSACTION ID IS MISMATCHED',
				U07: 'VALIDATION ERROR',
				U08: 'SYSTEM EXCEPTION',
				U09: 'REQAUTH TIME OUT FOR PAY',
				U10: 'ILLEGAL OPERATION',
				U11: 'CREDENTIALS IS NOT PRESENT',
				U12: 'AMOUNT OR CURRENCY MISMATCH',
				U13: 'EXTERNAL ERROR',
				U14: 'ENCRYPTION ERROR',
				U15: 'CHECKSUM FAILED',
				U16: 'RISK THRESHOLD EXCEEDED',
				U17: 'PSP IS NOT REGISTERED',
				U18: 'REQUEST AUTHORISATION ACKNOWLEDGEMENT IS NOT RECEIVED',
				U19: 'REQUEST AUTHORISATION IS DECLINED',
				U20: 'REQUEST AUTHORISATION TIMEOUT',
				U21: 'REQUEST AUTHORISATION IS NOT FOUND',
				U22: 'CM REQUEST IS DECLINED',
				U23: 'CM REQUEST TIMEOUT',
				U24: 'CM REQUEST ACKNOWLEDGEMENT IS NOT RECEIVED',
				U25: 'CM URL IS NOT FOUND',
				U26: 'PSP REQUEST CREDIT PAY ACKNOWLEDGEMENT IS NOT RECEIVED',
				U27: 'NO RESPONSE FROM PSP',
				U28: 'REMITTER BANK NOT AVAILABLE',
				U29: 'ADDRESS RESOLUTION IS FAILED',
				U30: 'DEBIT HAS BEEN FAILED',
				U31: 'CREDIT HAS BEEN FAILED',
				U32: 'CREDIT REVERT HAS BEEN FAILED',
				U33: 'DEBIT REVERT HAS BEEN FAILED',
				U34: 'REVERTED',
				U35: 'RESPONSE IS ALREADY BEEN RECEIVED',
				U36: 'REQUEST IS ALREADY BEEN SENT',
				U37: 'REVERSAL HAS BEEN SENT',
				U38: 'RESPONSE IS ALREADY BEEN SENT',
				U39: 'TRANSACTION IS ALREADY BEEN FAILED',
				U40: 'IMPS PROCESSING FAILED IN UPI',
				U41: 'IMPS IS SIGNED OFF',
				U42: 'IMPS TRANSACTION IS ALREADY BEEN PROCESSED',
				U43: 'IMPS IS DECLINED',
				U44: 'FORM HAS BEEN SIGNED OFF',
				U45: 'FORM PROCESSING HAS BEEN FAILED IN UPI',
				U46: 'REQUEST CREDIT IS NOT FOUND',
				U47: 'REQUEST DEBIT IS NOT FOUND',
				U48: 'TRANSACTION ID IS NOT PRESENT',
				U49: 'REQUEST MESSAGE ID IS NOT PRESENT',
				U50: 'IFSC IS NOT PRESENT',
				U51: 'REQUEST REFUND IS NOT FOUND',
				U52: 'PSP ORGID NOT FOUND',
				U53: 'PSP REQUEST PAY DEBIT ACKNOWLEDGEMENT NOT RECEIVED',
				U54: 'TRANSACTION ID OR AMOUNT IN CREDENTIAL BLOCK DOES NOT MATCH WITH THAT IN REQPAY',
				U55: 'MESSAGE INTEGRITY FAILED DUE TO ORGID MISMATCH',
				U56: 'NUMBER OF PAYEES DIFFERS FROM ORIGINAL REQUEST',
				U57: 'PAYEE AMOUNT DIFFERS FROM ORIGINAL REQUEST',
				U58: 'PAYER AMOUNT DIFFERS FROM ORIGINAL REQUEST',
				U59: 'PAYEE ADDRESS DIFFERS FROM ORIGINAL REQUEST',
				U60: 'PAYER ADDRESS DIFFERS FROM ORIGINAL REQUEST',
				U61: 'PAYEE INFO DIFFERS FROM ORIGINAL REQUEST',
				U62: 'PAYER INFO DIFFERS FROM ORIGINAL REQUEST',
				U63: 'DEVICE REGISTRATION FAILED IN UPI',
				U64: 'DATA TAG SHOULD CONTAIN 4 PARTS DURING DEVICE REGISTRATION',
				U65: 'CREDS BLOCK SHOULD CONTAIN CORRECT ELEMENTS DURING DEVICE REGISTRATION',
				U66: 'DEVICE FINGERPRINT MISMATCH',
				U67: 'DEBIT TIMEOUT',
				U68: 'CREDIT TIMEOUT',
				U69: 'COLLECT EXPIRED',
				U70: 'RECEIVED LATE RESPONSE',
				U71: 'MERCHANT CREDIT NOT SUPPORTED IN IMPS',
				U72: 'VAE FAILED',
				U74: 'PAYER ACCOUNT MISMATCH',
				U75: 'PAYEE ACCOUNT MISMATCH',
				U76: 'MOBILE BANKING REGISTRATION FORMAT NOT SUPPORTED BY THE ISSUER BANK',
				U77: 'MERCHANT BLOCKED',
				U78: 'BENEFICIARY BANK OFFLINE',
				U80: 'PAYER PSP THROTTLE DECLINE',
				U81: 'REMITTER BANK DEEMED CHECK DECLINE',
				U82: 'READ TIMEOUT IN REQPAY CREDIT',
				U84: 'BENEFICIARY BANK DEEMED CHECK DECLINE',
				U85: 'CONNECTION TIMEOUT IN REQPAY DEBIT',
				U86: 'REMITTER BANK THROTTLING DECLINE',
				U87: 'READ TIMEOUT IN REQPAY DEBIT',
				U88: 'CONNECTION TIMEOUT IN REQPAY CREDIT',
				U89: 'BENEFICIARY BANK THROTTLING DECLINE',
				U90: 'REMITTER BANK DEEMED HIGH RESPONSE TIME CHECK DECLINE',
				U91: 'BENEFICIARY BANK DEEMED HIGH RESPONSE TIME CHECK DECLINE',
				U92: 'PAYER PSP NOT AVAILABLE',
				U93: 'PAYEE PSP NOT AVAILABLE',
				U94: 'PAYEE PSP THROTTLE DECLINE',
				U95: 'PAYEE VPA AADHAAR OR IIN VPA IS DISABLED',
				// eslint-disable-next-line quotes
				U96: "PAYER AND PAYEE IFSC/ACNUM CAN'T BE SAME",
				U97: 'PSP REQUEST META ACKNOWLEDGEMENT NOT RECEIVED',
				U98: 'NULL ACK RECEIVED BY UPI FOR META TRANSACTION',
				U99: 'NEGATIVE ACK RECEIVED BY UPI FOR META TRANSACTION',
				5068: 'INVALID MANDATE SEQUENCE NUMBER'
			};
			let startDate = Moment(requestData?.start_date, 'YYYY-MM-DD').startOf('d');
			let endDate = Moment(requestData?.end_date, 'YYYY-MM-DD').endOf('d');
			let csvSubMenu = Utils.dateFeeder(startDate, endDate);
			startDate = Moment(requestData?.start_date, 'YYYY-MM-DD').startOf('d');
			startDate = Moment(requestData?.start_date, 'YYYY-MM-DD').startOf('d');
			let mandates = MandateRequestModel.find({
				...query,
				createdAt: {$gte: new Date(startDate), $lte: new Date(endDate)},
				status: {$nin: ['initiated', 'failed']}
			})
				.sort({_id: 1})
				.cursor();
			let filename = 'temp/report_' + Moment().format('YYYYMMDDHHmmsss') + '.csv';
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			let csvStream = Fs.createWriteStream(filename, {flags: 'a'});
			let csvMenu = [
				'S. No',
				'Customer Name',
				'Customer Id',
				'Store Name',
				'Store Id',
				'Phone Number',
				'Device Type',
				'Device Id',
				'Plan/Scheme Name',
				'Plan Id',
				'Amount',
				'Tenure Type',
				'EDI Due Amount / Tenure',
				'Current Status',
				'Date of Subscription to the Product',
				'First Collection Date',
				'EDI Bounced',
				'Total EDIs Recovered',
				'Total EDIs fallen Due',
				'DPD status',
				'Last EDI Received Date',
				'Last EDI Bounced',
				'Reason for Bounce'
			];
			csvStream.write(csvMenu.join(',') + ',' + csvSubMenu.join(',') + '\n');
			let serialNumber = 1;
			for await (let mandate of mandates) {
				// primary data filling area
				let csvString = `${serialNumber},"${mandate?.merchant?.name || ''}",${mandate?.merchant?.id},"${
					mandate?.store?.name || '-'
				}",${mandate?.store?.id || '-'},${mandate?.phone?.national_number || '-'}, ${
					mandate?.mandate_asset_details?.mandate_for || '-'
				},${mandate?.mandate_asset_details?.device_reference_id || '-'},${mandate?.plan?.plan_name || '-'},${
					mandate?.plan?.plan_id || '-'
				},${mandate?.mandate_amount || '-'},${mandate?.tenure?.type || '-'},${
					mandate?.subscription_fees || '-'
				},${mandate?.status || '-'}, ${
					mandate?.createdAt
						? MomentTimeZone(mandate?.createdAt).tz('Asia/Kolkata').format('DD/MMM/YYYY')
						: '-'
				},${
					mandate?.plan?.subscription_start
						? MomentTimeZone(mandate?.plan?.subscription_start).tz('Asia/Kolkata').format('DD/MMM/YYYY')
						: '-'
				}`;

				let status = await MandateTransactionModel.aggregate([
					{
						$match: {
							mandate_id: mandate?.mandate?.mandate_id,
							collection_date: {$gte: new Date(startDate), $lte: new Date(endDate)}
						}
					},
					{
						$group: {
							_id: '$collection_status',
							count: {$sum: 1}
						}
					}
				]);

				// failed and success count update area
				let failed = status.find((data) => data?._id === 'failed')?.count || 0;
				let success = status.find((data) => data?._id === 'success')?.count || 0;
				csvString += ',' + failed || 0;
				csvString += ',' + success || 0;

				// find no of edi require

				let ediCount = Math.floor(
					Moment(endDate).diff(
						mandate?.plan?.subscription_start,
						Utils.termFeeder(mandate?.tenure?.type) || 'd'
					)
				);
				csvString += ',' + ediCount || 0;

				// get all colletions
				let collections = await MandateTransactionModel.find({
					mandate_id: mandate?.mandate?.mandate_id,
					collection_date: {$gte: new Date(startDate), $lte: new Date(endDate)}
				})
					.sort({collection_date: -1})
					.lean();

				// last success and failed date and failed reason update area
				let lastSuccessDate = collections.find(
					(data) => data?.collection_status === 'success'
				)?.collection_date;
				let lastfailedDate = collections.find((data) => data?.collection_status === 'failed')?.collection_date;
				// dpd status update area
				csvString += ',';
				csvString += lastSuccessDate
					? Moment(endDate).diff(lastSuccessDate, Utils.termFeeder(mandate?.tenure?.type) || 'd')
					: '-';

				// success and failed date
				csvString += ',';
				csvString += lastSuccessDate
					? MomentTimeZone(lastSuccessDate).tz('Asia/Kolkata').format('DD/MMM/YYYY')
					: '-';
				csvString += ',';
				csvString += lastfailedDate
					? MomentTimeZone(lastfailedDate).tz('Asia/Kolkata').format('DD/MMM/YYYY')
					: '-';

				// last failed reason update area
				let internal = collections.find((data) => data?.collection_status === 'failed')?.internal
					?.collection_meta;
				if (internal) {
					internal = internal[internal?.length - 1];
					let failedReason =
						internal?.bank_details?.ResponseCode ||
						internal?.data?.bank_detials?.response ||
						internal?.bank_detials?.message;
					// eslint-disable-next-line security/detect-object-injection
					failedReason = errorMessages[failedReason] || failedReason;
					csvString += ',' + failedReason;
				} else {
					csvString += ',-';
				}

				for (let menuDate of csvSubMenu) {
					let collection =
						collections.find(
							(data) =>
								Moment(data?.collection_date)
									.startOf('d')
									.diff(Moment(menuDate, 'DD/MMM/yyyy'), 'd') === 0
						)?.collection_status || 'N/A';
					csvString += ',' + collection;
				}
				csvStream.write(csvString + '\n');
				serialNumber++;
			}
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			let reportFile = Fs.createReadStream(filename, {flags: 'r'});

			reportFile.on(
				'data',
				(data) => {
					response.write(Buffer.from(data).toString());
				},
				(error) => {
					if (error) {
						return response
							.status(400)
							.send({success: false, message: 'Something went wrong' + error.message});
					}
					reportFile.close();
				}
			);
			reportFile.on('close', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				Fs.unlinkSync(filename);
				return await response.end();
			});
		} catch (error) {
			return response.status(500).send({success: false, message: 'Something went wrong' + error.message});
		}
	},
	mandateAccknowledge: async (request) => {
		try {
			let reportFile = request?.file?.path;
			let workBook = Xlsx.readFile(reportFile);
			let sheetNames = workBook.SheetNames;
			let sheetData = Xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

			let reportLogs = {
				total_count: 0,
				mandate_missings: [],
				mandate_missing_count: 0,
				miss_matching_count: 0,
				miss_matching: [],
				success_count: 0
			};
			let mandate_for = request?.body?.mandate_for || 'sound_box';
			for await (let data of sheetData) {
				reportLogs.total_count++;
				let mandate = await MandateRequestModel.findOne({
					'mandate.mandate_id': data['Mandate Id'],
					'mandate_asset_details.mandate_for': mandate_for,
					'store.id': data['Store ID']
				});

				if (!mandate) {
					reportLogs.mandate_missings.push({mandate_id: data['Mandate Id'], row_no: data['S.no']});
					reportLogs.mandate_missing_count++;
					continue;
				}

				let amount = data['Payment'];
				let count = amount / mandate?.subscription_fees;
				let priceCheck = amount % mandate?.subscription_fees;

				let collections = await MandateTransactionModel.find({
					mandate_id: mandate?.mandate?.mandate_id,
					collection_status: 'failed',
					store_id: data['Store ID']
				}).sort({_id: 1});

				if (count > collections?.length || priceCheck !== 0) {
					reportLogs.miss_matching.push({mandate_id: data['Mandate Id'], row_no: data['S.No']});
					reportLogs.miss_matching_count++;
					continue;
				}

				collections = collections.slice(0, count);

				for await (let collection of collections) {
					collection.collection_status = 'acknowledged';
					collection.acknowledgements.reason = 'collected by agent';
					collection.acknowledgements.acknowledged_at = new Date();
					collection.acknowledgements.type = 'payment';
					collection.acknowledgements.meta.push({
						transaction_id: data['Transaction Id'],
						utr: data['UTR Number']
					});
					mandate.internal.logs.push({
						updated_on: new Date(),
						message: data['Comments']
					});
					collection.markModified('status');
					collection.markModified('acknowledgements');
					mandate.markModified('internal.logs');
					await collection.save();
					await mandate.save();
				}
				reportLogs.success_count++;
			}
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			Fs.unlinkSync(reportFile);
			return {
				error: false,
				message: 'mandate acknowledgements updated',
				data: reportLogs
			};
		} catch (error) {
			return {error: true, message: 'Something went wrong' + error.message};
		}
	}
};

module.exports = MandateController;
