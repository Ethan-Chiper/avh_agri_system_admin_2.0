const Connection = require('../App/MultiConnection');
const transactionConnection = Connection.getTransactionDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const transactionSchema = new transactionConnection.Schema({
	merchant: {
		id: {type: String},
		name: {type: String}
	},
	store: {
		id: {type: String},
		name: {type: String}
	},
	customer: {
		phone: {
			country_code: {type: String, default: '91'},
			national_number: {type: String, default: ''}
		},
		email: {
			primary: {type: String}
		},
		name: {
			full: {type: String}
		},
		id: {type: String}
	},
	cost: {
		paid: {type: String}
	},
	dynamic_count: {type: String},
	commission: {
		percentage: {type: String},
		value: {type: Number},
		tax: {type: Number},
		total: {type: Number}
	},
	partial_payment: {
		is_allowed: {type: Boolean}
	},
	payment: {
		mode: {type: String}
	},
	product: {type: String},
	upi: {
		UPI_transactionId: {type: String},
		merchant_refNo: {type: String},
		type: {type: String},
		amount: {tyoe: String},
		transaction_data: {type: String},
		status: {type: String}
	},
	pay_from: {type: String},
	variation: {type: String},
	internal: {
		receive_mode: {type: String},
		amount: {type: String},
		internal: {type: Object},
		vpa: {type: Object},
		remmiter: {type: Object},
		merchant_id: {type: String},
		utr: {type: String},
		pay_mode: {type: String},
		merch_trans_id: {type: String},
		bank: {type: String},
		product_type: {type: String}
	},
	is_reinitiated: {type: Boolean},
	is_intl_payment: {type: Boolean},
	settlement_id: {type: String, default: null},
	settlement_status: {type: String, default: null},
	settlement_date: {type: String, default: null},
	notes: {type: String},
	status: {type: String},
	failure_reason: {
		transaction: {type: String, default: null},
		recharge: {type: String, default: null}
	},
	bill_proof: {type: String},
	partner: {type: Object},
	created_on: {type: String}
});
transactionSchema.plugin(timestamps);

let transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;
