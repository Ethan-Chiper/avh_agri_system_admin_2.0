const {check} = require('express-validator');

const SubUserValidation = {
	createValidator: () => {
		return [
			check('sub_user_name', 'Please provide Sub User Name.')
				.trim()
				.notEmpty()
				.isLength({max: 254})
				.withMessage('Your name must not exceed 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.'),
			check('phone', 'Please provide Phone Number')
				.trim()
				.notEmpty()
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('store_id', 'Please provide the store Name').trim().notEmpty(),
			check('vpa_id', 'Please provide VPA ID').trim().notEmpty()
		];
	},

	listValidator: () => {
		return [
			check('phone')
				.trim()
				.optional({nullable: true})
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('merchant_id').trim().optional({nullable: true}),
			check('sub_user_id').trim().optional({nullable: true}),
			check('store_id').trim().optional({nullable: true}),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('from_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('to_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('request_for')
				.trim()
				.optional({nullable: true})
				.equals('drop_down')
				.withMessage('Request-for must have value drop_down only'),
			check('status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['active', 'deactive'])
				.withMessage('Please provide status as active or deactive')
		];
	}
};

module.exports = SubUserValidation;
