const {check} = require('express-validator');

function validation() {
	this.cityValidation = () => {
		return [check('name.full').notEmpty({ignore_whitespace: true}).withMessage('Name should not be empty')];
	};
}
