const CustomerModel = require('../Models/CustomerModel');
const {isEmpty} = require('../Helpers/Utils');

const CustomerQuery = {
	/**
	 * To do database query on Admin Model.
	 * @param queryOptions
	 * @returns {Promise<*>}
	 */
	findOneCustomer: async (queryOptions) => {
		if (isEmpty(queryOptions?.method)) queryOptions.method = 'findOne';
		let projection = queryOptions?.projection || {};
		let condition = queryOptions?.condition || {};
		let options = queryOptions?.options || {lean: true};
		return await CustomerModel[queryOptions.method](condition, projection, options);
	},

	createCustomer: async (queryOptions) => {
		let document = queryOptions || {};
		let options = queryOptions?.options || {};
		const customer = await CustomerModel.create([document],options);
		return customer[0];
	},

	//For testing purpose
	deleteCustomer: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return CustomerModel.deleteOne(condition, options);
	}
};

module.exports = CustomerQuery;
