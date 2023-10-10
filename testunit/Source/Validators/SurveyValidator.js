const {check} = require('express-validator');

const SurveyValidator = {
	listValidator: () => {
		return [
			check('survey_id').trim().optional({nullable: true}),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('from_time')
				.optional({nullable: true})
				.isISO8601()
				.withMessage('Must be a date with format yyyy-mm-dd'),
			check('to_time')
				.optional({nullable: true})
				.isISO8601()
				.withMessage('Must be a date with format yyyy-mm-dd'),
			check('step', 'The value for step is either 1, 2, 3, or 4')
				.optional({nullable: true})
				.isNumeric()
				.isIn([1, 2, 3, 4]),
			check('status')
				.optional({nullable: true})
				.isIn(['pending', 'completed'])
				.withMessage('Status should be either pending or completed!'),
			check('date_option')
				.optional({nullable: true})
				.isIn(['today', 'yesterday', 'weekly', 'monthly', 'yearly'])
				.withMessage('date_option must have today, yesterday, weekly, monthly, or yearly values only'),
			check('is_lead', 'The value for is_lead is true or false').optional({nullable: true}).isBoolean(),
			check('merchant_type')
				.optional({nullable: true})
				.isIn(['proprietor', 'partnership', 'companies'])
				.withMessage('The merchant type should be proprietor, partnership, or companies'),
			check('outlet_type')
				.optional({nullable: true})
				.isIn(['fixed', 'non_fixed'])
				.withMessage('The Outlet Type should be fixed or non_fixed'),
			check('turnover')
				.optional({nullable: true})
				.isIn(['0', '0-1_lakh', '1-5_lakh', '5-10_lakh', '10-30_lakh', '30plus_lakh'])
				.withMessage(
					'Turn Over per month should be of values 0, 0-1_lakh, 1-5_lakh, 5-10_lakh, 10-30_lakh, 30plus_lakh'
				),
			check('agent_id').trim().optional({nullable: true})
		];
	}
};

module.exports = SurveyValidator;
