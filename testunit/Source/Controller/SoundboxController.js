const {networkCall} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');

const SoundboxController = {
	/**
	 * To view soundbox list
	 * @param user
	 * @param query
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	list: async (user, query) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query.limit;
		}
		if (query.page) {
			queryString += '&page=' + query.page;
		}
		if (query.sortBy) {
			queryString += '&sortBy=' + query.sortBy;
		}
		if (query.dsn_number) {
			queryString += '&dsn=' + query.dsn_number;
		}
		if (query.status) {
			queryString += '&status=' + query.status;
		}
		if (query.payment_status) {
			queryString += '&payment_status=' + query.payment_status;
		}
		if (query.language) {
			queryString += '&language=' + query.language;
		}
		if (query.merchant_id) {
			queryString += '&merchant_id=' + query.merchant_id;
		}
		if (query.store_id) {
			queryString += '&store_id=' + query.store_id;
		}
		if (query.trans_id) {
			queryString += '&trans_id=' + query.trans_id;
		}
		if (query.is_mapped) {
			let is_mapped = query.is_mapped === 'mapped';
			queryString += '&is_mapped=' + is_mapped;
		}
		if (query.vpa_id) {
			queryString += '&vpa=' + query.vpa_id;
		}
		if (query.soundbox_id) {
			queryString += '&soundbox_id=' + query.soundbox_id;
		}
		if (query.terminal_id) {
			queryString += '&terminal_id=' + query.terminal_id;
		}
		if (query.merchant_name) {
			queryString += '&merchant_name=' + query.merchant_name;
		}
		if (query.store_name) {
			queryString += '&store_name=' + query.store_name;
		}
		if (query.from_date) {
			queryString += '&from_date=' + query.from_date;
		}
		if (query.to_date) {
			queryString += '&to_date=' + query.to_date;
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/list?' + queryString
		};
		try {
			let soundboxlist = await networkCall(options);
			if (soundboxlist?.error) app_error(soundboxlist?.error, {}, 'Sound Box List', user);
			let result = JSON.parse(soundboxlist?.body);
			if (!result?.success) {
				app_warning('There is no sound box list', result, user, 'Sound Box List');
				return {
					error: true,
					message: 'There is no sound box list'
				};
			}
			return {error: false, message: result?.message, data: {soundboxList: result?.data}};
		} catch (error) {
			app_error(error, {}, 'Sound Box List', user);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * To view soundbox details
	 * @param loggedUser
	 * @param soundboxId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	soundboxDetails: async (loggedUser, soundboxId) => {
		try {
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/detail/' + soundboxId,
				admin: loggedUser
			};
			let soundboxDetails = await networkCall(options);
			if (soundboxDetails?.error) app_error(soundboxDetails?.error, {}, 'Sound Box Details', loggedUser);
			let resultData = JSON.parse(soundboxDetails?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message ||
						'Something went wrong while fetching sound box details. Please try again after sometimes.',
					resultData,
					loggedUser,
					'Sound Box Details'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong while fetching sound box details. Please try again after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sound Box Details', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * To change the status of the soundbox
	 * @param loggedUser
	 * @param soundboxId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{data: {}, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	changeStatus: async (loggedUser, soundboxId) => {
		try {
			let options = {
				url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/changestatus/' + soundboxId,
				method: 'PATCH',
				admin: loggedUser
			};
			let merchantStatusUpdate = await networkCall(options);
			if (merchantStatusUpdate?.error)
				app_error(merchantStatusUpdate?.error, {}, 'Sound Box Change Status', loggedUser);
			let resultData = JSON.parse(merchantStatusUpdate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Something went wrong. Could not update status. Please try after sometimes.',
					resultData,
					loggedUser,
					'Sound Box Change Status'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong. Could not update status. Please try after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sound Box Change Status', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = SoundboxController;
