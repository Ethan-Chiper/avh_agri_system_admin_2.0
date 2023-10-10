const CONFIG = require('../App/Config');
const {isEmpty, networkCall, getShortId} = require('../Helpers/Utils');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {findOneStore} = require('../Repository/StoreRepository');
const {findOneSubUser} = require('../Repository/SubUserRepository');
const {app_warning, app_error} = require('../Helpers/Logger');

const SubUserController = {
	/**
	 * To create sub user
	 * @param subUserCreateData
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{messsage: string, error: boolean}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	createSubUser: async (subUserCreateData, merchantId) => {
		try {
			let existingMerchant = await findOneMerchant({merchant_id: merchantId, role: 'merchant'}, {name: 1}, true);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, role: 'merchant'},
					subUserCreateData?.loggedUser,
					'Sub User Create'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}
			let existingMerchantWithNumber = await findOneMerchant(
				{
					'phone.national_number': subUserCreateData?.phone
				},
				'',
				true
			);
			if (!isEmpty(existingMerchantWithNumber)) {
				app_warning(
					'Phone Number Already Exists',
					{
						'phone.national_number': subUserCreateData?.phone
					},
					subUserCreateData?.loggedUser,
					'Sub User Create'
				);
				return {error: true, message: 'Phone Number Already Exists'};
			}
			let existingStore = await findOneStore(
				{
					store_id: subUserCreateData?.store_id,
					status: 'active',
					merchant_id: merchantId
				},
				{name: 1},
				true
			);
			if (isEmpty(existingStore)) {
				app_warning(
					'Store Not Found!',
					{
						store_id: subUserCreateData?.store_id,
						status: 'active',
						merchant_id: merchantId
					},
					subUserCreateData?.loggedUser,
					'Sub User Create'
				);
				return {error: true, message: 'Store Not Found!'};
			}
			let subUser = await findOneSubUser({'phone.national_number': subUserCreateData?.phone}, '', true);
			if (!isEmpty(subUser)) {
				app_warning(
					'SubUser Already Exists!',
					{'phone.national_number': subUserCreateData?.phone},
					subUserCreateData?.loggedUser,
					'Sub User Create'
				);
				return {error: true, message: 'SubUser Already Exists!'};
			}
			let subUserData = {
				sub_user_id: getShortId(),
				name: subUserCreateData?.sub_user_name,
				merchant: {
					id: merchantId,
					name: existingMerchant?.name?.full
				},
				store: {
					id: subUserCreateData?.store_id,
					name: existingStore?.name?.store
				},
				phone: {
					national_number: subUserCreateData?.phone
				},
				vpa_id: subUserCreateData?.vpa_id
			};
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/create/',
				body: subUserData,
				admin: subUserCreateData?.loggedUser
			};

			let subUserCreate = await networkCall(options);
			if (subUserCreate?.error)
				app_error(subUserCreate?.error, {}, 'Create Sub User', subUserCreateData?.loggedUser);
			let resultData = JSON.parse(subUserCreate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not create sub user',
					resultData,
					subUserCreateData?.loggedUser,
					'Sub User Create'
				);
				return {error: true, message: resultData?.message || 'Could not create sub user'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Create Sub User', subUserCreateData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To update sub user
	 * @param subUserUpdateDetails
	 * @param subUserId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	updateSubUser: async (subUserUpdateDetails, subUserId) => {
		let subUser = await findOneSubUser({sub_user_id: subUserId, status: 'active'}, {merchant: 1, store: 1}, true);
		if (isEmpty(subUser)) {
			app_warning(
				'SubUser Not Found!',
				{sub_user_id: subUserId, status: 'active'},
				subUserUpdateDetails?.loggedUser,
				'Sub User Update'
			);
			return {error: true, message: 'SubUser Not Found!'};
		}
		let existingStore;
		if (subUserUpdateDetails?.store_id) {
			existingStore = await findOneStore(
				{
					store_id: subUserUpdateDetails?.store_id,
					merchant_id: subUser?.merchant?.id
				},
				{store_id: 1, name: 1, merchant_id: 1},
				true
			);

			if (isEmpty(existingStore)) {
				app_warning(
					'Store Not Found!',
					{
						store_id: subUserUpdateDetails?.store_id,
						merchant_id: subUser?.merchant?.id
					},
					subUserUpdateDetails?.loggedUser,
					'Sub User Update'
				);
				return {error: true, message: 'Store Not Found!'};
			}
		}
		try {
			if (!isEmpty(subUserUpdateDetails?.phone)) {
				let numberExists = await findOneSubUser(
					{'phone.national_number': subUserUpdateDetails?.phone, sub_user_id: {$ne: subUserId}},
					'',
					true
				);
				if (!isEmpty(numberExists)) {
					app_warning(
						'Phone Number Already Exists',
						{'phone.national_number': subUserUpdateDetails?.phone, sub_user_id: {$ne: subUserId}},
						subUserUpdateDetails?.loggedUser,
						'Sub User Update'
					);
					return {error: true, message: 'Phone Number Already Exists'};
				}
			}
			let subUserData = {
				merchant: {id: subUser?.merchant?.id}
			};
			if (!isEmpty(subUserUpdateDetails?.store_id)) {
				subUserData.store = {
					id: existingStore?.store_id,
					name: existingStore?.name?.store
				};
			}
			if (!isEmpty(subUserUpdateDetails?.sub_user_name)) {
				subUserData.name = subUserUpdateDetails?.sub_user_name;
			}
			if (!isEmpty(subUserUpdateDetails?.phone)) {
				subUserData.phone = {national_number: subUserUpdateDetails?.phone};
			}
			if (!isEmpty(subUserUpdateDetails?.vpa_id)) {
				subUserData.vpa_id = subUserUpdateDetails?.vpa_id;
			}

			let options = {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/update/' + subUserId,
				body: subUserData,
				admin: subUserUpdateDetails?.loggedUser
			};
			let subUserUpdate = await networkCall(options);
			if (subUserUpdate?.error)
				app_error(subUserUpdate?.error, {}, 'Update Sub User', subUserUpdateDetails?.loggedUser);
			let resultData = JSON.parse(subUserUpdate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message ||
						'Something went wrong. Could not update Sub User. Please try after sometimes',
					resultData,
					subUserUpdateDetails?.loggedUser,
					'Sub User Update'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong. Could not update Sub User. Please try after sometimes'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Update Sub User', subUserUpdateDetails?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To change status of sub user
	 * @param loggedUser
	 * @param subUserId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	changeStatus: async (loggedUser, subUserId) => {
		let subUser = await findOneSubUser({sub_user_id: subUserId}, '', true);
		if (isEmpty(subUser)) {
			app_warning('Sub User Not Found!', {sub_user_id: subUserId}, loggedUser, 'Sub User Change Status');
			return {error: true, message: 'Sub User Not Found!'};
		} else {
			try {
				let options = {
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/change-status/' + subUserId,
					method: 'PATCH',
					admin: loggedUser
				};

				let subUserStatusChange = await networkCall(options);
				if (subUserStatusChange?.error)
					app_error(subUserStatusChange?.error, {}, 'Sub User Change Status', loggedUser);
				let resultData = JSON.parse(subUserStatusChange?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong. Could not update status for Sub User. Please try after sometimes',
						resultData,
						loggedUser,
						'Sub User Change Status'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong. Could not update status for Sub User. Please try after sometimes'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Sub User Change Status', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * to view a sub user detail
	 * @param loggedUser
	 * @param subUserId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	subUserDetails: async (loggedUser, subUserId) => {
		let subUser = await findOneSubUser({sub_user_id: subUserId}, '', true);
		if (isEmpty(subUser)) {
			app_warning('Sub User Not Found!', {sub_user_id: subUserId}, loggedUser, 'Sub User Details');
			return {error: true, message: 'Sub User Not Found!'};
		} else {
			try {
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/detail/' + subUserId,
					admin: loggedUser
				};

				let subUserDetails = await networkCall(options);
				if (subUserDetails?.error) app_error(subUserDetails?.error, {}, 'Sub User Details', loggedUser);
				let resultData = JSON.parse(subUserDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong while fetching Sub User Details. Please try after sometimes',
						resultData,
						loggedUser,
						'Sub User Details'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong while fetching Sub User Details. Please try after sometimes'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Sub User Details', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To list subUsers
	 * @param queryData
	 * @param merchantId
	 * @param storeId
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	getSubUsers: async (queryData, merchantId, storeId, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/list',
				admin: loggedUser
			};
			if (!isEmpty(merchantId)) {
				let existingMerchant = await findOneMerchant({merchant_id: merchantId, status: 'active'}, '', true);
				if (isEmpty(existingMerchant)) {
					app_warning(
						'Merchant Not Found!',
						{merchant_id: merchantId, status: 'active'},
						loggedUser,
						'Sub User List'
					);
					return {error: true, message: 'Merchant Not Found!'};
				}
				options.url += '/' + merchantId;
				if (!isEmpty(storeId)) {
					let existingStore = await findOneStore(
						{store_id: storeId, status: 'active', merchant_id: merchantId},
						'',
						true
					);
					if (isEmpty(existingStore)) {
						app_warning(
							'Store Not Found!',
							{store_id: storeId, status: 'active', merchant_id: merchantId},
							loggedUser,
							'Sub User List'
						);
						return {error: true, message: 'Store Not Found!'};
					}
					options.url += '/' + storeId;
				}
			}

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.from_time) query.from_time = queryData?.from_time;
				if (queryData?.to_time) query.to_time = queryData?.to_time;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.request_for) query.request_for = queryData?.request_for;
				if (queryData?.status) query.status = queryData?.status;
				if (queryData?.store_id) {
					let existingStore = await findOneStore({store_id: queryData?.store_id, status: 'active'}, '', true);
					if (isEmpty(existingStore)) {
						app_warning(
							'Store Not Found!',
							{store_id: queryData?.store_id, status: 'active'},
							loggedUser,
							'Sub User List'
						);
						return {error: true, message: 'Store Not Found!'};
					}
					query.store_id = queryData?.store_id;
				}
				if (queryData?.merchant_id) {
					let existingMerchant = await findOneMerchant(
						{merchant_id: queryData?.merchant_id, status: 'active'},
						'',
						true
					);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: queryData?.merchant_id, status: 'active'},
							loggedUser,
							'Sub User List'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					query.merchant_id = queryData?.merchant_id;
				}
				if (queryData?.phone) query.phone = queryData?.phone;
				if (queryData?.sub_user_id) {
					let subUser = await findOneSubUser({sub_user_id: queryData?.sub_user_id}, '', true);
					if (isEmpty(subUser)) {
						app_warning(
							'Sub User Not Found!',
							{sub_user_id: queryData?.sub_user_id},
							loggedUser,
							'Sub User List'
						);
						return {error: true, message: 'Sub User Not Found!'};
					}
					query.sub_user_id = queryData?.sub_user_id;
				}

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}

			let subUserList = await networkCall(options);
			if (subUserList?.error) app_error(subUserList?.error, {}, 'Sub User List', loggedUser);
			let resultData = JSON.parse(subUserList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message ||
						'Something went wrong while fetching Sub Users List. Please try after sometimes',
					resultData,
					loggedUser,
					'Sub User List'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong while fetching Sub Users List. Please try after sometimes'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sub User List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To delete a sub user
	 * @param loggedUser
	 * @param subUserId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	deleteSubUser: async (loggedUser, subUserId) => {
		try {
			let subUser = await findOneSubUser({sub_user_id: subUserId}, '', true);
			if (isEmpty(subUser)) {
				app_warning('Sub User Not Found!', {sub_user_id: subUserId}, loggedUser, 'Sub User Delete');
				return {error: true, message: 'Sub User Not Found!'};
			}
			let options = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/subuser/delete-sub-user/' + subUserId,
				admin: loggedUser
			};

			let deletedSubUser = await networkCall(options);
			if (deletedSubUser?.error) app_error(deletedSubUser?.error, {}, 'Sub User Delete', loggedUser);
			let resultData = JSON.parse(deletedSubUser?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Something went wrong while deleting sub user. Please try after sometimes',
					resultData,
					loggedUser,
					'Sub User Delete'
				);
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong while deleting sub user. Please try after sometimes'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Sub User Delete', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = SubUserController;
