const {networkCall, isEmpty} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');
const {findOneStore} = require('../Repository/StoreRepository');

const SettlementController = {
	/**
	 * To view soundbox list
	 * @param user
	 * @param query
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	list: async (user, query) => {
		let queryString = '';
		if (query?.limit) {
			queryString += '&limit=' + query?.limit;
		}
		if (query.page && query.limit) {
			queryString += '&skip=' + query.limit * (query.page - 1);
		}
		if (query.sortBy) {
			queryString += '&sortBy=' + query.sortBy;
		}
		if (query.status) {
			queryString += '&status=' + query.status;
		}
		if (query?.from_time) {
			queryString += '&from_time=' + query?.from_time;
		}
		if (query?.to_time) {
			queryString += '&to_time=' + query.to_time;
		}
		if (query?.date_option) {
			queryString += '&date_option=' + query?.date_option;
		}
		if (query?.settlement_id) {
			queryString += '&settlement_id=' + query.settlement_id;
		}
		let queryParameters = '';
		if (query?.store_id) {
			let getMerchant = await findOneStore(
				{
					store_id: query?.store_id
				},
				{merchant_id: 1},
				true
			);
			queryParameters += getMerchant.merchant_id;
			queryParameters += '/' + query.store_id;
		}
		if (query?.merchant_id) {
			queryParameters += query?.merchant_id;
		}
		let url = '/list?' + queryString;
		if (!isEmpty(queryParameters)) {
			url = '/list/' + queryParameters + '?' + queryString;
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.SETTLEMENT_URL + url
		};
		try {
			let settlementList = await networkCall(options);
			if (settlementList?.error) app_error(settlementList?.error, {}, 'Settlement List', user);
			let result = JSON.parse(settlementList?.body);
			if (!result?.success) {
				app_warning('There is no settlement list', result, user, 'Settlement List');
				return {
					error: true,
					message: 'There is no settlement list'
				};
			}
			return {error: false, message: result?.message, data: {settlementList: result?.data}};
		} catch (error) {
			app_error(error, {}, 'Setttlement List', user);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * To view settlement details
	 * @param loggedUser
	 * @param settlementId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	SettlemtDetails: async (loggedUser, settlementId) => {
		try {
			let options = {
				method: 'GET',
				url: CONFIG.SERVICE.SETTLEMENT_URL + '/detail/' + settlementId
			};
			let settlementDetails = await networkCall(options);
			if (settlementDetails?.error) app_error(settlementDetails?.error, {}, 'Settlement Details', loggedUser);
			let resultData = JSON.parse(settlementDetails?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message ||
						'Something went wrong while fetching settlement details. Please try again after sometimes.',
					resultData,
					loggedUser,
					'Settlement Details'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong while fetching settlement details. Please try again after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Settlement Details', loggedUser);
			return {error: true, message: error.message || 'Something went wrong! Please try again'};
		}
	}
};

module.exports = SettlementController;
