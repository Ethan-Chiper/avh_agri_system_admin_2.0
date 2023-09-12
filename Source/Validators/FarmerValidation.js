const {check} = require('express-validator');

const Validate = {
	/**
	 * Farmer Validation
	 * @returns
	 */
	farmerValidation: () => {
		return [
			check('name.full', 'please enter the name').notEmpty({ignore_whitespace: true}),
			check('phone.national_number').notEmpty().isMobilePhone('en-IN').trim(),
			check('email').notEmpty({ignore_whitespace: true})
		];
	},

	/**
	 * Login Validation
	 * @returns
	 */
	LoginValidation: () => {
		return [
			check('name', 'please enter your name').notEmpty({ignore_whitespace: true}),
			check('email').notEmpty({ignore_whitespace: true})
		];
	}
};

module.exports = Validate;
