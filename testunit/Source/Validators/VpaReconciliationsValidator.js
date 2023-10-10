const {check} = require('express-validator');

const vpaReconciliationsValidation = {
	listValidation: () => {
		return [
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must have to be number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('page must have to be a number'),
			check('from_date').trim().optional({nullable: true}).isDate().withMessage('must have to be a date'),
			check('to_date').trim().optional({nullable: true}).isDate().withMessage('must have to be a date'),
			check('date_option')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['today', 'yesterday', 'weekly', 'monthly', 'yearly'])
				.withMessage('Please provide date_option as today, yesterday, weekly, monthly, or yearly!')
		];
	},
	reportValidation: () => {
		return [
			check('from_date').trim().optional({nullable: true}).isDate().withMessage('must have to be a date'),
			check('to_date').trim().optional({nullable: true}).isDate().withMessage('must have to be a date'),
			check('date_option')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['today', 'yesterday', 'weekly', 'monthly', 'yearly'])
				.withMessage('Please provide date_option as today, yesterday, weekly, monthly, or yearly!')
		];
	},
	detailValidation: () => {
		return [check('reconId', 'Please provide a recon_id').notEmpty()];
	}
};

module.exports = vpaReconciliationsValidation;
