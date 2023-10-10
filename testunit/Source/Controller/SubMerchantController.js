const Config = require('../App/Config');
const {isEmpty, networkCall} = require('../Helpers/Utils');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {app_error, app_warning} = require('../Helpers/Logger');

const SubMerchantController = {
	/**
	 * to fetch subMerchant Details
	 * @param loggedUser
	 * @param query
	 * @param merchantId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	list: async (loggedUser, query, merchantId) => {
		try {
			let options = {
				method: 'GET',
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/list',
				admin: loggedUser
			};
			let queryData = {role: 'subuser'};
			if (!isEmpty(merchantId)) {
				let existingMerchant = await findOneMerchant(
					{
						merchant_id: merchantId,
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
							status: 'active'
						},
						loggedUser,
						'Sub Merchant List'
					);
					return {
						error: true,
						message: 'Merchant Not Found!'
					};
				}

				queryData.merchant_id = merchantId;
			}

			if (!isEmpty(query)) {
				if (query?.limit) queryData.limit = query?.limit;
				if (query?.page) queryData.page = query?.page;
				if (query?.from_time) queryData.from_time = query?.from_time;
				if (query?.to_time) queryData.to_time = query?.to_time;
				if (query?.date_option) queryData.date_option = query?.date_option;
				if (query?.store_name) queryData.merchant_store_name = query?.store_name;
				if (query?.phone) queryData.phone = query?.phone;
				if (query?.merchant_name) queryData.merchant_name = query?.merchant_name;
				if (query?.status) queryData.status = query?.status;
				if (query?.request_for) queryData.request_for = query?.request_for;
				if (query?.merchant_id) {
					let existingMerchant = await findOneMerchant({merchant_id: query?.merchant_id}, '', true);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: query?.merchant_id},
							loggedUser,
							'Sub Merchant List'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					queryData.merchant_id = query?.merchant_id;
				}
			}

			let urlAppender = new URLSearchParams(queryData);
			options.url += '?' + urlAppender;

			let subMerchantList = await networkCall(options);
			if (subMerchantList?.error) app_error(subMerchantList?.error, {}, 'Sub Merchant List', loggedUser);
			let resultData = JSON.parse(subMerchantList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Something went wrong. Could not Fetch List.',
					resultData,
					loggedUser,
					'Sub Merchant List'
				);
				return {error: true, message: resultData?.message || 'Something went wrong. Could not Fetch List.'};
			}
			return {error: false, message: 'SubMerchants list are', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sub Merchant List', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * delete submerchant
	 * @param loggedUser
	 * @param subMerchantId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	deleteSubMerchant: async (loggedUser, subMerchantId) => {
		try {
			let existingMerchant = await findOneMerchant({merchant_id: subMerchantId, role: 'subuser'}, '', true);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: subMerchantId, role: 'subuser'},
					loggedUser,
					'Sub Merchant Delete'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			let options = {
				method: 'DELETE',
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/delete/' + subMerchantId,
				admin: loggedUser
			};

			let subMerchantData = await networkCall(options);
			if (subMerchantData?.error) app_error(subMerchantData?.error, {}, 'Sub Merchant Delete', loggedUser);
			let resultData = JSON.parse(subMerchantData?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Cannot delete SubMerchant,Something went wrong',
					resultData,
					loggedUser,
					'Sub Merchant Delete'
				);
				return {error: true, message: resultData?.message || 'Cannot delete SubMerchant,Something went wrong'};
			}
			return {error: false, message: 'Deleted subMerchant is', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sub Merchant Delete', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 * to update subMerchant details
	 * @param loggedUser
	 * @param requestData
	 * @param subMerchantId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */

	update: async (requestData, loggedUser, subMerchantId) => {
		try {
			let subMerchantBody = {};
			let existingMerchant = await findOneMerchant(
				{
					merchant_id: subMerchantId,
					role: 'subuser',
					status: 'active'
				},
				'',
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{
						merchant_id: subMerchantId,
						role: 'subuser',
						status: 'active'
					},
					loggedUser,
					'Sub Merchant Update'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			} else {
				if (!isEmpty(requestData?.email)) {
					subMerchantBody.email = {primary: requestData?.email};
				}

				if (!isEmpty(requestData?.phone)) {
					let existingPhoneNumber = await findOneMerchant(
						{'phone.national_number': requestData?.phone, merchant_id: {$ne: subMerchantId}},
						{},
						true
					);
					if (!isEmpty(existingPhoneNumber)) {
						app_warning(
							'Phone Number Already Exists!',
							{'phone.national_number': requestData?.phone, merchant_id: {$ne: subMerchantId}},
							loggedUser,
							'Sub Merchant Update'
						);
						return {error: true, message: 'Phone Number Already Exists!'};
					}
					subMerchantBody.phone = {national_number: requestData?.phone};
				}

				if (!isEmpty(requestData?.merchant_name)) {
					subMerchantBody.name = {full: requestData?.merchant_name};
				}

				let options = {
					method: 'PATCH',
					url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/update/' + subMerchantId,
					body: subMerchantBody,
					admin: loggedUser
				};
				let subMerchantData = await networkCall(options);
				if (subMerchantData?.error) app_error(subMerchantData?.error, {}, 'Sub Merchant Update', loggedUser);
				let resultData = JSON.parse(subMerchantData?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message || 'Cannot update.Something went wrong',
						resultData,
						loggedUser,
						'Sub Merchant Update'
					);
					return {error: true, message: resultData?.message || 'Cannot update.Something went wrong'};
				}
				return {error: false, message: 'Updated subMerchant details are ', data: resultData?.data};
			}
		} catch (error) {
			app_error(error, {}, 'Sub Merchant Update', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 * to change the status
	 * @param loggedUser
	 * @param subMerchantId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */

	changeStatus: async (loggedUser, subMerchantId) => {
		try {
			let existingMerchant = await findOneMerchant({merchant_id: subMerchantId, role: 'subuser'}, '', true);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: subMerchantId, role: 'subuser'},
					loggedUser,
					'Sub Merchant Change Status'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			let options = {
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/change-status/' + subMerchantId,
				method: 'PATCH',
				admin: loggedUser
			};

			let statusChange = await networkCall(options);
			if (statusChange?.error) app_error(statusChange?.error, {}, 'Sub Merchant Status Change', loggedUser);
			let resultData = JSON.parse(statusChange?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Status cannot be changed.Something went wrong',
					resultData,
					loggedUser,
					'Sub Merchant Change Status'
				);
				return {error: true, message: resultData?.message || 'Status cannot be changed.Something went wrong'};
			}
			return {error: false, message: 'Status changed', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sub Merchant Status Change', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 * to fetch subMerchant details
	 * @param loggedUser
	 * @param subMerchantId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */

	details: async (loggedUser, subMerchantId) => {
		try {
			let existingMerchant = await findOneMerchant({merchant_id: subMerchantId, role: 'subuser'}, '', true);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: subMerchantId, role: 'subuser'},
					loggedUser,
					'Sub Merchant Details'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			} else {
				let options = {
					method: 'GET',
					url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/details/' + subMerchantId,
					admin: loggedUser
				};

				let subMerchDetails = await networkCall(options);
				if (subMerchDetails?.error) app_error(subMerchDetails?.error, {}, 'Sub Merchant Details', loggedUser);
				let resultData = JSON.parse(subMerchDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message || 'Could not fetch Details',
						resultData,
						loggedUser,
						'Sub Merchant Details'
					);
					return {error: true, message: resultData?.message || 'Could not fetch Details'};
				}
				return {error: false, message: 'SubMerchant Details are', data: resultData?.data};
			}
		} catch (error) {
			app_error(error, {}, 'Sub Merchant Details', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	}
};
module.exports = SubMerchantController;
