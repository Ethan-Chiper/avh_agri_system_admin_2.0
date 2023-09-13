const FarmerModel = require('../Models/FarmerModel');
const {isEmpty} = require('../Helpers/Utils');

const FarmerQuery = {
	/**
	 * To do database query on Admin Model.
	 * @param queryOptions
	 * @returns {Promise<*>}
	 */
	findOneFarmer: async (queryOptions) => {
		if (isEmpty(queryOptions?.method)) queryOptions.method = 'findOne';
		let projection = queryOptions?.projection || {};
		let condition = queryOptions?.condition || {};
		let options = queryOptions?.options || {lean: true};
		return await FarmerModel[queryOptions.method](condition, projection, options);
	},

	createFarmer: async (queryOptions) => {
		let document = queryOptions || {};
		let options = queryOptions?.options || {};
		const customer = await FarmerModel.create([document],options);
		return customer[0];
	},

	//For testing purpose
	deleteFarmer: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return FarmerModel.deleteOne(condition, options);
	}
};

module.exports = FarmerQuery;
