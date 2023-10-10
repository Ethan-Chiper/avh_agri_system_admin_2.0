const Config = require('../App/Config');
const {isEmpty, networkCall} = require('../Helpers/Utils');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {findOneStore} = require('../Repository/StoreRepository');
const {app_error, app_warning} = require('../Helpers/Logger');

const VpaController = {
	/**
	 * to fetch the vpa list of a merchant
	 * @param loggedUser
	 * @param postData
	 * @param request
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	list: async (loggedUser, postData, request) => {
		try {
			let merchantId = request?.merchantId;
			let storeId = request?.storeId;
			let options = {
				method: 'GET',
				url: Config.SERVICE.BANKING_SERVICE_URL + '/vpa/vpa-list',
				admin: loggedUser
			};

			if (!isEmpty(merchantId)) {
				let existingMerchant = await findOneMerchant({merchant_id: merchantId, role: 'merchant'}, '', true);
				if (isEmpty(existingMerchant)) {
					app_warning(
						'Merchant Not Found!',
						{merchant_id: merchantId, role: 'merchant'},
						loggedUser,
						'VPA List'
					);
					return {
						error: true,
						message: 'Merchant Not Found!'
					};
				}
				options.url = options.url + '/' + merchantId;
				if (!isEmpty(storeId)) {
					let existingStore = await findOneStore({merchant_id: merchantId, store_id: storeId}, '', true);
					if (isEmpty(existingStore)) {
						app_warning(
							'Store Not Found!',
							{merchant_id: merchantId, store_id: storeId},
							loggedUser,
							'VPA List'
						);
						return {error: true, message: 'Store Not Found!'};
					}
					options.url = options.url + '/' + storeId;
				}
			}

			if (!isEmpty(postData)) {
				let queryData = {};
				if (postData?.limit) {
					queryData.limit = postData?.limit;
				}
				if (postData?.page) {
					queryData.page = postData?.page;
				}
				if (postData?.vpa_name) {
					queryData.vpa_name = postData?.vpa_name;
				}
				if (postData?.acc_no) {
					queryData.acc_no = postData?.acc_no;
				}
				if (postData?.vpaId) {
					queryData.vpaId = postData?.vpaId;
				}

				let urlAppender = new URLSearchParams(queryData);
				options.url += '?' + urlAppender;
			}
			let vpaList = await networkCall(options);
			if (vpaList?.error) app_error(vpaList?.error, {}, 'VPA List', loggedUser);
			let resultData = JSON.parse(vpaList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'There is no vpa list', resultData, loggedUser, 'VPA List');
				return {error: true, message: resultData?.message || 'There is no vpa list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'VPA List', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to fetch vpa details
	 * @param loggedUser
	 * @param vpaId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	details: async (loggedUser, vpaId) => {
		try {
			let options = {
				method: 'GET',
				url: Config.SERVICE.BANKING_SERVICE_URL + '/vpa/details/' + vpaId,
				admin: loggedUser
			};
			let vpaDetails = await networkCall(options);
			if (vpaDetails?.error) app_error(vpaDetails?.error, {}, 'VPA Details', loggedUser);
			let resultData = JSON.parse(vpaDetails?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Cannot Fetch Details.Something went wrong',
					resultData,
					loggedUser,
					'VPA details'
				);
				return {error: true, message: resultData?.message || 'Cannot Fetch Details.Something went wrong'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'VPA Details', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 * to create vpa for a merchant
	 * @param loggedUser
	 * @param requestData
	 * @param merchantId
	 * @returns {Promise<{error: boolean, message: string}>}
	 */
	create: async (loggedUser, requestData, merchantId) => {
		try {
			let storeId = requestData?.store_id;
			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					role: 'merchant',
					status: 'active'
				},
				'',
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{
						merchant_id: merchantId,
						role: 'merchant',
						status: 'active'
					},
					loggedUser,
					'VPA create'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			let existingStore = await findOneStore({merchant_id: merchantId, store_id: storeId}, '', true);
			if (isEmpty(existingStore)) {
				app_warning('Store Not Found!', {merchant_id: merchantId, store_id: storeId}, loggedUser, 'VPA create');
				return {error: true, message: 'Store Not Found!'};
			}

			let vpaData = {
				merchant: {
					merchant_id: merchantId
				},
				store: {
					store_id: requestData?.store_id
				},
				beneficiary_id: requestData.beneficiary_id,
				vpa_name: requestData?.vpa_name,
				submer_type: requestData?.submer_type || 'p2pm'
			};

			let options = {
				url: Config.SERVICE.BANKING_SERVICE_URL + '/vpa/create',
				method: 'POST',
				body: vpaData,
				admin: loggedUser
			};

			let vpaResult = await networkCall(options);
			if (vpaResult?.error) app_error(vpaResult?.error, {}, 'VPA create', loggedUser);
			let resultData = JSON.parse(vpaResult?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Vpa Cannot Be Created.Something wrong',
					resultData,
					loggedUser,
					'VPA create'
				);
				return {error: true, message: resultData?.message || 'Vpa Cannot Be Created.Something wrong'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'VPA create', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to update vpa details
	 * @param loggedUser
	 * @param requestData
	 * @param vpaId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */

	update: async (loggedUser, requestData, vpaId) => {
		try {
			let merchantId = requestData?.merchant_id;
			let storeId = requestData?.store_id;
			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					role: 'merchant',
					status: 'active'
				},
				'',
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, role: 'merchant', status: 'active'},
					loggedUser,
					'VPA update'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			let existingStore = await findOneStore({merchant_id: merchantId, store_id: storeId}, '', true);
			if (isEmpty(existingStore)) {
				app_warning('Store Not Found!', {merchant_id: merchantId, store_id: storeId}, loggedUser, 'VPA update');
				return {error: true, message: 'Store Not Found!'};
			}
			let updateVpaData = {
				merchant: {
					merchant_id: requestData?.merchant_id
				},
				store: {
					store_id: requestData?.store_id
				},
				beneficiary_id: requestData?.beneficiary_id,
				vpa: vpaId
			};

			let options = {
				url: Config.SERVICE.BANKING_SERVICE_URL + '/vpa/update',
				method: 'POST',
				body: updateVpaData,
				admin: loggedUser
			};

			let updateVpaResult = await networkCall(options);
			if (updateVpaResult?.error) app_error(updateVpaResult?.error, {}, 'VPA update', loggedUser);
			let resultData = JSON.parse(updateVpaResult?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'Vpa cannot be updated!', resultData, loggedUser, 'VPA update');
				return {error: true, message: resultData?.message || 'Vpa cannot be updated!'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'VPA update', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to change the vpa status
	 * @param loggedUser
	 * @param requestData
	 * @param requestId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{data: {}, error: boolean, message: string}>}
	 */
	statusChange: async (loggedUser, requestData, requestId) => {
		try {
			let merchantId = requestId?.merchantId;
			let storeId = requestId?.storeId;
			let vpa = requestData?.vpa;

			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					role: 'merchant',
					status: 'active'
				},
				'',
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{
						merchant_id: merchantId,
						role: 'merchant',
						status: 'active'
					},
					loggedUser,
					'VPA Status Change'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			if (!isEmpty(storeId)) {
				let existingStore = await findOneStore({merchant_id: merchantId, store_id: storeId}, '', true);
				if (isEmpty(existingStore)) {
					app_warning(
						'Store Not Found!',
						{merchant_id: merchantId, store_id: storeId},
						loggedUser,
						'VPA Status Change'
					);
					return {error: true, message: 'Store Not Found!'};
				}
			}

			let options = {
				url: Config.SERVICE.BANKING_SERVICE_URL + '/vpa/change-status',
				method: 'PATCH',
				body: {vpa},
				admin: loggedUser
			};
			let statusVpaResult = await networkCall(options);
			if (statusVpaResult?.error) app_error(statusVpaResult?.error, {}, 'VPA change status', loggedUser);
			let resultData = JSON.parse(statusVpaResult?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Status Cannot Be Changed.',
					resultData,
					loggedUser,
					'VPA Status Change'
				);
				return {error: true, message: resultData?.message || 'Status Cannot Be Changed.'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'VPA change status', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	}
};

module.exports = VpaController;
