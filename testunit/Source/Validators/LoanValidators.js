const {check} = require('express-validator');

const LoanValidation = {
	listValidator: () => {
		return [
			check('merchant_id').trim().optional({nullable: true}),
			check('loan_id').trim().optional({nullable: true}),
			check('loan_status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['applied', 'disbursed', 'pending', 'approved', 'rejected'])
				.withMessage('Please provide status as applied, disbursed, pending, approved, or rejected!'),
			check('eligible_loan_id').trim().optional({nullable: true}),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('page must be a number'),
			check('from_date').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('to_date').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('date_option')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['today', 'yesterday', 'weekly', 'monthly', 'yearly'])
				.withMessage('Please provide date_option as today, yesterday, weekly, monthly, or yearly!')
		];
	}
};

module.exports = LoanValidation;
