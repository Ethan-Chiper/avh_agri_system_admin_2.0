const {check} = require('express-validator');

const PlanValidation = {
	createValidator: () => {
		return [
			check('plan_name', 'Please provide plan name')
				.trim()
				.notEmpty()
				.isLength({max: 254})
				.withMessage('Your name must not exceed 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Plan Name must be alphabetic.'),
			check('registration_fees', 'Please provide registration fees.').trim().notEmpty(),
			check('subscription_fees', 'Please provide subscription fees.').trim().notEmpty(),
			check('emi_start', 'Please provide emi start').trim().notEmpty()
		];
	}
};

module.exports = PlanValidation;
