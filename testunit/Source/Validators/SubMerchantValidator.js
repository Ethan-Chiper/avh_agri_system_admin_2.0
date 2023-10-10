const {check} = require('express-validator');

const SubMerchantValidation = {
	createValidator: () => {
		return [
			check('phone', 'Please provide valid mobile number').trim().notEmpty().isMobilePhone('en-IN'),
			check('merchant_name', 'Please provide merchant full name.')
				.trim()
				.notEmpty()
				.isLength({max: 254})
				.withMessage('Your name must not exceed 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.')
		];
	},

	listValidation: () => {
		return [
			check('phone')
				.trim()
				.optional({nullable: true})
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('merchant_name').trim().optional({nullable: true}),
			check('store_name').trim().optional({nullable: true}),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('merchant_id').trim().optional({nullable: true}),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['active', 'deactive'])
				.withMessage('Please provide status as active or deactive')
		];
	}
};

module.exports = SubMerchantValidation;
