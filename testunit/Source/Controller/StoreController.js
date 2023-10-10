const {isEmpty, networkCall, getShortId} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {findOneStore} = require('../Repository/StoreRepository');
const {app_warning, app_error} = require('../Helpers/Logger');

const StoreController = {
	/**
	 * to create store
	 * @param storeCreateData
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	createStore: async (storeCreateData, merchantId) => {
		try {
			let existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, status: 'active', role: 'merchant'},
				{name: 1},
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active', role: 'merchant'},
					storeCreateData?.loggedUser,
					'Create Store'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}
			let storeId = getShortId();
			let existingStore = await findOneStore({merchant_id: merchantId}, '', true);
			if (isEmpty(existingStore)) {
				storeId = merchantId;
			}
			let storeName = storeCreateData?.name;
			let storeData = {
				merchant_id: merchantId,
				store_id: storeId,
				sub_merchant_id: storeCreateData?.sub_merchant_id || '',
				sub_merchant_name: storeCreateData?.sub_merchant_name || '',
				merchant_code: storeName.replace(/\W/g, '').toUpperCase() || '',
				phone: {
					is_verified: storeCreateData?.phone?.is_verified || false,
					national_number: storeCreateData?.phone || ''
				},
				name: {
					full: existingMerchant?.name?.full,
					store: storeName
				},
				business: {
					business_type: {
						code: storeCreateData?.business_code || '',
						name: storeCreateData?.store_category || '',
						subCategory: storeCreateData?.store_subCategory || ''
					},
					name: storeName
				},
				location: {
					agent_store: {
						street_name: storeCreateData?.location?.street_name || '',
						area: storeCreateData?.location?.area || '',
						city: storeCreateData?.location?.city || '',
						state: storeCreateData?.location?.state || '',
						pincode: storeCreateData?.location?.pincode || ''
					}
				},
				is_agent_onboard: false,
				terms: true,
				settlement_type: storeCreateData?.settlement_type || 'instant',
				settlement_mode: {
					imps: false,
					neft: true
				}
			};
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/create/' + merchantId,
				admin: storeCreateData?.loggedUser,
				body: storeData
			};

			let storeCreate = await networkCall(options);
			if (storeCreate?.error) app_error(storeCreate?.error, {}, 'Create Store', storeCreateData?.loggedUser);
			let resultData = JSON.parse(storeCreate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not create store. Please try again after sometime.',
					resultData,
					storeCreateData?.loggedUser,
					'Create Store'
				);
				return {
					error: true,
					message: resultData?.message || 'Could not create store. Please try again after sometime.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Create Store', storeCreateData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To update stores
	 * @param storeId
	 * @param storeUpdateDetails
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	updateStores: async (storeId, storeUpdateDetails) => {
		let storeData = {location: {agent_store: {}}, business: {business_type: {}}};
		let existingStore = await findOneStore({store_id: storeId, status: 'active'}, '', true);
		if (isEmpty(existingStore)) {
			app_warning(
				'Store Not Found!',
				{store_id: storeId, status: 'active'},
				storeUpdateDetails?.loggedUser,
				'Update Store'
			);
			return {error: true, message: 'Store Not Found!'};
		} else {
			try {
				if (!isEmpty(storeUpdateDetails?.email)) {
					storeData.email = {primary: storeUpdateDetails?.email};
				}

				if (!isEmpty(storeUpdateDetails?.phone)) {
					storeData.phone = {national_number: storeUpdateDetails?.phone};
				}

				if (!isEmpty(storeUpdateDetails?.location?.street_name)) {
					storeData.location.agent_store.street_name = storeUpdateDetails?.location?.street_name;
				}

				if (!isEmpty(storeUpdateDetails?.location?.area)) {
					storeData.location.agent_store.area = storeUpdateDetails?.location?.area;
				}

				if (!isEmpty(storeUpdateDetails?.location?.city)) {
					storeData.location.agent_store.city = storeUpdateDetails?.location?.city;
				}

				if (!isEmpty(storeUpdateDetails?.location?.state)) {
					storeData.location.agent_store.state = storeUpdateDetails?.location?.state;
				}

				if (!isEmpty(storeUpdateDetails?.location?.pincode)) {
					storeData.location.agent_store.pincode = storeUpdateDetails?.location?.pincode;
				}

				if (!isEmpty(storeUpdateDetails?.business_code)) {
					storeData.business.business_type.code = storeUpdateDetails?.business_code;
				}

				if (!isEmpty(storeUpdateDetails?.store_category)) {
					storeData.business.business_type.name = storeUpdateDetails?.store_category;
				}

				if (!isEmpty(storeUpdateDetails?.store_subCategory)) {
					storeData.business.business_type.subCategory = storeUpdateDetails?.store_subCategory;
				}

				if (!isEmpty(storeUpdateDetails?.name)) {
					storeData.name = {store: storeUpdateDetails?.name};
					storeData.business.name = storeUpdateDetails?.name;
				}

				if (!isEmpty(storeUpdateDetails?.sub_merchant_name)) {
					storeData.sub_merchant_name = storeUpdateDetails?.sub_merchant_name;
				}

				if (!isEmpty(storeUpdateDetails?.sub_merchant_id)) {
					storeData.sub_merchant_id = storeUpdateDetails?.sub_merchant_id;
				}

				let options = {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/update/' + storeId,
					body: storeData,
					admin: storeUpdateDetails?.loggedUser
				};

				let storeUpdate = await networkCall(options);
				if (storeUpdate?.error)
					app_error(storeUpdate?.error, {}, 'Update Store', storeUpdateDetails?.loggedUser);
				let resultData = JSON.parse(storeUpdate?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message || 'Could not update store. Please try after sometimes',
						resultData,
						storeUpdateDetails?.loggedUser,
						'Update Store'
					);
					return {
						error: true,
						message: resultData?.message || 'Could not update store. Please try after sometimes'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Update Store', storeUpdateDetails?.loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To change status of store
	 * @param loggedUser
	 * @param storeId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	changeStatus: async (loggedUser, storeId) => {
		let existingStore = await findOneStore({store_id: storeId}, '', true);
		if (isEmpty(existingStore)) {
			app_warning('Store Not Found!', {store_id: storeId}, loggedUser, 'Store Change Status');
			return {error: true, message: 'Store Not Found!'};
		} else {
			try {
				let options = {
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/change-status/' + storeId,
					method: 'PATCH',
					admin: loggedUser
				};

				let storeStatusUpdate = await networkCall(options);
				if (storeStatusUpdate?.error)
					app_error(storeStatusUpdate?.error, {}, 'Store Change Status', loggedUser);
				let resultData = JSON.parse(storeStatusUpdate?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message || 'Could not update status. Please try after sometimes.',
						resultData,
						loggedUser,
						'Store Change Status'
					);
					return {
						error: true,
						message: resultData?.message || 'Could not update status. Please try after sometimes.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Store Change Status', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To view a store in detail
	 * @param loggedUser
	 * @param storeId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	storeDetails: async (loggedUser, storeId) => {
		let existingStore = await findOneStore({store_id: storeId}, '', true);
		if (isEmpty(existingStore)) {
			app_warning('Store Not Found!', {store_id: storeId}, loggedUser, 'Store Details');
			return {error: true, message: 'Store Not Found!'};
		} else {
			try {
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/details/' + storeId,
					admin: loggedUser
				};

				let storeDetails = await networkCall(options);
				if (storeDetails?.error) app_error(storeDetails?.error, {}, 'Store Details', loggedUser);
				let resultData = JSON.parse(storeDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong while fetching store details. Please try again after sometimes.',
						resultData,
						loggedUser,
						'Store Details'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong while fetching store details. Please try again after sometimes.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Store Details', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To list stores
	 * @param query
	 * @param merchantId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	listStores: async (query, merchantId, loggedUser) => {
		try {
			let options = {
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/list',
				method: 'GET',
				admin: loggedUser
			};
			if (!isEmpty(merchantId)) {
				let existingMerchant = await findOneMerchant({merchant_id: merchantId, status: 'active'}, '', true);
				if (isEmpty(existingMerchant)) {
					app_warning(
						'Merchant Not Found!',
						{merchant_id: merchantId, status: 'active'},
						loggedUser,
						'List Stores'
					);
					return {error: true, message: 'Merchant Not Found!'};
				}
				options.url += '/' + merchantId;
			}
			if (!isEmpty(query)) {
				let queryData = {};
				if (query?.limit) queryData.limit = query?.limit;
				if (query?.page) queryData.page = query?.page;
				if (query?.from_time) queryData.from_time = query?.from_time;
				if (query?.to_time) queryData.to_time = query?.to_time;
				if (query?.date_option) queryData.date_option = query?.date_option;
				if (query?.request_for) queryData.request_for = query?.request_for;
				if (query?.status) queryData.status = query?.status;
				if (query?.store_id) {
					let existingStore = await findOneStore({store_id: query?.store_id}, '', true);
					if (isEmpty(existingStore)) {
						app_warning('Store Not Found!', {store_id: query?.store_id}, loggedUser, 'List Stores');
						return {error: true, message: 'Store Not Found!'};
					}
					queryData.store_id = query?.store_id;
				}
				if (query?.store_name) queryData.store_name = query?.store_name;
				if (query?.merchant_id) {
					let existingMerchant = await findOneMerchant(
						{merchant_id: query?.merchant_id, status: 'active'},
						'',
						true
					);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: query?.merchant_id, status: 'active'},
							loggedUser,
							'List Stores'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					queryData.merchant_id = query?.merchant_id;
				}

				let urlAppender = new URLSearchParams(queryData);
				options.url += '?' + urlAppender;
			}

			let storeList = await networkCall(options);
			if (storeList?.error) app_error(storeList?.error, {}, 'List Stores', loggedUser);
			let resultData = JSON.parse(storeList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'There is no store list', resultData, loggedUser, 'List Stores');
				return {error: true, message: resultData?.message || 'There is no store list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'List Stores', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To delete a store
	 * @param loggedUser
	 * @param storeId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	deleteStore: async (loggedUser, storeId) => {
		try {
			let existingStore = await findOneStore({store_id: storeId}, '', true);
			if (isEmpty(existingStore)) {
				app_warning('Store Not Found!', {store_id: storeId}, loggedUser, 'Store Delete');
				return {error: true, message: 'Store Not Found!'};
			}
			let options = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/delete-store/' + storeId,
				admin: loggedUser
			};

			let deleteStore = await networkCall(options);
			if (deleteStore?.error) app_error(deleteStore?.error, {}, 'Store Delete', loggedUser);
			let resultData = JSON.parse(deleteStore?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Store could not be deleted.',
					resultData,
					loggedUser,
					'Store Delete'
				);
				return {
					error: true,
					message: resultData?.message || 'Store could not be deleted.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Store Delete', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = StoreController;
