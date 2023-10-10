const {check} = require('express-validator');

const mandateValidation = {
	listValidation: () => {
		return [
			check('status', 'Please provide valid status')
				.optional({nullable: true})
				.isIn(['pending', 'initiated', 'active', 'failed', 'revoked', 'paused']),
			check('mandate_for', 'please provide the mandate for').notEmpty().isIn(['sound_box', 'pos'])
		];
	},

	revokeValidation: () => {
		return [check('mandateId', 'Please provide a mandate id').notEmpty()];
	},

	statsValidation: () => {
		return [check('stats_for', 'Please provide a stats request for').isIn(['sound_box', 'pos'])];
	}
};

module.exports = mandateValidation;
