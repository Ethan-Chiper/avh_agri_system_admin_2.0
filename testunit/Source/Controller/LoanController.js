const {networkCall, isEmpty} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {app_warning, app_error} = require('../Helpers/Logger');
const Request = require('request');

const LoanController = {
	/**
	 * To get loan list
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	loanList: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.merchant_id) {
					let existingMerchant = await findOneMerchant({merchant_id: queryData?.merchant_id}, '', true);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: queryData?.merchant_id},
							loggedUser,
							'Loan List'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					query.merchant_id = queryData?.merchant_id;
				}
				if (queryData?.loan_id) query.loan_id = queryData?.loan_id;
				if (queryData?.loan_status) query.loan_status = queryData?.loan_status;
				if (queryData?.mandate_status) query.mandate_status = queryData?.mandate_status;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.from_date) query.from_date = queryData?.from_date;
				if (queryData?.to_date) query.to_date = queryData?.to_date;
				if (queryData?.eligible_loan_id) query.eligible_loan_id = queryData?.eligible_loan_id;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.phone_number) query.phone_number = queryData?.phone_number;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let loanList = await networkCall(options);
			if (loanList?.error) {
				app_error(loanList?.error, {}, 'Loan List', loggedUser);
			}
			let resultData = JSON.parse(loanList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'There is no loan list', resultData, loggedUser, 'Loan Details');
				return {error: true, message: resultData?.message || 'There is no loan list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},
	/**
	 * To get loan details
	 * @param loggedUser
	 * @param merchantId
	 * @param loanId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	loanDetails: async (loggedUser, merchantId, loanId) => {
		let existingMerchant = await findOneMerchant({merchant_id: merchantId}, {}, true);
		if (isEmpty(existingMerchant)) {
			app_warning('Merchant Not Found!', {merchant_id: merchantId}, loggedUser, 'Merchant Details');
			return {error: true, message: 'Merchant Not Found!'};
		} else {
			try {
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/detail/' + merchantId + '/' + loanId,
					admin: loggedUser
				};
				let loanDetails = await networkCall(options);
				if (loanDetails?.error) {
					app_error(loanDetails?.error, {}, 'Loan Details', loggedUser);
				}
				let resultData = JSON.parse(loanDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message || 'Something went wrong while fetching loan details, Please try later',
						resultData,
						loggedUser,
						'Loan Details'
					);
					return {
						error: true,
						message: resultData?.message || 'Something went wrong while fetching, please try later.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data || {}};
			} catch (error) {
				app_error(error, {}, 'Loan Details', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again.'};
			}
		}
	},
	/**
	 * To Update loan
	 * @param request
	 * @returns {Promise<{data, error: boolean, message}|{error: boolean, message: string}>}
	 */
	update: async (request) => {
		let loanUpdatedData;
		let requestData = request?.body;
		let loggedUser = requestData?.loggedUser;
		if (isEmpty(requestData)) {
			return {error: true, message: 'Requested data not found'};
		}
		let userIp =
			(request?.headers['x-forwarded-for'] || '').split(',').pop().trim() || request?.connection?.remoteAddress;
		loanUpdatedData =
			requestData?.loan_status === 'approved'
				? {
						merchant_id: requestData?.merchant_id,
						loan_id: requestData?.loan_id,
						nbfc_loan_id: requestData?.nbfc_loan_id,
						loan_status: requestData?.loan_status,
						fixed_daily_repayment: requestData?.fixed_daily_repayment,
						first_emi_date: requestData?.first_emi_date,
						loan_amount: requestData?.loan_amount,
						interest: requestData?.interest,
						tenure: requestData?.tenure,
						agent_id: requestData?.agent_id,
						tl_id: requestData?.tl_id,
						asm_id: requestData?.asm_id,
						modifier: {
							id: requestData?.modifier?.id ?? loggedUser?.id,
							ip: userIp,
							role: requestData?.modifier?.role ?? loggedUser?.role,
							name: requestData?.modifier?.name ?? loggedUser?.name
						}
				  }
				: {
						merchant_id: requestData?.merchant_id,
						loan_id: requestData?.loan_id,
						loan_status: requestData?.loan_status,
						modifier: {
							id: requestData?.modifier?.id ?? loggedUser?.id,
							ip: userIp,
							role: requestData?.modifier?.role ?? loggedUser?.role,
							name: requestData?.modifier?.name ?? loggedUser?.name
						}
				  };
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/update',
			body: loanUpdatedData
		};
		try {
			let updatedLoanData = await networkCall(options);
			if (updatedLoanData?.error) app_error(updatedLoanData?.error, {}, 'Loan Update', loggedUser);
			let result = JSON.parse(updatedLoanData?.body);
			if (!result?.success) {
				app_warning('loan is not update', result, loggedUser, 'Loan Update');
				return {error: true, message: result?.message || 'loan is not update'};
			}
			return {error: false, message: result?.message};
		} catch (error) {
			app_error(error, {}, 'Loan Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To get settlement list
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	settlementList: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/upi-mandate/settlement/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.loan_id) query.loan_id = queryData?.loan_id;
				if (queryData?.enach_transaction_id) query.enach_transaction_id = queryData?.enach_transaction_id;
				if (queryData?.user_onboard_id) query.user_onboard_id = queryData?.user_onboard_id;
				if (queryData?.emi_id) query.emi_id = queryData?.emi_id;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.settlement_id) query.settlement_id = queryData?.settlement_id;
				if (queryData?.settlement_from_date) query.settlement_from_date = queryData?.settlement_from_date;
				if (queryData?.settlement_to_date) query.settlement_to_date = queryData?.settlement_to_date;
				if (queryData?.settlement_date_option) query.settlement_date_option = queryData?.settlement_date_option;
				if (queryData?.transaction_from_date) query.transaction_from_date = queryData?.transaction_from_date;
				if (queryData?.transaction_to_date) query.transaction_to_date = queryData?.transaction_to_date;
				if (queryData?.transaction_date_option)
					query.transaction_date_option = queryData?.transaction_date_option;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let loanSettlementList = await networkCall(options);
			if (loanSettlementList?.error) {
				app_error(loanSettlementList?.error, {}, 'Loan Settlement List', loggedUser);
			}
			let resultData = JSON.parse(loanSettlementList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan settlement list',
					resultData,
					loggedUser,
					'Loan Settlement List'
				);
				return {error: true, message: resultData?.message || 'There is no loan settlement list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Settlement List', loggedUser);
			return {error: true, message: 'Something Went wrong'};
		}
	},

	/**
	 * To get settlement detail
	 * @param queryData
	 * @param settlementId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	settlementDetail: async (queryData, settlementId, loggedUser) => {
		try {
			if (isEmpty(settlementId)) {
				app_warning(
					'settlement id is not found',
					{settlement_id: settlementId},
					loggedUser,
					'Settlement Details'
				);
				return {error: true, message: 'settlement id is not found'};
			}
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/upi-mandate/settlement/details/' + settlementId,
				admin: loggedUser
			};
			let loanSettlementDetail = await networkCall(options);
			if (loanSettlementDetail?.error) {
				app_error(loanSettlementDetail?.error, {}, 'Loan Settlement Details', loggedUser);
			}
			let resultData = JSON.parse(loanSettlementDetail?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan settlement details',
					resultData,
					loggedUser,
					'Loan Settlement Details'
				);
				return {error: true, message: resultData?.message || 'There is no loan settlement details'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Settlement Detail', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To Re Register loan
	 * @param request
	 * @param requestData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	reRegister: async (request, requestData) => {
		let reRegisterData = {};
		let loggedUser = requestData?.loggedUser;
		try {
			if (isEmpty(requestData)) {
				return {error: true, message: 'Request Data id is not found'};
			}
			let userIp =
				(request?.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
				request?.connection?.remoteAddress;
			reRegisterData = {
				loan_id: requestData?.loan_id,
				merchant_id: requestData?.merchant_id,
				modifier: {
					id: requestData?.modifier?.id ?? loggedUser?.id,
					ip: userIp,
					role: requestData?.modifier?.role ?? loggedUser?.role,
					name: requestData?.modifier?.name ?? loggedUser?.name
				}
			};
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/upi-mandate/re-register',
				body: reRegisterData
			};
			let reRegister = await networkCall(options);
			if (reRegister?.error) {
				app_error(reRegister?.error, {}, 'Loan Re-register', loggedUser);
			}
			let resultData = JSON.parse(reRegister?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan reregister',
					resultData,
					loggedUser,
					'Loan Re-register'
				);
				return {error: true, message: resultData?.message || 'There is no loan reregister'};
			}
			return {error: false, message: resultData?.message};
		} catch (error) {
			app_error(error, {}, 'Loan Re-register', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get loan stats data
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	loanStats: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/stats',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.from_date) query.from_date = queryData?.from_date;
				if (queryData?.to_date) query.to_date = queryData?.to_date;
				if (queryData?.date_option) query.date_option = queryData?.date_option;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let loanStats = await networkCall(options);
			if (loanStats?.error) {
				app_error(loanStats?.error, {}, 'Loan Stats', loggedUser);
			}
			let resultData = JSON.parse(loanStats?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'There is no loan stats', resultData, loggedUser, 'Loan Stats');
				return {error: true, message: resultData?.message || 'There is no loan stats'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Stats', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get collection stats
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	loanCollectionStats: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/collection-stats',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.from_date) query.from_date = queryData?.from_date;
				if (queryData?.to_date) query.to_date = queryData?.to_date;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.payment_mode) query.payment_mode = queryData?.payment_mode;
				if (queryData?.paid_status) query.paid_status = queryData?.paid_status;
				if (queryData?.notification_status) query.notification_status = queryData?.notification_status;
				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let loanStats = await networkCall(options);
			if (loanStats?.error) {
				app_error(loanStats?.error, {}, 'Loan Collection Stats', loggedUser);
			}
			let resultData = JSON.parse(loanStats?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan collection stats',
					resultData,
					loggedUser,
					'Loan Collection Stats'
				);
				return {error: true, message: resultData?.message || 'There is no loan collection stats'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Collection Stats', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get loan emi list
	 * @param queryData
	 * @param merchantId
	 * @param loanId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiList: async (queryData, merchantId, loanId, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/list/' + merchantId + '/' + loanId,
				admin: loggedUser
			};
			let query = {};
			if (queryData?.page) query.page = queryData?.page;
			if (queryData?.limit) query.limit = queryData?.limit;
			let urlAppender = new URLSearchParams(query);
			options.url += '?' + urlAppender;
			let loanEmiList = await networkCall(options);
			if (loanEmiList?.error) {
				app_error(loanEmiList?.error, {}, 'Loan Emi List', loggedUser);
			}
			let resultData = JSON.parse(loanEmiList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan emi list',
					resultData,
					loggedUser,
					'Loan Emi List'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Emi List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get loan emi detail
	 * @param emiId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiDetail: async (emiId, loggedUser) => {
		try {
			if (isEmpty(emiId)) {
				app_warning('loan emi id is not found', {emi_id: emiId}, loggedUser, 'Loan Emi Details');
				return {error: true, message: 'loan emi id is not found'};
			}
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/detail/' + emiId,
				admin: loggedUser
			};
			let loanEmiDetail = await networkCall(options);
			if (loanEmiDetail?.error) {
				app_error(loanEmiDetail?.error, {}, 'Loan Emi Details', loggedUser);
			}
			let resultData = JSON.parse(loanEmiDetail?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan emi details',
					resultData,
					loggedUser,
					'Loan Emi Details'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi details'};
			}
			let settlementOptions = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/upi-mandate/settlement/list?emi_id=' + emiId,
				admin: loggedUser
			};
			let settlement = await networkCall(settlementOptions);
			if (settlement?.error) {
				app_error(settlement?.error, {}, 'Settlement not found', loggedUser);
			}
			let resultSettlement = JSON.parse(settlement?.body);
			let settlementData = resultSettlement?.success;
			if (!settlementData) {
				app_warning(
					settlementData?.message || 'There is no settlement list',
					settlementData,
					loggedUser,
					'Settlement List'
				);
				return {error: true, message: resultData?.message || 'There is no settlement list'};
			}
			resultData.data.settlement = resultSettlement?.data;
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Emi Detail', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * Loan Emi Record Payment
	 * @param request
	 * @param requestData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiRecordPayment: async (request, requestData) => {
		let recordPaymentData = {};
		let loggedUser = requestData?.loggedUser;
		try {
			if (isEmpty(requestData)) {
				return {error: true, message: 'Request data is not found'};
			}
			let userIp =
				(request?.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
				request?.connection?.remoteAddress;
			recordPaymentData = {
				emi_id: requestData?.emi_id,
				loan_id: requestData?.loan_id,
				paid_amount: requestData?.paid_amount,
				paid_date: requestData?.paid_date,
				agent_id: requestData?.agent_id,
				utr_number: requestData?.utr_number,
				reason: requestData?.reason,
				merchant_id: requestData?.merchant_id,
				paid_status: requestData?.paid_status,
				payment_mode: requestData?.payment_mode,
				modifier: {
					id: requestData?.modifier?.id ?? loggedUser?.id,
					ip: userIp,
					role: requestData?.modifier?.role ?? loggedUser?.role,
					name: requestData?.modifier?.name ?? loggedUser?.name
				}
			};
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/record-payment',
				body: recordPaymentData
			};
			let emiRecordPayment = await networkCall(options);
			if (emiRecordPayment?.error) {
				app_error(emiRecordPayment?.error, {}, 'Loan Emi Record Payment', loggedUser);
			}
			let resultData = JSON.parse(emiRecordPayment?.body);
			if (resultData?.success === false) {
				app_warning(
					resultData?.message || 'There is no loan emi record payment',
					resultData,
					loggedUser,
					'Loan Emi Record Payment'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi record payment'};
			}
			return {error: false, message: resultData?.message};
		} catch (error) {
			app_error(error, {}, 'Loan Record Payment', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get loan emi all list
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiListAll: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/list-all',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.from_date) query.from_date = queryData?.from_date;
				if (queryData?.to_date) query.to_date = queryData?.to_date;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.merchant_id) query.merchant_id = queryData?.merchant_id;
				if (queryData?.paid_status) query.paid_status = queryData?.paid_status;
				if (queryData?.emi_id) query.emi_id = queryData?.emi_id;
				if (queryData?.loan_id) query.loan_id = queryData?.loan_id;
				if (queryData?.payment_mode) query.payment_mode = queryData?.payment_mode;
				if (queryData?.notification_status) query.notification_status = queryData?.notification_status;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let emiStats = await networkCall(options);
			if (emiStats?.error) {
				app_error(emiStats?.error, {}, 'Loan EMI Stats', loggedUser);
			}
			let resultData = JSON.parse(emiStats?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan emi stats',
					resultData,
					loggedUser,
					'Loan EMI Stats'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi stats'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan EMI Stats', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get EMI stats
	 * @param merchantId
	 * @param loanId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiStats: async (merchantId, loanId, loggedUser) => {
		let emiStatsData = {};
		try {
			if (isEmpty(merchantId)) {
				return {error: true, message: 'Merchant Id is not found'};
			}
			if (isEmpty(loanId)) {
				return {error: true, message: 'Loan Id is not found'};
			}
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/stats/' + merchantId + '/' + loanId,
				body: emiStatsData
			};
			let loanEmiStats = await networkCall(options);
			if (loanEmiStats?.error) {
				app_error(loanEmiStats?.error, {}, 'Loan Emi Stats', loggedUser);
			}
			let resultData = JSON.parse(loanEmiStats?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan emi stats',
					resultData,
					loggedUser,
					'Loan Emi Stats'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi stats'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data || {}};
		} catch (error) {
			app_error(error, {}, 'Loan Emi Stats', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To get EMI reschedule
	 * @param request
	 * @param requestData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	emiReschedule: async (request, requestData) => {
		let rescheduleData = {};
		let loggedUser = requestData?.loggedUser;
		try {
			if (isEmpty(requestData)) {
				return {error: true, message: 'Reschedule data is not found'};
			}
			let userIp =
				(request?.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
				request?.connection?.remoteAddress;
			rescheduleData = {
				loan_id: requestData?.loan_id,
				start_date: requestData?.start_date,
				merchant_id: requestData?.merchant_id,
				modifier: {
					id: requestData?.modifier?.id ?? loggedUser?.id,
					ip: userIp,
					role: requestData?.modifier?.role ?? loggedUser?.role,
					name: requestData?.modifier?.name ?? loggedUser?.name
				}
			};
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/emi/reschedule',
				body: rescheduleData
			};
			let emiReschedule = await networkCall(options);
			if (emiReschedule?.error) {
				app_error(emiReschedule?.error, {}, 'Loan Emi Reschedule', loggedUser);
			}
			let resultData = JSON.parse(emiReschedule?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no loan emi reschedule',
					resultData,
					loggedUser,
					'Loan Emi Reschedule'
				);
				return {error: true, message: resultData?.message || 'There is no loan emi reschedule'};
			}
			return {error: false, message: resultData?.message};
		} catch (error) {
			app_error(error, {}, 'Loan Reschedule', loggedUser);
			return {error: true, message: 'Something went wrong! Please try later.'};
		}
	},

	/**
	 * To Loan Status update
	 * @param request
	 * @returns {Promise<{data, error: boolean, message}|{error: boolean, message: string}>}
	 */
	updateLoanStatus: async (request) => {
		let requestData = request?.body;
		if (isEmpty(requestData)) {
			return {error: true, message: 'request data not found'};
		}
		let loggedUser = requestData?.loggedUser;
		let userIp =
			(request?.headers['x-forwarded-for'] || '').split(',').pop().trim() || request?.connection?.remoteAddress;
		let updatedStatusData = {
			loan_id: requestData?.loan_id,
			merchant_id: requestData?.merchant_id,
			modifier: {
				id: requestData?.modifier?.id ?? loggedUser?.id,
				ip: userIp,
				role: requestData?.modifier?.role ?? loggedUser?.role,
				name: requestData?.modifier?.name ?? loggedUser?.name
			}
		};
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.LOAN_SERVICE_URL + '/loan/update-loan-status',
			body: updatedStatusData
		};
		try {
			let updatedStatus = await networkCall(options);
			if (updatedStatus?.error) app_error(updatedStatusData?.error, {}, 'Loan Status Update', loggedUser || '');
			let result = JSON.parse(updatedStatus?.body);
			if (!result?.success) {
				app_warning('loan status is not updated', result, loggedUser, 'Loan Status Update');
				return {error: true, message: result?.message || 'loan status is not updated'};
			}
			return {error: false, message: result?.message};
		} catch (error) {
			app_error(error, {}, 'Loan Status Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	exportList: async (request, response) => {
		try {
			let queryData = request?.query;
			let url = CONFIG?.SERVICE?.LOAN_SERVICE_URL + '/report/loan-list';
			let index = 0;
			if (queryData?.merchant_id) {
				url += index > 0 ? `&merchant_id=${queryData?.merchant_id}` : `?merchant_id=${queryData?.merchant_id}`;
				index++;
			}
			if (queryData?.loan_status) {
				url += index > 0 ? `&loan_status=${queryData?.loan_status}` : `?loan_status=${queryData?.loan_status}`;
				index++;
			}
			if (queryData?.date_option) {
				url += index > 0 ? `&date_option=${queryData?.date_option}` : `?date_option=${queryData?.date_option}`;
				index++;
			}
			if (queryData?.eligible_loan_id) {
				url +=
					index > 0
						? `&eligible_loan_id=${queryData?.eligible_loan_id}`
						: `?eligible_loan_id=${queryData?.eligible_loan_id}`;
				index++;
			}
			if (queryData?.mandate_status) {
				url +=
					index > 0
						? `&mandate_status=${queryData?.mandate_status}`
						: `?mandate_status=${queryData?.mandate_status}`;
				index++;
			}
			if (queryData?.phone_number) {
				url +=
					index > 0 ? `&phone_number=${queryData?.phone_number}` : `?phone_number=${queryData?.phone_number}`;
				index++;
			}
			if (queryData?.from_date) {
				url += index > 0 ? `&from_date=${queryData?.from_date}` : `?from_date=${queryData?.from_date}`;
				index++;
			}
			if (queryData?.to_date) {
				url += index > 0 ? `&to_date=${queryData?.to_date}` : `?to_date=${queryData?.to_date}`;
				index++;
			}
			if (queryData?.loan_id) {
				url += index > 0 ? `&loan_id=${queryData?.loan_id}` : `?loan_id=${queryData?.loan_id}`;
				index++;
			}
			let postData = {
				url: url,
				method: 'GET'
			};
			let responseStream = Request(postData);
			responseStream.on(
				'data',
				(chunk) => {
					if (chunk?.toString()?.includes('"success":false')) {
						return response.status(400).send(JSON.parse(chunk.toString()));
					}
					response.write(chunk);
				},
				(error) => {
					if (error) {
						return response
							.status(400)
							.send({success: false, message: 'Something went wrong! Please try again'});
					}
					responseStream.end();
				}
			);

			responseStream.on('end', () => {
				return response.end();
			});
		} catch (error) {
			app_error(error, {}, 'Loan Status Update');
			return response.status(400).send({success: false, message: 'Something went wrong! Please try again'});
		}
	},
	exportCollection: async (request, response) => {
		try {
			let queryData = request?.query;
			let url = CONFIG?.SERVICE?.LOAN_SERVICE_URL + '/report/loan-collection';
			let index = 0;

			if (queryData?.paid_status) {
				url += index > 0 ? `&paid_status=${queryData?.paid_status}` : `?paid_status=${queryData?.paid_status}`;
				index++;
			}
			if (queryData?.date_option) {
				url += index > 0 ? `&date_option=${queryData?.date_option}` : `?date_option=${queryData?.date_option}`;
				index++;
			}
			if (queryData?.loan_id) {
				url += index > 0 ? `&loan_id=${queryData?.loan_id}` : `?loan_id=${queryData?.loan_id}`;
				index++;
			}
			if (queryData?.emi_id) {
				url += index > 0 ? `&emi_id=${queryData?.emi_id}` : `?emi_id=${queryData?.emi_id}`;
				index++;
			}
			if (queryData?.from_date) {
				url += index > 0 ? `&from_date=${queryData?.from_date}` : `?from_date=${queryData?.from_date}`;
				index++;
			}
			if (queryData?.to_date) {
				url += index > 0 ? `&to_date=${queryData?.to_date}` : `?to_date=${queryData?.to_date}`;
				index++;
			}
			let postData = {
				url: url,
				method: 'GET'
			};
			let responseStream = Request(postData);
			responseStream.on(
				'data',
				(chunk) => {
					if (chunk?.toString()?.includes('"success":false')) {
						return response.status(400).send(JSON.parse(chunk.toString()));
					}
					response.write(chunk);
				},
				(error) => {
					if (error) {
						return response
							.status(400)
							.send({success: false, message: 'Something went wrong! Please try again'});
					}
					responseStream.end();
				}
			);

			responseStream.on('end', () => {
				return response.end();
			});
		} catch (error) {
			app_error(error, {}, 'Loan Status Update');
			return response.status(400).send({success: false, message: 'Something went wrong! Please try again'});
		}
	},
	settlementListExport: async (request, response) => {
		try {
			let queryData = request?.query;
			let url = CONFIG.SERVICE.LOAN_SERVICE_URL + '/report/settlement-list';

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.loan_id) query.loan_id = queryData?.loan_id;
				if (queryData?.enach_transaction_id) query.enach_transaction_id = queryData?.enach_transaction_id;
				if (queryData?.user_onboard_id) query.user_onboard_id = queryData?.user_onboard_id;
				if (queryData?.emi_id) query.emi_id = queryData?.emi_id;
				if (queryData?.settlement_id) query.settlement_id = queryData?.settlement_id;
				if (queryData?.settlement_from_date) query.settlement_from_date = queryData?.settlement_from_date;
				if (queryData?.settlement_to_date) query.settlement_to_date = queryData?.settlement_to_date;
				if (queryData?.settlement_date_option) query.settlement_date_option = queryData?.settlement_date_option;
				if (queryData?.transaction_from_date) query.transaction_from_date = queryData?.transaction_from_date;
				if (queryData?.transaction_to_date) query.transaction_to_date = queryData?.transaction_to_date;
				if (queryData?.transaction_date_option)
					query.transaction_date_option = queryData?.transaction_date_option;

				let urlAppender = new URLSearchParams(query);
				url += '?' + urlAppender;
			}
			let responseStream = Request(url);
			responseStream.on(
				'data',
				(chunk) => {
					if (chunk?.toString()?.includes('"success":false')) {
						return response.status(400).send(JSON.parse(chunk.toString()));
					}
					response.write(chunk);
				},
				(error) => {
					if (error) {
						return response
							.status(400)
							.send({success: false, message: 'Something went wrong! Please try again'});
					}
					responseStream.end();
				}
			);

			responseStream.on('end', () => {
				return response.end();
			});
		} catch (error) {
			app_error(error, {}, 'Loan Status Update');
			return response.status(400).send({success: false, message: 'Something went wrong! Please try again'});
		}
	}
};

module.exports = LoanController;
