const {check} = require('express-validator');

const LoginValidation = {
	validateCreateAdmin: () => {
		return [
			check('email', 'Email should not be empty').notEmpty(),
			check('name', 'Name should not be empty').notEmpty(),
			check('phone_number', 'Phone number should not be empty').notEmpty(),
			check('password', 'Password should not be empty').notEmpty()
		];
	},

	verifyWhitelistRoutes: () => {
		return [check('whitelisted_routes', 'Whitelisted routes should not be empty').isArray().notEmpty()];
	},

	verifyAdminId: () => {
		return [check('admin_id', 'admin_id should not be empty').notEmpty()];
	},

	validateListSubAdmin: () => {
		return [
			//check('limit').trim().optional({nullable: true}).isNumeric().withMessage('Limit must be a number'),
			check('page').trim().optional({nullable: true}).isNumeric().withMessage('Page must be a number'),
			check('from_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('to_time').trim().optional({nullable: true}).isDate().withMessage('Must be a date'),
			check('status')
				.trim()
				.optional({nullable: true})
				.toLowerCase()
				.isIn(['active', 'deactive'])
				.withMessage('Please provide status as active or deactive'),
			check('email').trim().optional({nullable: true}).isEmail().withMessage('Must be a valid email ID'),
			check('phone')
				.trim()
				.optional({nullable: true})
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Phone Number'),
			check('sub_admin_id').trim().optional({nullable: true}),
			check('name').trim().optional({nullable: true})
		];
	}
};

module.exports = LoginValidation;
