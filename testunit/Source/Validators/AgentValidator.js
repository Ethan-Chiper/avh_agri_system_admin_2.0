const {check} = require('express-validator');

const AgentValidator = {
	createValidator: () => {
		return [
			check('name.full', 'Please provide name.')
				.notEmpty()
				.isLength({min: 1, max: 254})
				.withMessage('name must be between 1 and 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.'),
			check('phone.national_number', 'Please provide valid mobile number.')
				.notEmpty()
				.trim()
				.isMobilePhone('en-IN')
				.withMessage('Invalid mobile number'),
			check('location.city.name', 'Please provide valid city.').notEmpty(),
			check('location.state.code', 'Please provide state code.').notEmpty(),
			check('location.state.name', 'Please provide state name.').notEmpty()
		];
	},
	changeRoleValidator: () => {
		return [
			check('agent_id', 'Please provide agentId.').notEmpty(),
			check('new_role', 'Please provide new role.').notEmpty()
		];
	},
	editAgentValidator: () => {
		return [
			check('agent_id', 'Please provide agentId.').notEmpty(),
			check('phone', 'Please provide phone.').notEmpty(),
			check('agent_name', 'Please provide agent name.').notEmpty()
		];
	},
	mapAgentvalidatior: () => {
		return [
			check('reference.asm.id', 'Please provide asm id.').notEmpty(),
			check('reference.asm.name', 'Please provide asm id.').notEmpty()
		];
	},
	approveClockIn: () => {
		return [check('phone_number', 'Please provide agent phone number').notEmpty()];
	},
	locationMapping: () => {
		return [
			check('location.flat_no', 'Please provide flat no').notEmpty(),
			check('location.street_name', 'Please provide street name').notEmpty(),
			check('location.area', 'Please provide area').notEmpty(),
			check('location.city.name', 'Please provide city name').notEmpty(),
			check('location.city.code', 'Please provide city code').notEmpty(),
			check('location.state.name', 'Please provide state name').notEmpty(),
			check('location.state.code', 'Please provide state name').notEmpty(),
			check('location.pincode', 'Please provide pincode').notEmpty()
		];
	}
};

module.exports = AgentValidator;
