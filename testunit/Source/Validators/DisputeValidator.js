const {check} = require('express-validator');

const DisputeValidator = {
	listValidator: () => {
		return [
			check('issue_type')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['payment_issue', 'fraud_or_scam', 'missing_reward', 'other_issues'])
				.withMessage('Issue Types should be payment_issue, fraud_or_scam, missing_reward, or other_issues'),
			check('dispute_for')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['upi', 'payouts', 'insurance', 'loan'])
				.withMessage('Dispute For should be UPI, Payouts, Loan or Insurance'),
			check('dispute_id').trim().optional({nullable: true}),
			check('status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['open', 'closed', 'reopened'])
				.withMessage('Status should be either open or closed or reopened'),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('from_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('to_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date')
		];
	},

	statusChangeValidator: () => {
		return [check('comment', 'Please provide comments. Comments is a required field.').trim().notEmpty()];
	}
};

module.exports = DisputeValidator;
