const {check} = require('express-validator');

const MerchantValidation = {
	createValidator: () => {
		return [
			check('phone', 'Please provide valid mobile number')
				.trim()
				.notEmpty()
				.isMobilePhone('en-IN')
				.withMessage('Phone Number should be Indian.'),
			check('merchant_name', 'Please provide merchant full name.')
				.trim()
				.notEmpty()
				.isLength({max: 254})
				.withMessage('Your name must not exceed 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.'),
			check('location.street_name', 'Please provide street name').trim().notEmpty(),
			check('location.area', 'Please provide area').trim().notEmpty(),
			check('location.city', 'Please provide city').trim().notEmpty(),
			check('location.state', 'Please provide state').trim().notEmpty(),
			check('location.pincode', 'Please provide pincode').trim().notEmpty(),
			check('loc', 'Please provide latitude and longitude')
				.trim()
				.isArray({min: 2, max: 2})
				.withMessage('Please provide latitude and longitude')
		];
	},

	listValidator: () => {
		return [
			check('phone')
				.trim()
				.optional({nullable: true})
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('business_type')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['enterprise', 'trade'])
				.withMessage('Business Type should either be enterprise or trade'),
			check('merchant_id').trim().optional({nullable: true}),
			check('merchant_name').trim().optional({nullable: true}),
			check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('from_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('to_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['active', 'deactive'])
				.withMessage('Please provide status as active or deactive'),
			check('document_status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['submitted', 'approved', 'unfilled'])
				.withMessage('Please provide document status as submitted, approved, or unfilled')
		];
	},

	exportValidator: () => {
		return [
			check('date_option')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['today', 'yesterday', 'weekly', 'monthly', 'yearly'])
				.withMessage('Please provide date_option as today, yesterday, weekly, monthly, or yearly!')
		];
	}
};

module.exports = MerchantValidation;
