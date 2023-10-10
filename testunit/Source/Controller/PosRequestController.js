const {isEmpty, networkCall} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');

const PosRequestController = {
	/**
	 * list
	 * @param {*} query - query's is string or object
	 * @param merchantId
	 * @param storeId
	 * @param loggedUser
	 * @returns {*}
	 */
	list: async (query, merchantId, storeId, loggedUser) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query.limit + '&';
		}
		if (query.page) {
			queryString += 'page=' + query.page + '&';
		}
		if (query.name) {
			queryString += 'name=' + query.name + '&';
		}
		if (query.merchant_id) {
			queryString += 'merchant_id=' + query.merchant_id + '&';
		}
		if (query.mcc) {
			queryString += 'mcc=' + query.mcc + '&';
		}
		if (query.transaction_id) {
			queryString += 'transaction_id=' + query.transaction_id + '&';
		}
		if (query.mandate_id) {
			queryString += 'mandate_id=' + query.mandate_id + '&';
		}
		if (query.payment_status) {
			queryString += 'payment_status=' + query.payment_status + '&';
		}
		if (query.from_date) {
			queryString += 'from_date=' + query.from_date + '&';
		}
		if (query.to_date) {
			queryString += 'to_date=' + query.to_date + '&';
		}
		if (query.pos_status) {
			queryString += 'pos_status=' + query.pos_status + '&';
		}
		if (query.store_name) {
			queryString += 'store_name=' + query.store_name + '&';
		}
		if (query.store_id) {
			queryString += 'store_id=' + query.store_id + '&';
		}
		if (query.merchant_name) {
			queryString += 'merchant_name=' + query.merchant_name + '&';
		}
		if (query.pos_request_id) {
			queryString += 'pos_request_id=' + query.pos_request_id + '&';
		}
		if (merchantId) {
			queryString += 'merchant_id=' + merchantId + '&';
		}
		if (storeId) {
			queryString += 'store_id=' + storeId;
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/request/list?' + queryString
		};
		try {
			let posRequestList = await networkCall(options);
			if (posRequestList?.error) app_error(posRequestList?.error, {}, 'POS Request List', loggedUser);
			let result = JSON.parse(posRequestList?.body);
			if (!result?.success) {
				app_warning('There is no pos_request list', result, loggedUser, 'POS Request List');
				return {
					error: true,
					message: 'There is no pos_request list'
				};
			}
			return {error: false, message: result?.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'POS Request List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * PosRequest details
	 * @param {string} requestId
	 * @param loggedUser
	 * @returns {*}
	 */
	detail: async (requestId, loggedUser) => {
		if (isEmpty(requestId)) {
			app_warning('Pos request id is not found', {pos_request_id: requestId}, loggedUser, 'POS Request Details');
			return {error: true, message: 'Pos request id is not found'};
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/request/detail/' + requestId
		};
		try {
			let posRequestDetails = await networkCall(options);
			if (posRequestDetails?.error) app_error(posRequestDetails?.error, {}, 'POS Request Details', loggedUser);
			let result = await JSON.parse(posRequestDetails?.body);
			if (!result?.success) {
				app_warning('There is no pos_request details', result, loggedUser, 'POS Request Details');
				return {
					error: true,
					message: 'There is no pos_request details'
				};
			}
			return {error: false, message: result?.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'POS Request Details', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * To change pos status
	 * @param {*} requestData
	 * @param {*} requestId
	 */
	changePosStatus: async (requestData, requestId) => {
		if (isEmpty(requestData)) {
			app_warning(
				'pos_status update value is empty',
				{'request.body': requestData},
				requestData?.loggedUser,
				'Change Status POS'
			);
			return {error: true, message: 'pos_status update value is empty'};
		} else {
			let posStatusData = {};
			posStatusData['admin'] = {
				id: requestData.loggedUser.id || '',
				name: requestData.loggedUser.name || ''
			};
			posStatusData['pos_status'] = requestData.pos_status ?? 'pending';
			if (requestData.pos_status === 'completed') {
				posStatusData['mid'] = requestData.mid ?? '';
			}
			let options = {
				method: 'PATCH',
				url: CONFIG.SERVICE.POS_SERVICE_URL + '/transaction/pos-status/change/' + requestId,
				headers: {
					'Content-Type': 'application/json'
				},
				body: posStatusData
			};
			try {
				let transactionData = await networkCall(options);
				if (transactionData?.error)
					app_error(transactionData?.error, {}, 'POS Change Status', requestData?.loggedUser);
				let result = JSON.parse(transactionData.body);
				if (!result?.success) {
					app_warning('pos status is not update', result, requestData?.loggedUser, 'POS Change Status');
					return {
						error: true,
						message: 'pos status is not update'
					};
				}
				return {error: false, message: result?.message, data: result?.data};
			} catch (error) {
				app_error(error, {}, 'POS Change Status', requestData?.loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},
	/**
	 * pos reject reason
	 * @param {*} requestData
	 * @param {*} requestId
	 */
	RejectReason: async (requestData, requestId) => {
		let rejectReasonData = {
			admin: {
				id: requestData.loggedUser.id,
				name: requestData.loggedUser.name
			},
			reject_reason: requestData.reject_reason
		};

		let options = {
			method: 'PATCH',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/transaction/reject/reason/' + requestId,
			body: rejectReasonData
		};

		try {
			let transactionData = await networkCall(options);
			if (transactionData?.error)
				app_error(transactionData?.error, {}, 'POS reject reason', requestData?.loggedUser);
			let result = JSON.parse(transactionData.body);
			if (!result.success) {
				app_warning('Pos reject reason is not update', {}, requestData?.loggedUser, 'POS reject reason');
				return {
					error: true,
					message: 'Pos reject reason is not update'
				};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'POS reject reason', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 *
	 * @param query
	 * @param loggedUser
	 * @returns
	 */
	planList: async (query, loggedUser) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query.limit + '&';
		}
		if (query.page) {
			queryString += 'page=' + query.page + '&';
		}
		if (query.plan_id) {
			queryString += 'plan_id=' + query.plan_id + '&';
		}
		if (query.sortBy) {
			queryString += 'sortBy=' + query.sortBy + '&';
		}
		if (query.plan_name) {
			queryString += 'plan_name=' + query.plan_name;
		}

		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/plan/list' + queryString
		};
		// eslint-disable-next-line no-console
		console.log(options);
		try {
			let planList = await networkCall(options);
			if (planList?.error) app_error(planList?.error, {}, 'Plan List', loggedUser);
			let result = JSON.parse(planList?.body);

			if (!result?.success) {
				app_warning('There is no plan list', result, loggedUser, 'Plan List');
				return {
					error: true,
					message: 'There is no plan list'
				};
			}
			if (query.dropdown_for === 'pos') {
				let planListData = [];
				for (let plan of result.data) {
					planListData.push({plan_id: plan?.plan_id, plan_name: plan?.plan_name});
				}
				return {error: false, message: 'Plan Dropdown List', data: planListData};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Plan List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = PosRequestController;
