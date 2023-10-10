const DisputeModel = require('../Models/DisputeModel');
const {isEmpty} = require('../Helpers/Utils');
const DisputeQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param useLean
	 * @returns {Promise<boolean>}
	 */
	findOneDispute: async (condition, projection, useLean) => {
		if (isEmpty(projection)) {
			projection = {status: 1, dispute_id: 1};
		}
		return await DisputeModel.findOne(condition, projection).lean(useLean);
	}
};

module.exports = DisputeQuery;
