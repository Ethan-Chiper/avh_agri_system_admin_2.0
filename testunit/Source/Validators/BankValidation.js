const {check} = require('express-validator');

const Validation = {
	createBankAccountValidator: () => {
		return [
			check('merchant_id', 'must be a valid merchantId').trim().notEmpty(),
			check('acc_no', 'must be a valid bank account number').trim().notEmpty(),
			check('acc_holder_name', 'must be a valid bank account holder name').trim().notEmpty(),
			check('ifsc', 'must provide ifsc or provide valid ifsc').trim().notEmpty()
		];
	},

	bankListValidation: () => {
		return [
			check('phone')
				.trim()
				.optional({nullable: true})
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number')
		];
	}
};

module.exports = Validation;
