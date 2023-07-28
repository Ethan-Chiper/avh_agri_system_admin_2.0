const {check} = require('express-validator');

function Validate() {
	this.adminValidation = () => {
		return [
			check('name.full', 'please enter the name').notEmpty({ignore_whitespace: true}),
			check('phone.national_number').notEmpty().isMobilePhone('en-IN').trim(),
			check('email').notEmpty({ignore_whitespace: true})
		];
	};
}

module.exports = new Validate();
