const {check} = require('express-validator');

const PushNotificationValidation = {
	BulkValidator: () => {
		return [
			check('title', 'Please provide title').trim().notEmpty(),
			check('message', 'Please provide message').trim().notEmpty()
		];
	},

	MerchantNotificationValidator: () => {
		return [
			check('merchant_id', 'Please provide merchantId').trim().notEmpty(),
			check('title', 'Please provide title').trim().notEmpty(),
			check('message', 'Please provide message').trim().notEmpty()
		];
	}
};

module.exports = PushNotificationValidation;
