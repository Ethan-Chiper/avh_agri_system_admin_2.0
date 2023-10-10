const Config = require('../App/Config');
const {isEmpty, networkCall} = require('../Helpers/Utils');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {app_error, app_warning} = require('../Helpers/Logger');

const InsuranceController = {
	/**
	 * dekhocreate function
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	dekhoCreate: async (loggedUser) => {
		try {
			let merchantId = Config?.MERCHANT_ID;
			let merchantData = await findOneMerchant({merchant_id: merchantId}, {}, true);
			if (isEmpty(merchantData)) {
				app_warning('Merchant Not Found!', {merchant_id: merchantId}, loggedUser, 'Insurance Create');
				return {error: true, message: 'Merchant Not Found!'};
			}
			let options = {
				url: Config.SERVICE.INSURANCE_SERVICE_URL + '/dekho/create',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: {merchant_id: merchantId}
			};
			let insurance = await networkCall(options);
			if (insurance?.error) app_error(insurance?.error, {}, 'Insurance Create', loggedUser);
			let resultData = JSON.parse(insurance?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'Creation Failed', resultData, loggedUser, 'Insurance Create');
				return {
					error: true,
					message: resultData?.message || 'Creation Failed'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Insurance Create', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * To get payout list
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	dekhoPayoutList: async (queryData, loggedUser) => {
		try {
			let options = {
				url: Config.SERVICE.INSURANCE_SERVICE_URL + '/dekho/payout/list',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			};
			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.merchant_id) query.merchant_id = queryData?.merchant_id;
				if (queryData?.insurance_id) query.insurance_id = queryData?.insurance_id;
				if (queryData?.policy_number) query.policy_number = queryData?.policy_number;
				if (queryData?.date_options) query.date_options = queryData?.date_options;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.from_date) query.from_date = queryData?.from_date;
				if (queryData?.to_date) query.to_date = queryData?.to_date;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}
			let insurance = await networkCall(options);
			if (insurance?.error) app_error(insurance?.error, {}, 'Insurance Payout List', loggedUser);
			let resultData = JSON.parse(insurance?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Insurance Payout List not found',
					resultData,
					loggedUser,
					'Insurance Payout List'
				);
				return {
					error: true,
					message: resultData?.message || 'Insurance Payout List not found'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Insurance Payout List', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	}
};
module.exports = InsuranceController;
