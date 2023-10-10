/* eslint-disable jsdoc/require-returns-description,jsdoc/require-param-description,jsdoc/require-param-type */
const AdminModel = require('../Models/AdminModel');
const {isEmpty} = require('../Helpers/Utils');

const AdminQuery = {
	/**
	 * To do database query on Admin Model.
	 * @param queryOptions
	 * @returns {Promise<*>}
	 */
	findOneAdmin: async (queryOptions) => {
		if (isEmpty(queryOptions?.method)) queryOptions.method = 'findOne';
		let projection = queryOptions?.projection || {admin_id: 1, status: 1};
		let condition = queryOptions?.condition || {};
		let options = queryOptions?.options || {lean: true};

		return await AdminModel[queryOptions.method](condition, projection, options);
	},

	createAdmin: async (queryOptions) => {
		let document = queryOptions?.document || {};
		let options = queryOptions?.options || {};
		const admin = await AdminModel.create([document], options);
		return admin[0];
	},

	//For testing purpose
	deleteAdmin: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return await AdminModel.deleteOne(condition, options);
	}
};

module.exports = AdminQuery;
