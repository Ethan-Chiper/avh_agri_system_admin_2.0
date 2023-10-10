const PartnerModel = require('../Models/PartnerModel');
const {isEmpty} = require('../Helpers/Utils');

const PartnerQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param useLean
	 * @returns {Promise<boolean>}
	 */
	findOnePartner: async (condition, projection, useLean) => {
		if (isEmpty(projection)) {
			projection = {status: 1, partner_id: 1, createdAt: 1};
		}
		return await PartnerModel.findOne(condition, projection).lean(useLean);
	}
};

module.exports = PartnerQuery;
