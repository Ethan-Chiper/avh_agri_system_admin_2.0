const {check} = require('express-validator');

const validation = {
	cityValidation: () => {
		return [check('name.full').notEmpty({ignore_whitespace: true}).withMessage('Name should not be empty')];
	}
};
