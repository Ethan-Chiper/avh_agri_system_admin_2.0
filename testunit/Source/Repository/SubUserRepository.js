const SubUserModel = require('../Models/SubUsersModel');
const {isEmpty} = require('../Helpers/Utils');
const SubUserQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param useLean
	 * @returns {Promise<boolean>}
	 */
	findOneSubUser: async (condition, projection, useLean) => {
		if (isEmpty(projection)) {
			projection = {status: 1, sub_user_id: 1};
		}
		return await SubUserModel.findOne(condition, projection).lean(useLean);
	},

	//For testing purpose
	createSubUser: async (queryOptions) => {
		let document = queryOptions?.document || {};
		let options = queryOptions?.options || {};
		const subUser = await SubUserModel.create([document], options);
		return subUser[0];
	},

	//For testing purpose
	deleteSubUser: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return await SubUserModel.deleteOne(condition, options);
	}
};

module.exports = SubUserQuery;
