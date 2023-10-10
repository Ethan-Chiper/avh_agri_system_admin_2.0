const {check} = require('express-validator');

const PurchaseOrderValidator = {
	dsnMapValidator: () => {
		return [
			check('serial_number', 'Please provide a device serial number.').trim().notEmpty(),
			check('vpa_id', 'Please provide a vpa id.').trim().notEmpty()
		];
	},

	changeDeliveryStatusValidator: () => {
		return [
			check('orderId', 'Please provide a order id.').trim().notEmpty(),
			check('status', 'Please provide a valid status.')
				.trim()
				.notEmpty()
				.isIn(['dispatched', 'intransit', 'completed'])
		];
	},

	assignUserForOrderValidator: () => {
		return [
			check('orderId', 'Please provide a order id.').trim().notEmpty(),
			check('user_id', 'Please provide a user id.').trim().notEmpty()
		];
	},

	listValidator: () => {
		return [
			check('delivery_status', 'please provide the valid delivery status')
				.isIn(['pending', 'initiated', 'completed'])
				.optional({nullable: true}),
			check('status', 'please provide the valid order status')
				.isIn(['initiated', 'processing', 'completed', 'cancelled'])
				.optional({nullable: true}),
			check('refund_status', 'please provide the valid refund status')
				.isIn(['pending', 'initiated', 'completed'])
				.optional({nullable: true})
		];
	},

	cancellationValidator: () => {
		return [check('reason', 'please provide the reason').notEmpty().trim()];
	},

	refundStatusValidator: () => {
		return [check('utr_no', 'please provide the utr numner').notEmpty().trim()];
	}
};

module.exports = PurchaseOrderValidator;
