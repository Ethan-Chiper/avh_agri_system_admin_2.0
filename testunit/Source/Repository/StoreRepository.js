const StoreModel = require('../Models/StoreModel');
const {isEmpty} = require('../Helpers/Utils');

const StoreQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param useLean
	 * @returns {Promise<boolean>}
	 */
	findOneStore: async (condition, projection, useLean) => {
		if (isEmpty(projection)) {
			projection = {status: 1, store_id: 1};
		}
		return await StoreModel.findOne(condition, projection).lean(useLean);
	},

	//For testing purpose
	createStore: async (queryOptions) => {
		let document = queryOptions?.document || {};
		let options = queryOptions?.options || {};
		const store = await StoreModel.create([document], options);
		return store[0];
	},

	//For testing purpose
	deleteStore: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return await StoreModel.deleteOne(condition, options);
	}
};

module.exports = StoreQuery;
