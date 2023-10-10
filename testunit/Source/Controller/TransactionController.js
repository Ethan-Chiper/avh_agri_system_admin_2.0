const {networkCall, isEmpty} = require('../Helpers/Utils');
const Config = require('../App/Config');

const TransactionController = {
	/***
	 * Transaction list
	 * @returns {Promise<{data, error: boolean, message: *}>}
	 * @param request
	 */
	list: async (request) => {
		let query = request?.query;
		let merchantId = request?.params?.merchantId;
		let storeId = request?.params?.storeId;
		let queryString = '';
		if (query?.limit) {
			queryString += 'limit=' + query?.limit;
		}
		if (query?.page) {
			queryString += '&page=' + query?.page;
		}
		if (merchantId) {
			queryString += '&merchant_id=' + merchantId;
		}
		if (storeId) {
			queryString += '&store_id=' + storeId;
		}
		if (query?.merchant_id) {
			queryString += '&merchant_id=' + query?.merchant_id;
		}
		if (query?.store_id) {
			queryString += '&store_id=' + query?.store_id;
		}
		if (query?.merchant_name) {
			queryString += '&merchant_name=' + query?.merchant_name;
		}
		if (query?.store_name) {
			queryString += '&store_name=' + query?.store_name;
		}
		if (query?.trans_id) {
			queryString += '&trans_id=' + query?.trans_id;
		}
		if (query?.mode) {
			queryString += '&mode=' + query?.mode;
		}
		if (query?.from_time && query?.to_time) {
			queryString += '&from_time=' + query?.from_time + '&to_time=' + query?.to_time;
		}

		if (query?.date_option) {
			queryString += '&date_option=' + query?.date_option;
		}
		if (query?.status) {
			queryString += '&status=' + query?.status;
		}
		if (query?.utr_number) {
			queryString += '&utr_number=' + query?.utr_number;
		}
		if (query?.partner_name) {
			queryString += '&partner_name=' + query?.partner_name;
		}
		if (query?.partner_id) {
			queryString += '&partner_id=' + query?.partner_id;
		}
		//queryString += 'product=UPI&';

		let options = {
			method: 'GET',
			url: Config.SERVICE.TRANSACTION_SERVICE_URL + '/list?' + queryString
		};
		try {
			let TransactionList = await networkCall(options);
			let result = JSON.parse(TransactionList?.body);
			if (!result?.success) {
				return {
					error: true,
					message: result?.message || 'Something went wrong. Could not Fetch Transaction List.'
				};
			}
			return {error: false, message: result?.message, data: result.data};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/***
	 * transaction details
	 * @returns {Promise<{data, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 * @param requestData
	 */
	detail: async (requestData) => {
		let merchantId = requestData?.params?.merchantId;
		let transactionId = requestData?.params?.transactionId;
		if (isEmpty(merchantId)) {
			return {error: true, message: 'merchant id is not found'};
		}
		if (isEmpty(transactionId)) {
			return {error: true, message: 'transaction id is not found'};
		}
		let options = {
			method: 'GET',
			url: Config.SERVICE.TRANSACTION_SERVICE_URL + '/transaction-detail/' + merchantId + '/' + transactionId
		};
		try {
			let TransactionDetail = await networkCall(options);
			let result = JSON.parse(TransactionDetail?.body);
			if (!result?.success) {
				return {
					error: true,
					message: result?.message || 'Something went wrong. Could not Fetch Transaction Detail.'
				};
			}
			return {error: false, message: result?.message, data: result.data};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	export: async (query) => {
		let queryString = '';
		if (query?.limit) {
			queryString += 'limit=' + query?.limit + '&';
		}
		if (query?.page) {
			queryString += 'page=' + query?.page + '&';
		}
		if (query?.merchant_id) {
			queryString += 'merchant_id=' + query?.merchant_id + '&';
		}
		if (query?.store_id) {
			queryString += 'store_id=' + query?.store_id + '&';
		}
		if (query?.merchant_name) {
			queryString += 'merchant_name=' + query?.merchant_name + '&';
		}
		if (query?.trans_id) {
			queryString += 'trans_id=' + query?.trans_id + '&';
		}
		if (query?.mode) {
			queryString += 'mode=' + query?.mode + '&';
		}
		if (query?.product) {
			queryString += 'product=' + query?.product + '&';
		}
		if (query?.from_time && query?.to_time) {
			queryString += 'from_time=' + query?.from_time + '&to_time=' + query?.to_time;
		}
		if (query?.date_option) {
			queryString += 'date_option=' + query?.date_option + '&';
		}
		if (query?.status) {
			queryString += 'status=' + query?.status + '&';
		}
		if (query?.utr_number) {
			queryString += 'utr_number=' + query?.utr_number + '&';
		}

		let options = {
			method: 'GET',
			url: Config.SERVICE.TRANSACTION_SERVICE_URL + '/export?' + queryString
		};
		try {
			let transactionExport = await networkCall(options);
			let result = JSON.parse(transactionExport?.body);
			if (!result?.success) {
				return {
					error: true,
					message: 'There is no transaction export'
				};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = TransactionController;
