const CONFIG = require('../App/Config');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {findOneStore} = require('../Repository/StoreRepository');
const {isEmpty, networkCall} = require('./Utils');
const {app_warning, app_error} = require('./Logger');
const updateHelper = {
	merchantUpdate: async (updateData, merchantId, loggedUser) => {
		try {
			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					status: 'active'
				},
				{merchant_id: 1},
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active'},
					loggedUser,
					'Merchant Update'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}
			let options = {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/update/' + merchantId,
				body: updateData,
				admin: loggedUser
			};
			return await networkCall(options);
		} catch (error) {
			app_error(error, {}, 'Merchant Update', loggedUser);
			return {error};
		}
	},

	storeUpdate: async (updateData, merchantId, storeId, loggedUser) => {
		try {
			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					status: 'active'
				},
				{merchant_id: 1},
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active'},
					loggedUser,
					'Store Update'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}
			let existingStore = await findOneStore(
				{store_id: storeId, merchant_id: merchantId, status: 'active'},
				{},
				true
			);
			if (isEmpty(existingStore)) {
				app_warning(
					'Store Not Found!',
					{store_id: storeId, merchant_id: merchantId, status: 'active'},
					loggedUser,
					'Store Update'
				);
				return {error: true, message: 'Store Not Found!'};
			}
			let options = {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/store/update/' + storeId,
				body: updateData,
				admin: loggedUser
			};
			return await networkCall(options);
		} catch (error) {
			app_error(error, {}, 'Store Update', loggedUser);
			return {error};
		}
	}
};

module.exports = updateHelper;
