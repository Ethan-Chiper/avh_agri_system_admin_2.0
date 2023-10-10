const AgentModel = require('../Models/AgentModel');
const {isEmpty} = require('../Helpers/Utils');

const AgentQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param islean
	 * @returns {Promise<*>}
	 */
	findOneAgent: async (condition, projection, islean = true) => {
		if (isEmpty(projection)) {
			projection = {
				agent_id: 1,
				'name.full': 1,
				status: 1,
				role: 1,
				createdAt: 1
			};
		}
		let agent = await AgentModel.findOne(condition, projection).lean(islean);
		return agent;
	},

	findAgent: async (condition, projection, islean = true) => {
		if (isEmpty(projection)) {
			projection = {
				agent_id: 1,
				'name.full': 1,
				status: 1,
				role: 1,
				createdAt: 1
			};
		}
		// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
		let agent = await AgentModel.find(condition, projection).lean(islean);
		return agent;
	}
};

module.exports = AgentQuery;
