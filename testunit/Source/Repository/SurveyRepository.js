const SurveyModel = require('../Models/SurveyModel');
const {isEmpty} = require('../Helpers/Utils');

const SurveyQuery = {
	findOneSurvey: async (condition, projection, options) => {
		if (isEmpty(condition) || isEmpty(projection)) {
			return false;
		}
		if (isEmpty(options)) {
			options = {lean: true};
		}
		return await SurveyModel.findOne(condition, projection, options);
	}
};

module.exports = SurveyQuery;
