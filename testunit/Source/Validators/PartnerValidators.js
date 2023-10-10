/* eslint-disable jsdoc/valid-types */
const {check} = require('express-validator');
const net = require('node:net');

const PartnerValidation = {
	/**
	 * To validate Partner Create
	 * @returns {[ValidationChain]}
	 */
	createValidator: () => {
		return [
			check('email', 'Please provide Email ID.')
				.trim()
				.notEmpty()
				.isEmail()
				.withMessage('Please provide valid email.'),
			check('phone', 'Please provide Mobile Number.')
				.trim()
				.notEmpty()
				.isMobilePhone('en-IN')
				.withMessage('Please provide a valid Mobile Number'),
			check('name', 'Please provide the name of the partner.').trim().notEmpty(),
			check('vpa_prefix', 'Please provide vpa prefix').trim().notEmpty(),
			check('whitelisted_ips', 'Please provide IP for whitelisting')
				.notEmpty()
				.custom((value) => {
					for (const ip of value) {
						if (!net.isIP(ip)) {
							throw new Error(`${ip} is not a valid IP address`);
						}
					}
					return true;
				}),
			check('is_approval_enabled', 'Please provide is_approval_enabled')
				.trim()
				.notEmpty()
				.isBoolean()
				.withMessage('is_approval_enabled should be boolean')
		];
	}
};

module.exports = PartnerValidation;
