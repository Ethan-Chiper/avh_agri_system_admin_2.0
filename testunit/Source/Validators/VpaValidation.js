const {check} = require('express-validator');

const VpaValidation = {
	createValidation: () => {
		return [
			check('vpa_name', 'Please provide VPA name.').trim().notEmpty(),
			check('store_id', 'Please provide store.').trim().notEmpty(),
			check('beneficiary_id', 'Please provide beneficiary.').trim().notEmpty(),
			check('submer_type', 'Please provide VPA type.')
				.trim()
				.notEmpty()
				.isIn(['p2m', 'p2pm'])
				.withMessage('Invalid VPA type.')
		];
	},

	updateValidator: () => {
		return [
			check('merchant_id', 'Please provide a valid merchant ID').trim().notEmpty(),
			check('store_id', 'Please provide a valid store ID').trim().notEmpty(),
			check('beneficiary_id', 'Please provide a valid beneficiary ID').trim().notEmpty(),
			check('vpa', 'Please provide a valid vpa').trim().notEmpty()
		];
	},

	changeStatus: () => {
		return [check('vpa', 'Please provide valid VPA.').trim().notEmpty()];
	}
};

module.exports = VpaValidation;
