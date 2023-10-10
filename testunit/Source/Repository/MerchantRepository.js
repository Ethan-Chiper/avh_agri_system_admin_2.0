const MerchantModel = require('../Models/MerchantModel');
const {isEmpty} = require('../Helpers/Utils');
const MerchantQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param useLean
	 * @returns {Promise<boolean>}
	 */
	findOneMerchant: async (condition, projection, useLean) => {
		if (isEmpty(projection)) {
			projection = {status: 1, merchant_id: 1};
		}
		if (!useLean) projection.createdAt = 1;
		return await MerchantModel.findOne(condition, projection).lean(useLean);
	},

	//For testing purpose
	createMerchant: async (queryOptions) => {
		let document = queryOptions?.document || {};
		let options = queryOptions?.options || {};
		const merchant = await MerchantModel.create([document], options);
		return merchant[0];
	},

	//For testing purpose
	deleteMerchant: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return await MerchantModel.deleteOne(condition, options);
	}
};

module.exports = MerchantQuery;
