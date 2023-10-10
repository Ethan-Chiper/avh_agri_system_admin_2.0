const {check} = require('express-validator');

const StoreValidation = {
	createValidator: () => {
		return [
			check('name', 'Please provide store name')
				.trim()
				.notEmpty()
				.isLength({max: 254})
				.withMessage('Your name must not exceed 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.'),
			check('store_category', 'Please provide store category.').trim().notEmpty(),
			check('store_subCategory', 'Please provide sub category.').trim().notEmpty(),
			check('settlement_type', 'Please provide settlement type').trim().notEmpty(),
			check('location.street_name', 'Please provide street name').trim().notEmpty(),
			check('location.area', 'Please provide area').trim().notEmpty(),
			check('location.city', 'Please provide city').trim().notEmpty(),
			check('location.state', 'Please provide state').trim().notEmpty(),
			check('location.pincode', 'Please provide pincode').trim().notEmpty()
		];
	},

	listValidator: () => {
		return [
			check('merchant_id').trim().optional({nullable: true}),
			check('store_name').trim().optional({nullable: true}),
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

module.exports = StoreValidation;
